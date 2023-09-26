import { extendTheme } from "native-base";

export const customTheme = extendTheme({
  // Add custom theme here:
  // e.g: fonts, colors, button format, etc.
  components: {
    Text: {
      baseStyle: {
        color: "#3F434A",
        fontWeight: 500,
        fontSize: 14,
      },
    },
    Button: {
      baseStyle: {
        borderRadius: 15,
      },
    },
    Input: {
      baseStyle: {
        height: 41,
        borderWidth: 1,
        borderRadius: 15,
        variant: "unstyled",
      },
    },
    Skeleton: {
      baseStyle: {
        borderRadius: 15,
      },
    },
    Modal: { defaultProps: { _overlay: { useRNModalOnAndroid: false }, _backdrop: { _pressed: { opacity: 0.3 } } } },
  },
  colors: {
    primary: {
      600: "#176688",
    },
    secondary: {
      600: "#0B3F54",
    },
  },
});
