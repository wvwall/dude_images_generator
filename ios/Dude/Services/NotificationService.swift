import Foundation
import UserNotifications
import UIKit

enum NotificationService {
    // MARK: - Permission

    static func requestPermission() async -> Bool {
        do {
            return try await UNUserNotificationCenter.current()
                .requestAuthorization(options: [.alert, .sound, .badge])
        } catch {
            return false
        }
    }

    static func checkPermission() async -> UNAuthorizationStatus {
        let settings = await UNUserNotificationCenter.current().notificationSettings()
        return settings.authorizationStatus
    }

    // MARK: - Send Completion Notification

    static func sendCompletionNotification(type: NotificationType, prompt: String) {
        let content = UNMutableNotificationContent()

        switch type {
        case .image:
            content.title = "Dude!"
            content.body = "Your image is ready! \"\(prompt.prefix(50))\""
        case .video:
            content.title = "Dude!"
            content.body = "Your video is ready! \"\(prompt.prefix(50))\""
        }

        content.sound = .default

        let request = UNNotificationRequest(
            identifier: UUID().uuidString,
            content: content,
            trigger: nil // Deliver immediately
        )

        UNUserNotificationCenter.current().add(request)
    }

    // MARK: - Haptic Feedback

    @MainActor
    static func successHaptic() {
        UIImpactFeedbackGenerator(style: .medium).impactOccurred()
    }

    @MainActor
    static func errorHaptic() {
        UINotificationFeedbackGenerator().notificationOccurred(.error)
    }
}
