import SwiftUI

struct AspectRatioPickerView: View {
    @Binding var selectedRatio: AspectRatio

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text("ASPECT RATIO")
                .font(.caption.weight(.bold))
                .foregroundColor(.secondary)

            HStack(spacing: 8) {
                ForEach(AspectRatio.allCases) { ratio in
                    Button {
                        withAnimation(.easeInOut(duration: 0.15)) {
                            selectedRatio = ratio
                        }
                    } label: {
                        VStack(spacing: 4) {
                            Image(systemName: ratio.icon)
                                .font(.caption)
                            Text(ratio.displayName)
                                .font(.caption2.weight(.semibold))
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 10)
                        .background(
                            selectedRatio == ratio
                                ? Color.friendsYellow
                                : Color.white
                        )
                        .foregroundColor(
                            selectedRatio == ratio
                                ? .black
                                : .friendsPurple
                        )
                        .clipShape(RoundedRectangle(cornerRadius: 8))
                        .overlay(
                            RoundedRectangle(cornerRadius: 8)
                                .stroke(
                                    selectedRatio == ratio
                                        ? Color.friendsYellow
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
