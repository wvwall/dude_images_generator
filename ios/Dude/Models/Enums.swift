import Foundation

enum AspectRatio: String, CaseIterable, Identifiable {
    case square = "1:1"
    case portrait34 = "3:4"
    case landscape43 = "4:3"
    case wide = "16:9"
    case tall = "9:16"

    var id: String { rawValue }

    var displayName: String {
        switch self {
        case .square: return "1:1"
        case .portrait34: return "3:4"
        case .landscape43: return "4:3"
        case .wide: return "16:9"
        case .tall: return "9:16"
        }
    }

    var icon: String {
        switch self {
        case .square: return "square"
        case .portrait34: return "rectangle.portrait"
        case .landscape43: return "rectangle"
        case .wide: return "rectangle.ratio.16.to.9"
        case .tall: return "rectangle.portrait"
        }
    }
}

enum GenerationMode: String, CaseIterable, Identifiable {
    case text = "text"
    case image = "image"
    case video = "video"

    var id: String { rawValue }

    var displayName: String {
        switch self {
        case .text: return "Text"
        case .image: return "Image"
        case .video: return "Video"
        }
    }

    var icon: String {
        switch self {
        case .text: return "text.cursor"
        case .image: return "photo"
        case .video: return "video"
        }
    }

    var maxImages: Int {
        switch self {
        case .text: return 0
        case .image: return 3
        case .video: return 1
        }
    }
}

enum GeminiModel: String, CaseIterable, Identifiable {
    case flash = "gemini-2.5-flash-image"
    case pro = "gemini-3-pro-image-preview"

    var id: String { rawValue }

    var displayName: String {
        switch self {
        case .flash: return "Flash (Fast)"
        case .pro: return "Pro (Quality)"
        }
    }
}

enum VideoResolution: String, CaseIterable, Identifiable {
    case p720 = "720p"
    case p1080 = "1080p"

    var id: String { rawValue }
}

enum NotificationType {
    case image
    case video
}
