import React, { useState, useEffect, ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { HeaderIitem } from "../../types";

interface HeaderProps {
    headerItems: HeaderIitem[];
    miscItems?: ReactNode[];
    homeLinkActive?: boolean;
    homeLink?: string;
}

const Header = ({ headerItems = [], miscItems = [], homeLinkActive = true, homeLink = "/" }: HeaderProps) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const renderHeaderItems = () => {
        if (headerItems.length === 0 && miscItems.length === 0) {
            return <></>;
        }
        const first = headerItems.map(({ label, href }, key) => (
            <li key={key}>
                <NavLink to={href} onClick={() => setIsMenuOpen(false)}>
                    {label}
                </NavLink>
            </li>
        ));
        const res = [...first, ...miscItems];
        return res;
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="relative navbar bg-base-100">
            <div className="flex-1 self-center">
                {homeLinkActive ? (
                    <Link to={homeLink} className="text-xl btn btn-ghost pokemon">
                        Poketeam
                    </Link>
                ) : (
                    <h1 className="text-xl pokemon">Poketeam</h1>
                )}
            </div>
            {isMobile ? (
                <div className="flex-none">
                    <button className="btn btn-square btn-ghost" onClick={toggleMenu}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="inline-block w-5 h-5 stroke-current"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                    {isMenuOpen && (
                        <ul className="absolute right-0 top-full z-10 w-56 shadow-lg menu menu-vertical bg-base-100">
                            {renderHeaderItems()}
                        </ul>
                    )}
                </div>
            ) : (
                <div className="flex-none">
                    <ul className="items-center px-1 menu menu-horizontal">{renderHeaderItems()}</ul>
                </div>
            )}
        </div>
    );
};

export default Header;
