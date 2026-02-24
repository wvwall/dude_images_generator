import Foundation

struct AuthResponse: Codable {
    let user: User
    let accessToken: String
}

struct LoginRequest: Codable {
    let username: String
    let password: String
}

struct RegisterRequest: Codable {
    let username: String
    let password: String
}
