import Foundation
import PhotosUI
import SwiftUI

@Observable
final class GenerationViewModel {
    // MARK: - Form State
    var prompt = ""
    var aspectRatio: AspectRatio = .square
    var mode: GenerationMode = .text
    var model: GeminiModel = .flash
    var videoResolution: VideoResolution = .p720
    var videoDuration: Int = 4

    // MARK: - Selected Images (for image/video mode)
    var selectedPhotos: [PhotosPickerItem] = []
    var selectedImageData: [Data] = []
    var selectedImagePreviews: [UIImage] = []

    // MARK: - Generation State
    var isGenerating = false
    var generatingPhrase = ""
    var currentImage: GeneratedImage?
    var currentImagePreview: UIImage?
    var error: String?
    var successMessage: String?

    // MARK: - Video State
    var videoStatus = ""
    var videoProgress: Double = 0
    var completedVideoURL: URL?
    private var videoOperationName: String?
    private var videoPollingTask: Task<Void, Never>?

    // MARK: - Computed

    var canGenerate: Bool {
        !prompt.trimmingCharacters(in: .whitespaces).isEmpty && !isGenerating
    }

    var showImagePicker: Bool {
        mode == .image || mode == .video
    }

    var maxImages: Int {
        mode.maxImages
    }

    // MARK: - Generate

    func generate() async {
        guard canGenerate else { return }

        isGenerating = true
        error = nil
        successMessage = nil
        currentImage = nil
        currentImagePreview = nil
        generatingPhrase = FriendsPhrases.randomGenerating

        do {
            switch mode {
            case .text, .image:
                try await generateImage()
            case .video:
                try await startVideoGeneration()
            }
        } catch {
            self.error = error.localizedDescription
            await NotificationService.errorHaptic()
        }

        if mode != .video {
            isGenerating = false
        }
    }

    // MARK: - Image Generation

    private func generateImage() async throws {
        // Convert selected images to base64 if in image mode
        var referenceImages: [String]?
        if mode == .image && !selectedImageData.isEmpty {
            referenceImages = selectedImageData.map { data in
                "data:image/png;base64,\(data.base64EncodedString())"
            }
        }

        let imageData = try await GeminiService.generateImage(
            prompt: prompt.trimmingCharacters(in: .whitespaces),
            aspectRatio: aspectRatio,
            referenceImagesBase64: referenceImages,
            model: model
        )

        // Show preview immediately
        if let preview = UIImage(data: imageData) {
            currentImagePreview = preview
        }

        // Upload to backend
        let savedImage = try await ImageService.upload(
            imageData: imageData,
            prompt: prompt.trimmingCharacters(in: .whitespaces),
            aspectRatio: aspectRatio.rawValue
        )

        currentImage = savedImage
        successMessage = FriendsPhrases.randomSuccess

        await NotificationService.successHaptic()
        NotificationService.sendCompletionNotification(type: .image, prompt: prompt)

        // Clear success message after 5 seconds
        try? await Task.sleep(for: .seconds(5))
        successMessage = nil
    }

    // MARK: - Video Generation

    private func startVideoGeneration() async throws {
        var imageBase64: String?
        var mimeType: String?

        if let firstImage = selectedImageData.first {
            imageBase64 = "data:image/png;base64,\(firstImage.base64EncodedString())"
            mimeType = "image/png"
        }

        let operationName = try await GeminiService.generateVideo(
            prompt: prompt.trimmingCharacters(in: .whitespaces),
            imageBase64: imageBase64,
            mimeType: mimeType,
            duration: videoDuration,
            aspectRatio: aspectRatio,
            resolution: videoResolution
        )

        videoOperationName = operationName
        videoStatus = "Processing..."
        videoProgress = 0

        // Start polling
        startVideoPolling(operationName: operationName)
    }

    private func startVideoPolling(operationName: String) {
        videoPollingTask?.cancel()
        videoPollingTask = Task {
            while !Task.isCancelled {
                try? await Task.sleep(for: .seconds(Config.videoPollingInterval))

                guard !Task.isCancelled else { break }

                do {
                    let status = try await GeminiService.checkVideoStatus(
                        operationName: operationName
                    )

                    switch status {
                    case .processing(let progress):
                        videoProgress = progress
                        videoStatus = "Generating... \(Int(progress * 100))%"

                    case .completed(let videoData):
                        // Save video to temp file
                        let tempURL = FileManager.default.temporaryDirectory
                            .appendingPathComponent("dude_video_\(Int(Date().timeIntervalSince1970)).mp4")
                        try videoData.write(to: tempURL)
                        completedVideoURL = tempURL

                        videoStatus = "Complete!"
                        isGenerating = false
                        successMessage = FriendsPhrases.randomSuccess

                        await NotificationService.successHaptic()
                        NotificationService.sendCompletionNotification(type: .video, prompt: prompt)

                        try? await Task.sleep(for: .seconds(5))
                        successMessage = nil
                        return
                    }
                } catch {
                    if !Task.isCancelled {
                        self.error = "Video polling error: \(error.localizedDescription)"
                        isGenerating = false
                        return
                    }
                }
            }
        }
    }

    // MARK: - Photo Selection

    func loadSelectedPhotos() async {
        selectedImageData = []
        selectedImagePreviews = []

        for item in selectedPhotos.prefix(maxImages) {
            if let data = try? await item.loadTransferable(type: Data.self) {
                // Check file size
                guard data.count <= Config.maxFileSize else { continue }

                selectedImageData.append(data)
                if let image = UIImage(data: data) {
                    selectedImagePreviews.append(image)
                }
            }
        }
    }

    // MARK: - Actions

    func clearResult() {
        currentImage = nil
        currentImagePreview = nil
        completedVideoURL = nil
        error = nil
        successMessage = nil
        videoStatus = ""
        videoProgress = 0
    }

    func clearFiles() {
        selectedPhotos = []
        selectedImageData = []
        selectedImagePreviews = []
    }

    func downloadCurrentImage() async {
        guard let preview = currentImagePreview else { return }
        UIImageWriteToSavedPhotosAlbum(preview, nil, nil, nil)
        successMessage = "Saved to Photos!"
        try? await Task.sleep(for: .seconds(3))
        successMessage = nil
    }

    func cleanup() {
        videoPollingTask?.cancel()
        videoPollingTask = nil
    }

    deinit {
        videoPollingTask?.cancel()
    }
}
