import Foundation

struct GeneratedVideo: Codable, Identifiable {
    let id: String
    let prompt: String
    let timestamp: String
    let duration: Int
    let resolution: String
    let userId: String
    let assetId: String
    let asset: Asset
    let url: String?
}
