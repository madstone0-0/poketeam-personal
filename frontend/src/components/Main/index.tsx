import React from "react";
import Hero from "../Hero";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import Login from "../Login";
import Signup from "../Signup";
import Home from "../Home";
import AdminDash from "../AdminDash";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";

const Main = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false, // default: true
            },
        },
    });
    const headerItems = [
        { label: "Login", href: "/login" },
        { label: "Sign Up", href: "/signup" },
    ];

    return (
        <Router basename={import.meta.env.BASE_URL}>
            <QueryClientProvider client={queryClient}>
                <SnackbarProvider maxSnack={4}>
                    <Routes>
                        <Route exact path="/" element={<Hero headerItems={headerItems} />} />
                        <Route path="/login" element={<Login headerItems={headerItems} />} />
                        <Route path="/signup" element={<Signup headerItems={headerItems} />} />
                        <Route path="/home/*" element={<Home />} />
                        <Route exact path="/admin/*" element={<AdminDash />} />
                    </Routes>
                </SnackbarProvider>
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </Router>
    );
};

export default Main;
