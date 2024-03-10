import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NewRoom } from "./pages/NewRoom";
import { Home } from "./pages/Home";
import { AuthContextProvider } from "./contexts/AuthContext";
import { Room } from "./pages/Room";
import { AdminRoom } from "./pages/AdminRoom";

export default function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms/new" element={<NewRoom />} />
          <Route path="/rooms/:id" element={<Room />} />
          <Route path="/admin/rooms/:id" element={<AdminRoom/>} />
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  );
}