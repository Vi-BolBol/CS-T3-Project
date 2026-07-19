import AppRoute from "./routes/App.route";
import { ThemeProvider } from "./context/ThemeContext";
import ErrorBoundary from "./components/shared/ErrorBoundary";

export default function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <AppRoute />
      </ErrorBoundary>
    </ThemeProvider>
  );
}
