import SwiftUI

struct ContentView: View {
    let authService: AuthService

    var body: some View {
        Group {
            if authService.isLoading {
                LoadingView()
            } else if authService.isAuthenticated {
                MainTabView()
            } else {
                AuthView()
            }
        }
        .animation(.easeInOut(duration: 0.3), value: authService.isAuthenticated)
        .animation(.easeInOut(duration: 0.3), value: authService.isLoading)
    }
}

// MARK: - Loading View

private struct LoadingView: View {
    @State private var rotation: Double = 0

    var body: some View {
        ZStack {
            Color.friendsPurpleLight
                .ignoresSafeArea()

            VStack(spacing: 24) {
                Text("DUDE")
                    .font(.system(size: 48, weight: .black, design: .rounded))
                    .foregroundColor(.friendsPurple)

                Text("The Friends Edition")
                    .font(.subheadline)
                    .foregroundColor(.friendsPurple.opacity(0.7))

                ProgressView()
                    .tint(.friendsPurple)
                    .scaleEffect(1.2)
            }
        }
    }
}

// MARK: - Main Tab View

struct MainTabView: View {
    @State private var selectedTab = 0

    var body: some View {
        TabView(selection: $selectedTab) {
            Tab("Create", systemImage: "wand.and.stars", value: 0) {
                NavigationStack {
                    HomeView()
                }
            }

            Tab("Gallery", systemImage: "photo.on.rectangle.angled", value: 1) {
                NavigationStack {
                    GalleryView()
                }
            }
        }
        .tint(.friendsPurple)
    }
}
