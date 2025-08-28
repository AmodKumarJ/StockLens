import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

export default function App({ Component, pageProps }: AppProps) {
  const theme = createTheme({
  palette: {
    mode: "light", // can be "dark"
    primary: {
      main: "#1976d2", // blue
    },
    secondary: {
      main: "#9c27b0", // purple
    },
  },
});
    return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* resets default browser styles */}
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
