import Foundation
import UIKit

@Observable
final class ImageDetailViewModel {
    var image: GeneratedImage?
    var isLoading = false
    var error: String?
    var showDeleteConfirmation = false
    var isDeleted = false

    func fetchImage(id: String) async {
        isLoading = true
        error = nil

        do {
            image = try await ImageService.fetchById(id)
        } catch {
            self.error = error.localizedDescription
        }

        isLoading = false
    }

    func deleteImage() async {
        guard let id = image?.id else { return }

        do {
            try await ImageService.delete(id)
            isDeleted = true
        } catch {
            self.error = "Failed to delete: \(error.localizedDescription)"
        }
    }

    func saveToPhotos() async {
        guard let image = image else { return }

        let imageURL = imageURL(for: image)
        guard let url = URL(string: imageURL) else { return }

        do {
            let (data, _) = try await URLSession.shared.data(from: url)
            if let uiImage = UIImage(data: data) {
                UIImageWriteToSavedPhotosAlbum(uiImage, nil, nil, nil)
            }
        } catch {
            self.error = "Failed to save: \(error.localizedDescription)"
        }
    }

    func imageURL(for image: GeneratedImage) -> String {
        if let url = image.url, !url.isEmpty {
            return url
        }
        return image.asset.path
    }
}
