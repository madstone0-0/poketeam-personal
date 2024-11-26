import React from "react";
import Hero from "../Hero";
import Header from "../Header";
import Login from "../Login";
import Signup from "../Signup";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import PoketeamProvider from "../PoketeamProvider";

const Main = () => {
    console.log(import.meta.env.BASE_URL);
    return (
        <Router basename={import.meta.env.BASE_URL}>
            <PoketeamProvider>
                <SnackbarProvider maxSnack={4}>
                    <Header
                        headerItems={[
                            { label: "Login", href: `/login` },
                            { label: "Sign Up", href: "/signup" },
                        ]}
                    />
                    <Routes>
                        <Route exact path="/" element={<Hero />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                    </Routes>
                </SnackbarProvider>
            </PoketeamProvider>
        </Router>
    );
};

<Hero />;
export default Main;
