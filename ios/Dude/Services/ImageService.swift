import Foundation

enum ImageService {
    // MARK: - Fetch All Images

    static func fetchAll() async throws -> [GeneratedImage] {
        try await APIClient.shared.request(
            url: Config.Images.base,
            authenticated: true
        )
    }

    // MARK: - Fetch Single Image

    static func fetchById(_ id: String) async throws -> GeneratedImage {
        try await APIClient.shared.request(
            url: Config.Images.byId(id),
            authenticated: true
        )
    }

    // MARK: - Upload Generated Image

    static func upload(
        imageData: Data,
        prompt: String,
        aspectRatio: String,
        description: String? = nil
    ) async throws -> GeneratedImage {
        var fields: [String: String] = [
            "prompt": prompt,
            "aspectRatio": aspectRatio,
        ]
        if let description {
            fields["description"] = description
        }

        return try await APIClient.shared.uploadMultipart(
            url: Config.Images.base,
            fileData: imageData,
            fileName: "generated_\(Int(Date().timeIntervalSince1970)).png",
            mimeType: "image/png",
            fields: fields
        )
    }

    // MARK: - Delete Image

    static func delete(_ id: String) async throws {
        try await APIClient.shared.delete(url: Config.Images.byId(id))
    }
}
