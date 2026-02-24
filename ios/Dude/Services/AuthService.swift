import Foundation

@Observable
final class AuthService {
    static let shared = AuthService()

    private(set) var currentUser: User?
    private(set) var isAuthenticated = false
    private(set) var isLoading = true

    private init() {}

    // MARK: - Initialize (check existing token)

    func initialize() async {
        guard KeychainHelper.getToken() != nil else {
            isLoading = false
            return
        }

        do {
            let user: User = try await APIClient.shared.request(
                url: Config.Auth.me,
                authenticated: true
            )
            self.currentUser = user
            self.isAuthenticated = true
        } catch {
            KeychainHelper.deleteToken()
            self.currentUser = nil
            self.isAuthenticated = false
        }

        isLoading = false
    }

    // MARK: - Login

    func login(username: String, password: String) async throws {
        let credentials = LoginRequest(username: username, password: password)
        let body = try JSONEncoder().encode(credentials)

        let response: AuthResponse = try await APIClient.shared.request(
            url: Config.Auth.login,
            method: "POST",
            body: body,
            authenticated: false
        )

        KeychainHelper.saveToken(response.accessToken)
        self.currentUser = response.user
        self.isAuthenticated = true
    }

    // MARK: - Register

    func register(username: String, password: String) async throws {
        let userData = RegisterRequest(username: username, password: password)
        let body = try JSONEncoder().encode(userData)

        let response: AuthResponse = try await APIClient.shared.request(
            url: Config.Auth.register,
            method: "POST",
            body: body,
            authenticated: false
        )

        KeychainHelper.saveToken(response.accessToken)
        self.currentUser = response.user
        self.isAuthenticated = true
    }

    // MARK: - Logout

    func logout() {
        KeychainHelper.deleteToken()
        self.currentUser = nil
        self.isAuthenticated = false
    }
}
