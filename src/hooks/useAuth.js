import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { useLocalStorage } from "./useLocalStorage";

import { login } from '../services/authentication';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useLocalStorage("user", null);
    const navigate = useNavigate();

    // Call this function when you want to authenticate the user
    const loginUser = async (values) => {
        const loginResponse = await login(values);
        const loginData = await loginResponse.json();

        console.log(loginData);
    };

    const updateUser = async () => {
        console.log('updateUser');
    };

    // Call this function to sign out logged in user
    const logout = () => {
        console.log('logout');
    };

    const value = useMemo(
        () => ({
            user,
            loginUser,
            updateUser,
            logout,
        }),
        [user]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};
