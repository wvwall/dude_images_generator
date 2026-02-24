import Foundation

struct GenerateImageRequest: Codable {
    let prompt: String
    let aspectRatio: String
    let referenceImagesBase64: [String]?
    let model: String
}

struct GenerateImageResponse: Codable {
    let image: String // base64 data URI
}

struct GenerateVideoRequest: Codable {
    let prompt: String
    let image: String?
    let mimeType: String?
    let duration: Int
    let aspectRatio: String
    let resolution: String
}

struct GenerateVideoResponse: Codable {
    let operationName: String
    let status: String
}

struct CheckVideoStatusRequest: Codable {
    let operationName: String
}

struct VideoStatusResponse: Codable {
    let status: String
    let progress: Double?
}

struct EnhancePromptRequest: Codable {
    let prompt: String
}

struct EnhancePromptResponse: Codable {
    let enhancedPrompt: String
}

enum GeminiService {
    // MARK: - Generate Image

    static func generateImage(
        prompt: String,
        aspectRatio: AspectRatio,
        referenceImagesBase64: [String]? = nil,
        model: GeminiModel = .flash
    ) async throws -> Data {
        let request = GenerateImageRequest(
            prompt: prompt,
            aspectRatio: aspectRatio.rawValue,
            referenceImagesBase64: referenceImagesBase64,
            model: model.rawValue
        )
        let body = try JSONEncoder().encode(request)

        let response: GenerateImageResponse = try await APIClient.shared.request(
            url: Config.Gemini.generateImage,
            method: "POST",
            body: body,
            authenticated: false
        )

        // Parse data URI: "data:image/png;base64,iVBOR..."
        guard let base64String = response.image.components(separatedBy: ",").last,
              let imageData = Data(base64Encoded: base64String)
        else {
            throw APIError.badRequest("Invalid image data returned")
        }

        return imageData
    }

    // MARK: - Generate Video (async start)

    static func generateVideo(
        prompt: String,
        imageBase64: String? = nil,
        mimeType: String? = nil,
        duration: Int = 4,
        aspectRatio: AspectRatio = .wide,
        resolution: VideoResolution = .p720
    ) async throws -> String {
        let request = GenerateVideoRequest(
            prompt: prompt,
            image: imageBase64,
            mimeType: mimeType,
            duration: duration,
            aspectRatio: aspectRatio.rawValue,
            resolution: resolution.rawValue
        )
        let body = try JSONEncoder().encode(request)

        let response: GenerateVideoResponse = try await APIClient.shared.request(
            url: Config.Gemini.generateVideo,
            method: "POST",
            body: body,
            authenticated: false
        )

        return response.operationName
    }

    // MARK: - Check Video Status

    enum VideoStatus {
        case processing(progress: Double)
        case completed(data: Data)
    }

    static func checkVideoStatus(operationName: String) async throws -> VideoStatus {
        let request = CheckVideoStatusRequest(operationName: operationName)
        let body = try JSONEncoder().encode(request)

        let (data, httpResponse) = try await APIClient.shared.requestRawData(
            url: Config.Gemini.checkVideoStatus,
            method: "POST",
            body: body
        )

        guard (200...299).contains(httpResponse.statusCode) else {
            throw APIError.serverError("Video status check failed")
        }

        // If content type is video/mp4, it's the completed video
        let contentType = httpResponse.value(forHTTPHeaderField: "Content-Type") ?? ""
        if contentType.contains("video/mp4") {
            return .completed(data: data)
        }

        // Otherwise it's a JSON status update
        let status = try JSONDecoder().decode(VideoStatusResponse.self, from: data)
        return .processing(progress: status.progress ?? 0)
    }

    // MARK: - Enhance Prompt

    static func enhancePrompt(_ prompt: String) async throws -> String {
        let request = EnhancePromptRequest(prompt: prompt)
        let body = try JSONEncoder().encode(request)

        let response: EnhancePromptResponse = try await APIClient.shared.request(
            url: Config.Gemini.enhancePrompt,
            method: "POST",
            body: body,
            authenticated: false
        )

        return response.enhancedPrompt
    }
}
