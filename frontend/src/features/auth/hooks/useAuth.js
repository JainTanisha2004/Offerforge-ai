import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout } from "../services/auth.api";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setuser, loading, setloading } = context;

  const handleLogin = async ({ email, password }) => {
    setloading(true);
    try {
      const data = await login({ email, password });
      if (!data?.user) throw new Error("Login failed");
      setuser(data.user);
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, message: err.message || "Login failed" };
    } finally {
      setloading(false);
    }
  };

  const handleRegister = async ({ username, email, password }) => {
    setloading(true);
    try {
      const data = await register({ username, email, password });
      if (!data?.user) throw new Error("Registration failed");
      setuser(data.user);
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, message: err.message || "Registration failed" };
    } finally {
      setloading(false);
    }
  };

  const handleLogout = async () => {
    setloading(true);
    try {
      await logout();
      setuser(null);
    } catch (err) {
      console.error(err);
    } finally {
      setloading(false);
    }
  };

  return { user, loading, handleLogin, handleLogout, handleRegister };
};
