import Foundation

struct Asset: Codable, Identifiable, Hashable {
    let id: String
    let filename: String
    let mimeType: String
    let size: Int
    let path: String
    let createdAt: String
}
