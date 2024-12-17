import React, { useEffect } from "react";
import Header from "../Header";
import { Link } from "react-router-dom";
import { fetch } from "../utils/Fetch";
import { API_BASE } from "../constants";
import { enqueueSnackbar } from "notistack";

const Hero = ({ headerItems }) => {
    useEffect(() => {
        (async () => {
            const res = await fetch.get(`${API_BASE}/health`);
            const status = res.data.status;
            console.log(status);
            return () => {};
        })();
    }, []);

    return (
        <>
            <Header headerItems={headerItems} />
            <div className="min-h-screen hero bg-base-200">
                <div className="text-center hero-content">
                    <div className="max-w-md">
                        <h1 className="text-7xl font-bold pokemon">Poketeam</h1>
                        <p className="py-6">
                            Catch 'em all, and build your team. Share your team with friends, and see how they stack up.
                        </p>
                        <Link to="/signup" className="btn btn-primary">
                            Get Started
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Hero;
