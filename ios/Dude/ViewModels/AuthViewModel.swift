import Foundation

@Observable
final class AuthViewModel {
    var username = ""
    var password = ""
    var isLoginMode = true
    var isSubmitting = false
    var errorMessage: String?

    private let authService: AuthService

    init(authService: AuthService = .shared) {
        self.authService = authService
    }

    var isFormValid: Bool {
        !username.trimmingCharacters(in: .whitespaces).isEmpty &&
        password.count >= 3
    }

    func submit() async {
        guard isFormValid else { return }

        isSubmitting = true
        errorMessage = nil

        do {
            if isLoginMode {
                try await authService.login(
                    username: username.trimmingCharacters(in: .whitespaces),
                    password: password
                )
            } else {
                try await authService.register(
                    username: username.trimmingCharacters(in: .whitespaces),
                    password: password
                )
            }
        } catch {
            errorMessage = error.localizedDescription
        }

        isSubmitting = false
    }

    func toggleMode() {
        isLoginMode.toggle()
        errorMessage = nil
    }
}
