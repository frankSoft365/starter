import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export default function RedirectToLogin() {
    const navigate = useNavigate();
    useEffect(() => {
        navigate({
            to: '/login',
        });
    }, []);
    return null;
}