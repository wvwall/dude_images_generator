import SwiftUI

struct ImageDetailView: View {
    let imageId: String
    @State private var viewModel = ImageDetailViewModel()
    @Environment(\.dismiss) private var dismiss
    @State private var imageScale: CGFloat = 1.0

    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                if viewModel.isLoading {
                    ProgressView()
                        .tint(.friendsPurple)
                        .scaleEffect(1.2)
                        .padding(.top, 100)
                } else if let image = viewModel.image {
                    // Full Image with pinch-to-zoom
                    let url = URL(string: viewModel.imageURL(for: image))
                    AsyncImage(url: url) { phase in
                        switch phase {
                        case .empty:
                            Rectangle()
                                .fill(Color.friendsPurpleLight)
                                .aspectRatio(1, contentMode: .fit)
                                .overlay { ProgressView().tint(.friendsPurple) }
                        case .success(let loadedImage):
                            loadedImage
                                .resizable()
                                .scaledToFit()
                                .scaleEffect(imageScale)
                                .gesture(
                                    MagnifyGesture()
                                        .onChanged { value in
                                            imageScale = value.magnification
                                        }
                                        .onEnded { _ in
                                            withAnimation(.spring) {
                                                imageScale = 1.0
                                            }
                                        }
                                )
                        case .failure:
                            Rectangle()
                                .fill(Color.friendsPurpleLight)
                                .aspectRatio(1, contentMode: .fit)
                                .overlay {
                                    VStack {
                                        Image(systemName: "exclamationmark.triangle")
                                        Text("Failed to load")
                                            .font(.caption)
                                    }
                                    .foregroundColor(.friendsRed)
                                }
                        @unknown default:
                            EmptyView()
                        }
                    }
                    .clipShape(RoundedRectangle(cornerRadius: 16))
                    .shadow(color: .friendsPurple.opacity(0.15), radius: 10, y: 5)
                    .padding(.horizontal)

                    // Info Card
                    VStack(alignment: .leading, spacing: 12) {
                        // Prompt
                        VStack(alignment: .leading, spacing: 4) {
                            Text("PROMPT")
                                .font(.caption.weight(.bold))
                                .foregroundColor(.secondary)
                            Text(image.prompt)
                                .font(.body)
                                .foregroundColor(.primary)
                        }

                        Divider()

                        // Details
                        HStack(spacing: 20) {
                            DetailItem(
                                icon: "aspectratio",
                                label: "Ratio",
                                value: image.aspectRatio
                            )

                            DetailItem(
                                icon: "calendar",
                                label: "Created",
                                value: formattedDate(image.timestamp)
                            )
                        }
                    }
                    .padding()
                    .background(.white)
                    .clipShape(RoundedRectangle(cornerRadius: 16))
                    .padding(.horizontal)

                    // Action Buttons
                    VStack(spacing: 10) {
                        // Save to Photos
                        Button {
                            Task { await viewModel.saveToPhotos() }
                        } label: {
                            Label("Save to Photos", systemImage: "square.and.arrow.down")
                        }
                        .buttonStyle(FriendsPrimaryButtonStyle())

                        // Share
                        if let url = url {
                            ShareLink(item: url) {
                                Label("Share", systemImage: "square.and.arrow.up")
                                    .frame(maxWidth: .infinity)
                            }
                            .buttonStyle(FriendsSecondaryButtonStyle())
                        }

                        // Delete
                        Button(role: .destructive) {
                            viewModel.showDeleteConfirmation = true
                        } label: {
                            Label("Delete", systemImage: "trash")
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 12)
                        }
                        .foregroundColor(.friendsRed)
                    }
                    .padding(.horizontal)
                }

                // Error
                if let error = viewModel.error {
                    Text(error)
                        .font(.caption)
                        .foregroundColor(.friendsRed)
                        .padding()
                }
            }
            .padding(.vertical)
        }
        .background(Color.friendsPurpleLight.opacity(0.3))
        .navigationBarTitleDisplayMode(.inline)
        .confirmationDialog(
            "Delete this image?",
            isPresented: $viewModel.showDeleteConfirmation,
            titleVisibility: .visible
        ) {
            Button("Delete", role: .destructive) {
                Task {
                    await viewModel.deleteImage()
                }
            }
        } message: {
            Text("This action cannot be undone.")
        }
        .onChange(of: viewModel.isDeleted) { _, isDeleted in
            if isDeleted { dismiss() }
        }
        .task {
            await viewModel.fetchImage(id: imageId)
        }
    }

    private func formattedDate(_ timestamp: String) -> String {
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        guard let date = formatter.date(from: timestamp) else {
            // Try without fractional seconds
            formatter.formatOptions = [.withInternetDateTime]
            guard let date = formatter.date(from: timestamp) else { return timestamp }
            return formatDate(date)
        }
        return formatDate(date)
    }

    private func formatDate(_ date: Date) -> String {
        let display = DateFormatter()
        display.dateStyle = .medium
        display.timeStyle = .short
        return display.string(from: date)
    }
}

// MARK: - Detail Item

private struct DetailItem: View {
    let icon: String
    let label: String
    let value: String

    var body: some View {
        HStack(spacing: 6) {
            Image(systemName: icon)
                .font(.caption)
                .foregroundColor(.friendsPurple)
            VStack(alignment: .leading, spacing: 2) {
                Text(label)
                    .font(.caption2)
                    .foregroundColor(.secondary)
                Text(value)
                    .font(.caption.weight(.semibold))
                    .foregroundColor(.primary)
            }
        }
    }
}
