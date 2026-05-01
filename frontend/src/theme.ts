import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  fonts: {
    heading: "'Georgia', serif",
    body: "'Segoe UI', sans-serif",
  },
  styles: {
    global: {
      body: {
        bg: "#07090d",
        color: "#f6ead1",
        backgroundImage:
          "radial-gradient(circle at top, rgba(244, 190, 75, 0.16), transparent 32%), linear-gradient(180deg, #0a0d12 0%, #07090d 100%)",
      },
      "*::placeholder": {
        color: "#9b8f73",
      },
      "*": {
        borderColor: "rgba(245, 195, 86, 0.22)",
      },
    },
  },
});
