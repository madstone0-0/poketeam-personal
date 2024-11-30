import React from "react";
import Hero from "../Hero";
import Header from "../Header";
import Login from "../Login";
import Signup from "../Signup";
import Home from "../Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import PoketeamProvider from "../PoketeamProvider";

const Main = () => {
    console.log(import.meta.env.BASE_URL);
    const headerItems = [
        { label: "Login", href: "/login" },
        { label: "Sign Up", href: "/signup" },
    ];
    return (
        <Router basename={import.meta.env.BASE_URL}>
            <PoketeamProvider>
                <SnackbarProvider maxSnack={4}>
                    <Routes>
                        <Route exact path="/" element={<Hero headerItems={headerItems} />} />
                        <Route path="/login" element={<Login headerItems={headerItems} />} />
                        <Route path="/signup" element={<Signup headerItems={headerItems} />} />
                        <Route path="/home/*" exact element={<Home />} />
                    </Routes>
                </SnackbarProvider>
            </PoketeamProvider>
        </Router>
    );
};

<Hero />;
export default Main;
