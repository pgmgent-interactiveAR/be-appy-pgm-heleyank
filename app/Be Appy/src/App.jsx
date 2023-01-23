import { Route, Routes, useLocation } from "react-router-dom";
import BaseLayout from "./layouts/BaseLayout";
import "./App.scss";
import HomePage from "./pages/HomePage";
import VirtualPetPage from "./pages/VirtualPetPage";
import DancingLectorPage from "./pages/DancingLectorPage";
import { createContext, useState } from "react";
import NotFoundPage from "./pages/NotFoundPage";

export const ErrorContext = createContext();
function App() {
  const location = useLocation();
  const [error, setError] = useState(false);
  return (
    <ErrorContext.Provider value={[error, setError]}>
      <Routes location={location} key={location.key}>
        <Route path="/">
          <Route element={<BaseLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/virtual-pet" element={<VirtualPetPage />} />
            <Route path="/dancing-lector" element={<DancingLectorPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
      </Routes>
    </ErrorContext.Provider>
  );
}

export default App;
