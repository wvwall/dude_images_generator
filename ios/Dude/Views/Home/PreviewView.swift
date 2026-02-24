import SwiftUI
import AVKit

struct PreviewView: View {
    let viewModel: GenerationViewModel

    var body: some View {
        VStack(spacing: 12) {
            Text("RESULT")
                .font(.caption.weight(.bold))
                .foregroundColor(.secondary)
                .frame(maxWidth: .infinity, alignment: .leading)

            // Image Preview
            if let preview = viewModel.currentImagePreview {
                Image(uiImage: preview)
                    .resizable()
                    .scaledToFit()
                    .clipShape(RoundedRectangle(cornerRadius: 16))
                    .shadow(color: .friendsPurple.opacity(0.2), radius: 8, y: 4)
                    .transition(.scale.combined(with: .opacity))
            }

            // Video Preview
            if let videoURL = viewModel.completedVideoURL {
                VideoPlayer(player: AVPlayer(url: videoURL))
                    .frame(height: 220)
                    .clipShape(RoundedRectangle(cornerRadius: 16))
                    .shadow(color: .friendsPurple.opacity(0.2), radius: 8, y: 4)
            }

            // Action Buttons
            HStack(spacing: 12) {
                if viewModel.currentImagePreview != nil {
                    Button {
                        Task { await viewModel.downloadCurrentImage() }
                    } label: {
                        Label("Save", systemImage: "square.and.arrow.down")
                    }
                    .buttonStyle(FriendsSecondaryButtonStyle())
                }

                if viewModel.completedVideoURL != nil {
                    ShareLink(item: viewModel.completedVideoURL!) {
                        Label("Share", systemImage: "square.and.arrow.up")
                    }
                    .buttonStyle(FriendsSecondaryButtonStyle())
                }

                Button {
                    withAnimation {
                        viewModel.clearResult()
                    }
                } label: {
                    Label("Clear", systemImage: "xmark")
                }
                .buttonStyle(FriendsSecondaryButtonStyle())
            }
        }
        .padding()
        .background(.white.opacity(0.7))
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }
}
