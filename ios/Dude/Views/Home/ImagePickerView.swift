import SwiftUI
import PhotosUI

struct ImagePickerView: View {
    @Binding var selectedPhotos: [PhotosPickerItem]
    let previews: [UIImage]
    let maxImages: Int
    let onClear: () -> Void

    private var isMaxReached: Bool {
        previews.count >= maxImages
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text("REFERENCE IMAGES")
                    .font(.caption.weight(.bold))
                    .foregroundColor(.secondary)

                Spacer()

                if !previews.isEmpty {
                    // Thumbnails
                    HStack(spacing: 4) {
                        ForEach(Array(previews.enumerated()), id: \.offset) { index, image in
                            Image(uiImage: image)
                                .resizable()
                                .scaledToFill()
                                .frame(width: 28, height: 28)
                                .clipShape(RoundedRectangle(cornerRadius: 6))
                        }
                    }

                    if previews.count > 1 {
                        Button {
                            onClear()
                        } label: {
                            Image(systemName: "xmark.circle.fill")
                                .foregroundColor(.friendsRed)
                                .font(.caption)
                        }
                    }
                }
            }

            PhotosPicker(
                selection: $selectedPhotos,
                maxSelectionCount: maxImages,
                matching: .images
            ) {
                VStack(spacing: 8) {
                    if isMaxReached {
                        Image(systemName: "exclamationmark.triangle")
                            .foregroundColor(.friendsRed)
                        Text("Images limit reached (\(maxImages))")
                            .font(.caption.weight(.semibold))
                            .foregroundColor(.friendsPurple)
                    } else {
                        Image(systemName: "arrow.up.circle")
                            .font(.title3)
                            .foregroundColor(.friendsPurple)
                        Text("Upload photos to pivot")
                            .font(.caption.weight(.bold))
                            .foregroundColor(.friendsPurple)
                        Text("JPG or PNG, max 4MB per image")
                            .font(.caption2)
                            .foregroundColor(.secondary)
                    }
                }
                .frame(maxWidth: .infinity)
                .frame(height: 100)
                .background(
                    RoundedRectangle(cornerRadius: 12)
                        .strokeBorder(
                            Color.friendsPurple.opacity(0.3),
                            style: StrokeStyle(lineWidth: 2, dash: [8])
                        )
                )
                .background(Color.friendsPurpleLight.opacity(0.2))
                .clipShape(RoundedRectangle(cornerRadius: 12))
            }
            .disabled(isMaxReached)
            .opacity(isMaxReached ? 0.7 : 1)
        }
    }
}
