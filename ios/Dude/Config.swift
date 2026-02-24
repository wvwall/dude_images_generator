import Foundation

enum Config {
    // MARK: - Backend API
    // Change this to your backend API URL
    static let apiBaseURL = "http://localhost:3001"

    // MARK: - Netlify Functions
    // Change this to your deployed Netlify site URL
    // Example: "https://dude-app.netlify.app/.netlify/functions"
    static let netlifyBaseURL = "https://YOUR-SITE.netlify.app/.netlify/functions"

    // MARK: - Endpoints

    enum Auth {
        static var login: String { "\(apiBaseURL)/api/v1/auth/login" }
        static var register: String { "\(apiBaseURL)/api/v1/auth/register" }
        static var me: String { "\(apiBaseURL)/api/v1/auth/me" }
    }

    enum Images {
        static var base: String { "\(apiBaseURL)/api/v1/images" }
        static func byId(_ id: String) -> String { "\(base)/\(id)" }
    }

    enum Videos {
        static var base: String { "\(apiBaseURL)/api/v1/videos" }
        static func byId(_ id: String) -> String { "\(base)/\(id)" }
    }

    enum Gemini {
        static var generateImage: String { "\(netlifyBaseURL)/generate-image" }
        static var generateVideo: String { "\(netlifyBaseURL)/generate-video" }
        static var checkVideoStatus: String { "\(netlifyBaseURL)/check-video-status" }
        static var enhancePrompt: String { "\(netlifyBaseURL)/enhance-prompt" }
    }

    // MARK: - Limits
    static let maxFileSize = 4 * 1024 * 1024 // 4MB
    static let videoPollingInterval: TimeInterval = 10
    static let minVideoDuration = 4
    static let maxVideoDuration = 8
}
