import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { useLocalStorage } from "./useLocalStorage";

import { login, logout } from '../services/security';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useLocalStorage("user", null);
    const navigate = useNavigate();

    // Call this function when you want to authenticate the user
    const loginUser = async (values) => {
        const loginResponse = await login(values);
        const loginData = await loginResponse.json();

        if (loginResponse.ok) {
            toast.success('Se ha iniciado sesión correctamente');
            setUser({ token: loginData.data.token });
            navigate("/");
        }
        else {
            toast.error('Error al iniciar sesión');
        }
    };

    const updateUser = async () => {
        console.log('updateUser');
    };

    // Call this function to sign out logged in user
    const logoutUser = async () => {
        setUser(null);
        toast.success('Se ha cerrado sesión correctamente');

        const logoutResponse = await logout(user.token);
        const logoutData = await logoutResponse.json();

        navigate("/login", { replace: true });
    };

    const value = useMemo(
        () => ({
            user,
            loginUser,
            updateUser,
            logoutUser,
        }),
        [user]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};
