import SwiftUI

struct ModeSelectorView: View {
    @Binding var selectedMode: GenerationMode

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text("MODE")
                .font(.caption.weight(.bold))
                .foregroundColor(.secondary)

            HStack(spacing: 0) {
                ForEach(GenerationMode.allCases) { mode in
                    Button {
                        withAnimation(.easeInOut(duration: 0.2)) {
                            selectedMode = mode
                        }
                    } label: {
                        HStack(spacing: 6) {
                            Image(systemName: mode.icon)
                                .font(.caption)
                            Text(mode.displayName)
                                .font(.subheadline.weight(.semibold))
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 10)
                        .background(
                            selectedMode == mode
                                ? Color.friendsPurple
                                : Color.clear
                        )
                        .foregroundColor(
                            selectedMode == mode ? .white : .friendsPurple
                        )
                    }
                }
            }
            .background(Color.friendsPurpleLight)
            .clipShape(RoundedRectangle(cornerRadius: 10))
        }
    }
}
