import { createContext, useState, PropsWithChildren, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { parseJwt } from "../helpers/parseJwt";
import { api } from "../api/api";

export interface AuthContextProps {
  role: string;
  username: string;
}

const AuthContext = createContext<{
  user: AuthContextProps | null;
  logout: () => void;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    password: string,
    role?: string
  ) => Promise<void>;
}>(null!);

const getInitialState = () => {
  // Load authentication state from localStorage when the app starts
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  if (!token || !username) {
    return null;
  }

  const role = parseJwt(token || "").role;

  return {
    role,
    username,
  };
};

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: PropsWithChildren) {
  const navigate = useNavigate();
  const [auth, setAuth] = useState<AuthContextProps | null>(getInitialState);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setAuth(null);
    navigate("/");
  };

  const login = async (username: string, password: string) => {
    try {
      const { data } = await api.post(
        "/login",
        {
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("username", username);

      const role = parseJwt(data.access_token).role;

      // Update auth state
      setAuth({
        role: role,
        username: username,
      });

      if (data.user_role === "admin") {
        navigate("/events");
      } else {
        navigate("/");
      }
    } catch (error: any) {
      console.log(error?.response?.data);

      if (error?.response && error?.response?.data?.detail) {
        alert(`Вхід не вдався: ${error.response.data.detail}`);
      } else {
        console.error("Login failed:", error);
        alert("Невірні облікові дані");
      }
    }
  };

  const register = async (
    username: string,
    password: string,
    role?: string
  ) => {
    try {
      await api.post("/register", {
        username,
        password,
        role,
      });

      alert("Реєстрація успішна! Будь ласка, увійдіть.");
      navigate("/login");
    } catch (error: any) {
      if (error?.response && error?.response?.data?.detail) {
        alert(`Вхід не вдався: ${error.response.data.detail}`);
      } else {
        console.error("Login failed:", error);
        alert("Невірні облікові дані");
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user: auth, logout, login, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
