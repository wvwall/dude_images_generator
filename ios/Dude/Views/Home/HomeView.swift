import SwiftUI
import PhotosUI

struct HomeView: View {
    @State private var viewModel = GenerationViewModel()

    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                // Header
                VStack(spacing: 4) {
                    Text("DUDE")
                        .font(.system(size: 32, weight: .black, design: .rounded))
                        .foregroundColor(.friendsPurple)

                    Text("AI Creative Studio")
                        .font(.caption.weight(.medium))
                        .foregroundColor(.secondary)
                }
                .padding(.top, 8)

                // Mode Selector
                ModeSelectorView(selectedMode: $viewModel.mode)

                // Model Picker (for image modes)
                if viewModel.mode != .video {
                    ModelPickerView(selectedModel: $viewModel.model)
                }

                // Prompt Input
                PromptInputView(prompt: $viewModel.prompt)

                // Aspect Ratio
                AspectRatioPickerView(selectedRatio: $viewModel.aspectRatio)

                // Image Picker (for image/video mode)
                if viewModel.showImagePicker {
                    ImagePickerView(
                        selectedPhotos: $viewModel.selectedPhotos,
                        previews: viewModel.selectedImagePreviews,
                        maxImages: viewModel.maxImages,
                        onClear: { viewModel.clearFiles() }
                    )
                    .onChange(of: viewModel.selectedPhotos) {
                        Task { await viewModel.loadSelectedPhotos() }
                    }
                }

                // Video Settings
                if viewModel.mode == .video {
                    VideoSettingsView(
                        resolution: $viewModel.videoResolution,
                        duration: $viewModel.videoDuration
                    )
                }

                // Generate Button
                Button {
                    Task { await viewModel.generate() }
                } label: {
                    HStack(spacing: 10) {
                        if viewModel.isGenerating {
                            ProgressView()
                                .tint(.black)
                        }
                        Text(viewModel.isGenerating
                             ? viewModel.generatingPhrase
                             : "PIVOT!")
                            .fontWeight(.bold)
                    }
                }
                .buttonStyle(FriendsPrimaryButtonStyle())
                .disabled(!viewModel.canGenerate)
                .padding(.horizontal, 4)

                // Error
                if let error = viewModel.error {
                    HStack {
                        Image(systemName: "exclamationmark.triangle.fill")
                            .foregroundColor(.friendsRed)
                        Text(error)
                            .font(.caption)
                            .foregroundColor(.friendsRed)
                    }
                    .padding(12)
                    .background(Color.friendsRed.opacity(0.1))
                    .clipShape(RoundedRectangle(cornerRadius: 10))
                }

                // Success
                if let success = viewModel.successMessage {
                    HStack {
                        Image(systemName: "checkmark.circle.fill")
                            .foregroundColor(.green)
                        Text(success)
                            .font(.caption.weight(.semibold))
                            .foregroundColor(.green)
                    }
                    .padding(12)
                    .background(Color.green.opacity(0.1))
                    .clipShape(RoundedRectangle(cornerRadius: 10))
                    .transition(.move(edge: .top).combined(with: .opacity))
                }

                // Preview
                if viewModel.currentImagePreview != nil || viewModel.completedVideoURL != nil {
                    PreviewView(viewModel: viewModel)
                }

                // Video Progress
                if viewModel.isGenerating && viewModel.mode == .video && !viewModel.videoStatus.isEmpty {
                    VStack(spacing: 8) {
                        ProgressView(value: viewModel.videoProgress)
                            .tint(.friendsPurple)
                        Text(viewModel.videoStatus)
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    .padding()
                    .background(Color.friendsPurpleLight.opacity(0.3))
                    .clipShape(RoundedRectangle(cornerRadius: 12))
                }
            }
            .padding()
        }
        .background(Color.friendsPurpleLight.opacity(0.3))
        .navigationBarTitleDisplayMode(.inline)
        .onDisappear {
            viewModel.cleanup()
        }
    }
}

// MARK: - Video Settings

private struct VideoSettingsView: View {
    @Binding var resolution: VideoResolution
    @Binding var duration: Int

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("VIDEO SETTINGS")
                .font(.caption.weight(.bold))
                .foregroundColor(.secondary)

            HStack(spacing: 16) {
                // Resolution
                VStack(alignment: .leading, spacing: 4) {
                    Text("Resolution")
                        .font(.caption2)
                        .foregroundColor(.secondary)
                    Picker("Resolution", selection: $resolution) {
                        ForEach(VideoResolution.allCases) { res in
                            Text(res.rawValue).tag(res)
                        }
                    }
                    .pickerStyle(.segmented)
                }

                // Duration
                VStack(alignment: .leading, spacing: 4) {
                    Text("Duration: \(duration)s")
                        .font(.caption2)
                        .foregroundColor(.secondary)
                    Stepper("", value: $duration, in: Config.minVideoDuration...Config.maxVideoDuration)
                        .labelsHidden()
                }
            }
        }
        .padding()
        .background(.white.opacity(0.7))
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }
}
