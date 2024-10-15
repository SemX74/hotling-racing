import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import { AuthProvider } from "./providers/auth-context";
import Layout from "./components/layouts/layout";
import Register from "./pages/register";
import AuthLayout from "./components/layouts/auth-layout";
import Events from "./pages/events";
import Home from "./pages/home";
import Profile from "./pages/profile";
import Leaderboard from "./pages/leaderboard";
import Event from "./pages/event";
import AboutUs from "./pages/about-us";
import Contact from "./pages/contact";

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col h-fit bg-slate-800">
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<AboutUs />} />
          </Route>

          <Route element={<AuthLayout />}>
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<Event />} />

            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
