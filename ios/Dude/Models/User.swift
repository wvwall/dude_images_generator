import Foundation

struct User: Codable, Identifiable {
    let id: String
    let username: String
    let name: String?
}
