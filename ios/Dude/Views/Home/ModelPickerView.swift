import SwiftUI

struct ModelPickerView: View {
    @Binding var selectedModel: GeminiModel

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text("AI MODEL")
                .font(.caption.weight(.bold))
                .foregroundColor(.secondary)

            HStack(spacing: 8) {
                ForEach(GeminiModel.allCases) { model in
                    Button {
                        withAnimation(.easeInOut(duration: 0.15)) {
                            selectedModel = model
                        }
                    } label: {
                        HStack(spacing: 6) {
                            Image(systemName: model == .flash ? "bolt.fill" : "sparkles")
                                .font(.caption)
                            Text(model.displayName)
                                .font(.subheadline.weight(.medium))
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 10)
                        .background(
                            selectedModel == model
                                ? Color.friendsPurple
                                : Color.white
                        )
                        .foregroundColor(
                            selectedModel == model ? .white : .friendsPurple
                        )
                        .clipShape(RoundedRectangle(cornerRadius: 8))
                        .overlay(
                            RoundedRectangle(cornerRadius: 8)
                                .stroke(
                                    selectedModel == model
                                        ? Color.friendsPurple
                                        : Color.friendsPurple.opacity(0.2),
                                    lineWidth: 1
                                )
                        )
                    }
                }
            }
        }
    }
}
