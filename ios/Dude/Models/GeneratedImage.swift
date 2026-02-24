import Foundation

struct GeneratedImage: Codable, Identifiable, Hashable {
    let id: String
    let prompt: String
    let timestamp: String
    let aspectRatio: String
    let userId: String
    let assetId: String
    let asset: Asset
    let url: String?
}
