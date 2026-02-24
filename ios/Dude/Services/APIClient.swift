import Foundation

enum APIError: LocalizedError {
    case unauthorized
    case badRequest(String)
    case serverError(String)
    case networkError(Error)
    case decodingError(Error)
    case unknown(Int)

    var errorDescription: String? {
        switch self {
        case .unauthorized:
            return "Session expired. Please login again."
        case .badRequest(let message):
            return message
        case .serverError(let message):
            return message
        case .networkError(let error):
            return "Network error: \(error.localizedDescription)"
        case .decodingError(let error):
            return "Data error: \(error.localizedDescription)"
        case .unknown(let code):
            return "Unexpected error (code: \(code))"
        }
    }
}

actor APIClient {
    static let shared = APIClient()

    private let session: URLSession

    private init() {
        let config = URLSessionConfiguration.default
        config.timeoutIntervalForRequest = 60
        config.timeoutIntervalForResource = 300
        self.session = URLSession(configuration: config)
    }

    // MARK: - Core Request

    func request<T: Decodable>(
        url: String,
        method: String = "GET",
        body: Data? = nil,
        contentType: String? = "application/json",
        authenticated: Bool = true
    ) async throws -> T {
        guard let url = URL(string: url) else {
            throw APIError.badRequest("Invalid URL")
        }

        var request = URLRequest(url: url)
        request.httpMethod = method

        if let contentType {
            request.setValue(contentType, forHTTPHeaderField: "Content-Type")
        }
        request.setValue("application/json", forHTTPHeaderField: "Accept")

        if authenticated, let token = KeychainHelper.getToken() {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }

        if let body {
            request.httpBody = body
        }

        let (data, response) = try await session.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError.unknown(0)
        }

        switch httpResponse.statusCode {
        case 200...299:
            do {
                let decoder = JSONDecoder()
                return try decoder.decode(T.self, from: data)
            } catch {
                throw APIError.decodingError(error)
            }
        case 401:
            KeychainHelper.deleteToken()
            throw APIError.unauthorized
        case 400...499:
            let message = parseErrorMessage(from: data) ?? "Bad request"
            throw APIError.badRequest(message)
        default:
            let message = parseErrorMessage(from: data) ?? "Server error"
            throw APIError.serverError(message)
        }
    }

    // MARK: - Raw Data Request (for binary responses like video)

    func requestRawData(
        url: String,
        method: String = "POST",
        body: Data? = nil
    ) async throws -> (Data, HTTPURLResponse) {
        guard let url = URL(string: url) else {
            throw APIError.badRequest("Invalid URL")
        }

        var request = URLRequest(url: url)
        request.httpMethod = method
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        if let token = KeychainHelper.getToken() {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }

        if let body {
            request.httpBody = body
        }

        let (data, response) = try await session.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError.unknown(0)
        }

        return (data, httpResponse)
    }

    // MARK: - Multipart Upload

    func uploadMultipart<T: Decodable>(
        url urlString: String,
        fileData: Data,
        fileName: String,
        mimeType: String,
        fields: [String: String]
    ) async throws -> T {
        guard let url = URL(string: urlString) else {
            throw APIError.badRequest("Invalid URL")
        }

        let boundary = UUID().uuidString
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue(
            "multipart/form-data; boundary=\(boundary)",
            forHTTPHeaderField: "Content-Type"
        )

        if let token = KeychainHelper.getToken() {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }

        var body = Data()

        // Add text fields
        for (key, value) in fields {
            body.append("--\(boundary)\r\n")
            body.append("Content-Disposition: form-data; name=\"\(key)\"\r\n\r\n")
            body.append("\(value)\r\n")
        }

        // Add file
        body.append("--\(boundary)\r\n")
        body.append(
            "Content-Disposition: form-data; name=\"image\"; filename=\"\(fileName)\"\r\n"
        )
        body.append("Content-Type: \(mimeType)\r\n\r\n")
        body.append(fileData)
        body.append("\r\n")

        // Close boundary
        body.append("--\(boundary)--\r\n")

        request.httpBody = body

        let (data, response) = try await session.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError.unknown(0)
        }

        switch httpResponse.statusCode {
        case 200...299:
            do {
                return try JSONDecoder().decode(T.self, from: data)
            } catch {
                throw APIError.decodingError(error)
            }
        case 401:
            KeychainHelper.deleteToken()
            throw APIError.unauthorized
        default:
            let message = parseErrorMessage(from: data) ?? "Upload failed"
            throw APIError.serverError(message)
        }
    }

    // MARK: - DELETE (returns success bool)

    func delete(url urlString: String) async throws {
        guard let url = URL(string: urlString) else {
            throw APIError.badRequest("Invalid URL")
        }

        var request = URLRequest(url: url)
        request.httpMethod = "DELETE"

        if let token = KeychainHelper.getToken() {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }

        let (data, response) = try await session.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError.unknown(0)
        }

        if httpResponse.statusCode == 401 {
            KeychainHelper.deleteToken()
            throw APIError.unauthorized
        }

        guard (200...299).contains(httpResponse.statusCode) else {
            let message = parseErrorMessage(from: data) ?? "Delete failed"
            throw APIError.serverError(message)
        }
    }

    // MARK: - Helpers

    private func parseErrorMessage(from data: Data) -> String? {
        if let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any] {
            return json["message"] as? String ?? json["error"] as? String
        }
        return nil
    }
}

// MARK: - Data Extension for Multipart

extension Data {
    mutating func append(_ string: String) {
        if let data = string.data(using: .utf8) {
            append(data)
        }
    }
}
