import SwiftUI

// MARK: - Friends Theme Colors

extension Color {
    static let friendsPurple = Color(hex: "#5D3F6A")
    static let friendsYellow = Color(hex: "#F4C430")
    static let friendsRed = Color(hex: "#E74C3C")
    static let friendsBlue = Color(hex: "#3498DB")
    static let friendsPurpleLight = Color(hex: "#d1caf1")
    static let friendsYellowLight = Color(hex: "#fff5cc")

    // Dark mode variants
    static let darkBg = Color(hex: "#1a1a2e")
    static let darkCard = Color(hex: "#25253e")
    static let darkBorder = Color(hex: "#3a3a5c")
}

// MARK: - Hex Color Initializer

extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 6:
            (a, r, g, b) = (255, (int >> 16) & 0xFF, (int >> 8) & 0xFF, int & 0xFF)
        case 8:
            (a, r, g, b) = ((int >> 24) & 0xFF, (int >> 16) & 0xFF, (int >> 8) & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 0, 0, 0)
        }

        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}

// MARK: - Theme-Aware Colors

extension ShapeStyle where Self == Color {
    static var themePurple: Color {
        Color.friendsPurple
    }

    static var themeYellow: Color {
        Color.friendsYellow
    }

    static var themeBackground: Color {
        Color.friendsPurpleLight
    }
}

// MARK: - Button Styles

struct FriendsPrimaryButtonStyle: ButtonStyle {
    @Environment(\.isEnabled) var isEnabled

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.headline)
            .foregroundColor(.black)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 14)
            .background(
                isEnabled
                    ? (configuration.isPressed ? Color.friendsYellow.opacity(0.8) : Color.friendsYellow)
                    : Color.gray.opacity(0.3)
            )
            .clipShape(RoundedRectangle(cornerRadius: 12))
            .scaleEffect(configuration.isPressed ? 0.97 : 1.0)
            .animation(.easeInOut(duration: 0.1), value: configuration.isPressed)
    }
}

struct FriendsSecondaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.subheadline.weight(.semibold))
            .foregroundColor(.friendsPurple)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 12)
            .background(Color.friendsPurpleLight.opacity(0.5))
            .clipShape(RoundedRectangle(cornerRadius: 10))
            .overlay(
                RoundedRectangle(cornerRadius: 10)
                    .stroke(Color.friendsPurple.opacity(0.3), lineWidth: 1)
            )
            .scaleEffect(configuration.isPressed ? 0.97 : 1.0)
    }
}

// MARK: - Friends Phrases

enum FriendsPhrases {
    static let generating = [
        "How you doin'?",
        "Pivot! Pivot! PIVOT!",
        "We were on a break!",
        "Oh. My. God.",
        "Smelly cat, smelly cat...",
        "Could this BE any slower?",
        "Unagi!",
    ]

    static let success = [
        "Could this image BE any better?",
        "It's like all my birthdays have come at once!",
        "OH MY GOD!",
        "We've got a winner!",
        "How YOU doin'?",
    ]

    static var randomGenerating: String {
        generating.randomElement() ?? generating[0]
    }

    static var randomSuccess: String {
        success.randomElement() ?? success[0]
    }
}
