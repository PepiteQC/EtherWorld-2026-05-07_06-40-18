import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

const HomePage = lazy(() => import("./pages/HomePage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const WorldPage = lazy(() => import("./pages/WorldPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));

function Fallback() {
  return (
    <div className="w-screen h-screen bg-[#08080E] flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-gray-700 border-t-cyan-400 rounded-full animate-spin" />
    </div>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter basename="/EtherWorld-Official-PC">
      <Suspense fallback={<Fallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/world" element={<WorldPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
