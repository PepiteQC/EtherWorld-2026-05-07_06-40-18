import { AuthProvider } from "./contexts/AuthContext";
import AppRouter from "./AppRouter";
import "./index.css";

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
