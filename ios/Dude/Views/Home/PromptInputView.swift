import SwiftUI

struct PromptInputView: View {
    @Binding var prompt: String
    @FocusState private var isFocused: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text("PROMPT")
                .font(.caption.weight(.bold))
                .foregroundColor(.secondary)

            ZStack(alignment: .topLeading) {
                if prompt.isEmpty {
                    Text("Describe what you want to create...")
                        .foregroundColor(.gray.opacity(0.6))
                        .padding(.horizontal, 12)
                        .padding(.vertical, 12)
                }

                TextEditor(text: $prompt)
                    .focused($isFocused)
                    .frame(minHeight: 80, maxHeight: 150)
                    .scrollContentBackground(.hidden)
                    .padding(8)
            }
            .background(.white)
            .clipShape(RoundedRectangle(cornerRadius: 12))
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(
                        isFocused ? Color.friendsPurple : Color.friendsPurple.opacity(0.2),
                        lineWidth: isFocused ? 2 : 1
                    )
            )
            .animation(.easeInOut(duration: 0.2), value: isFocused)
        }
    }
}
