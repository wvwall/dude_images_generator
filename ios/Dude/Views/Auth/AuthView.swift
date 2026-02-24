import SwiftUI

struct AuthView: View {
    @State private var viewModel = AuthViewModel()

    var body: some View {
        ZStack {
            Color.friendsPurpleLight
                .ignoresSafeArea()

            ScrollView {
                VStack(spacing: 32) {
                    // Header
                    VStack(spacing: 8) {
                        Text("DUDE")
                            .font(.system(size: 56, weight: .black, design: .rounded))
                            .foregroundColor(.friendsPurple)

                        Text("The Friends Edition")
                            .font(.subheadline.weight(.medium))
                            .foregroundColor(.friendsPurple.opacity(0.7))
                    }
                    .padding(.top, 60)

                    // Form Card
                    VStack(spacing: 20) {
                        Text(viewModel.isLoginMode ? "Welcome Back!" : "Join the Gang!")
                            .font(.title2.weight(.bold))
                            .foregroundColor(.friendsPurple)

                        // Username
                        VStack(alignment: .leading, spacing: 6) {
                            Text("Username")
                                .font(.caption.weight(.bold))
                                .textCase(.uppercase)
                                .foregroundColor(.gray)

                            TextField("Enter username", text: $viewModel.username)
                                .textFieldStyle(.plain)
                                .padding(12)
                                .background(Color.friendsPurpleLight.opacity(0.5))
                                .clipShape(RoundedRectangle(cornerRadius: 10))
                                .textInputAutocapitalization(.never)
                                .autocorrectionDisabled()
                        }

                        // Password
                        VStack(alignment: .leading, spacing: 6) {
                            Text("Password")
                                .font(.caption.weight(.bold))
                                .textCase(.uppercase)
                                .foregroundColor(.gray)

                            SecureField("Enter password", text: $viewModel.password)
                                .textFieldStyle(.plain)
                                .padding(12)
                                .background(Color.friendsPurpleLight.opacity(0.5))
                                .clipShape(RoundedRectangle(cornerRadius: 10))
                        }

                        // Error
                        if let error = viewModel.errorMessage {
                            Text(error)
                                .font(.caption)
                                .foregroundColor(.friendsRed)
                                .multilineTextAlignment(.center)
                        }

                        // Submit Button
                        Button {
                            Task { await viewModel.submit() }
                        } label: {
                            HStack(spacing: 8) {
                                if viewModel.isSubmitting {
                                    ProgressView()
                                        .tint(.black)
                                }
                                Text(viewModel.isLoginMode ? "Login" : "Register")
                            }
                        }
                        .buttonStyle(FriendsPrimaryButtonStyle())
                        .disabled(!viewModel.isFormValid || viewModel.isSubmitting)

                        // Toggle Mode
                        Button {
                            withAnimation(.easeInOut(duration: 0.2)) {
                                viewModel.toggleMode()
                            }
                        } label: {
                            Text(viewModel.isLoginMode
                                 ? "Don't have an account? Register"
                                 : "Already have an account? Login")
                                .font(.subheadline)
                                .foregroundColor(.friendsPurple)
                        }
                    }
                    .padding(24)
                    .background(.white)
                    .clipShape(RoundedRectangle(cornerRadius: 20))
                    .shadow(color: .friendsPurple.opacity(0.1), radius: 10, y: 5)
                    .padding(.horizontal, 24)

                    // Friends phrase
                    Text("\"How YOU doin'?\"")
                        .font(.subheadline.italic())
                        .foregroundColor(.friendsPurple.opacity(0.5))
                        .padding(.bottom, 40)
                }
            }
        }
    }
}
