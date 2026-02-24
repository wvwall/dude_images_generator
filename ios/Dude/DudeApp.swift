import SwiftUI

@main
struct DudeApp: App {
    @State private var authService = AuthService.shared

    var body: some Scene {
        WindowGroup {
            ContentView(authService: authService)
                .task {
                    await authService.initialize()
                    await NotificationService.requestPermission()
                }
        }
    }
}
