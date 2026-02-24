import Foundation

@Observable
final class GalleryViewModel {
    var images: [GeneratedImage] = []
    var isLoading = false
    var error: String?

    func fetchImages() async {
        isLoading = true
        error = nil

        do {
            images = try await ImageService.fetchAll()
            // Sort by timestamp descending (newest first)
            images.sort { $0.timestamp > $1.timestamp }
        } catch {
            self.error = error.localizedDescription
        }

        isLoading = false
    }

    func deleteImage(_ id: String) async {
        // Optimistic removal
        let removedIndex = images.firstIndex { $0.id == id }
        let removedImage = removedIndex.map { images[$0] }

        if let index = removedIndex {
            images.remove(at: index)
        }

        do {
            try await ImageService.delete(id)
        } catch {
            // Restore on failure
            if let image = removedImage, let index = removedIndex {
                images.insert(image, at: min(index, images.count))
            }
            self.error = "Failed to delete: \(error.localizedDescription)"
        }
    }
}
