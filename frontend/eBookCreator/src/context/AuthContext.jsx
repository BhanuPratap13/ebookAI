import { createContext, useState, useEffect, useCallback, useContext } from "react";
import axiosInstance from "../utils/axiosinstance";
import { API_PATHS } from "../utils/apiPath";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // starting with isLoading as true since we need to check auth on mount!!
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
      email,
      password,
    });
    const { token, _id, name } = response.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify({ _id, name, email }));
    setIsAuthenticated(true);
    setUser({ _id, name, email });
  };

  const logout = useCallback((callback) => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);

    // consumers can pass this callback to handle navigation
    callback?.();
  }, []);

  const register = async (name, email, password) => {
    const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
      name,
      email,
      password,
    });
    const { token, _id } = response.data;
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ _id, name, email }));
      setIsAuthenticated(true);
      setUser({ _id, name, email });
    }
    return response.data;
  };

  const checkAuthStatus = useCallback(() => {
    setIsLoading(true);

    try {
      const jwt = localStorage.getItem("token");
      const stringifiedUser = localStorage.getItem("user");

      if (jwt && stringifiedUser) {
        const userInfo = JSON.parse(stringifiedUser);
        setIsAuthenticated(true);
        setUser(userInfo);
      } else {
        // no auth data found
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  const updateUser = (updatedUserInfo) => {
    const newUserInfo = { ...user, ...updatedUserInfo };
    localStorage.setItem("user", JSON.stringify(newUserInfo));
    setUser(newUserInfo);
  };

  // check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        checkAuthStatus,
        login,
        logout,
        register,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuthContext must be used within an AuthContextProvider"
    );
  }

  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useAuthContext();
}
