import SwiftUI

struct ImageCardView: View {
    let image: GeneratedImage

    private var imageURL: URL? {
        let path = image.url ?? image.asset.path
        return URL(string: path)
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Image
            AsyncImage(url: imageURL) { phase in
                switch phase {
                case .empty:
                    Rectangle()
                        .fill(Color.friendsPurpleLight)
                        .aspectRatio(1, contentMode: .fit)
                        .overlay {
                            ProgressView()
                                .tint(.friendsPurple)
                        }
                case .success(let loadedImage):
                    loadedImage
                        .resizable()
                        .scaledToFill()
                        .frame(minHeight: 120)
                        .clipped()
                case .failure:
                    Rectangle()
                        .fill(Color.friendsPurpleLight)
                        .aspectRatio(1, contentMode: .fit)
                        .overlay {
                            Image(systemName: "photo")
                                .foregroundColor(.friendsPurple.opacity(0.4))
                        }
                @unknown default:
                    EmptyView()
                }
            }

            // Prompt text
            Text(image.prompt)
                .font(.caption2)
                .foregroundColor(.primary)
                .lineLimit(2)
                .padding(8)
        }
        .background(.white)
        .clipShape(RoundedRectangle(cornerRadius: 12))
        .shadow(color: .black.opacity(0.08), radius: 4, y: 2)
    }
}
