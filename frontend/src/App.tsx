import Header from "./components/layout/Header";
import { ThemeProvider } from "./components/layout/theme-provider";
import Home from "./pages/Home";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="container mx-auto p-2 space-y-6">
        <Header />

        <Home />
      </div>
    </ThemeProvider>
  );
}

export default App;
