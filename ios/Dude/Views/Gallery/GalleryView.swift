import SwiftUI

struct GalleryView: View {
    @State private var viewModel = GalleryViewModel()

    private let columns = [
        GridItem(.flexible(), spacing: 8),
        GridItem(.flexible(), spacing: 8),
    ]

    var body: some View {
        ScrollView {
            if viewModel.isLoading && viewModel.images.isEmpty {
                VStack(spacing: 16) {
                    ProgressView()
                        .tint(.friendsPurple)
                        .scaleEffect(1.2)
                    Text("Loading your creations...")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }
                .frame(maxWidth: .infinity)
                .padding(.top, 100)
            } else if viewModel.images.isEmpty {
                VStack(spacing: 16) {
                    Image(systemName: "photo.on.rectangle.angled")
                        .font(.system(size: 48))
                        .foregroundColor(.friendsPurple.opacity(0.4))
                    Text("No images yet")
                        .font(.headline)
                        .foregroundColor(.friendsPurple)
                    Text("Go create something amazing!")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }
                .frame(maxWidth: .infinity)
                .padding(.top, 100)
            } else {
                LazyVGrid(columns: columns, spacing: 8) {
                    ForEach(viewModel.images) { image in
                        NavigationLink(value: image) {
                            ImageCardView(image: image)
                        }
                    }
                }
                .padding(.horizontal)
                .padding(.top, 8)
            }

            // Error
            if let error = viewModel.error {
                Text(error)
                    .font(.caption)
                    .foregroundColor(.friendsRed)
                    .padding()
            }
        }
        .background(Color.friendsPurpleLight.opacity(0.3))
        .navigationTitle("Gallery")
        .navigationBarTitleDisplayMode(.large)
        .navigationDestination(for: GeneratedImage.self) { image in
            ImageDetailView(imageId: image.id)
        }
        .refreshable {
            await viewModel.fetchImages()
        }
        .task {
            await viewModel.fetchImages()
        }
    }
}
