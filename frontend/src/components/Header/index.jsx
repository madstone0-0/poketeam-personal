import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Header = ({ headerItems = [], miscItems = [], homeLinkActive = true, homeLink = "/" }) => {
    const renderHeaderItems = () => {
        if (headerItems.length === 0 && miscItems.length === 0) {
            return <></>;
        }

        const first = headerItems.map(({ label, href }, key) => (
            <li key={key}>
                <Link to={href}>{label}</Link>
            </li>
        ));

        const res = [...first, ...miscItems];
        return res;
    };

    return (
        <div className="navbar bg-base-100">
            <div className="flex-1 self-center">
                {homeLinkActive ? (
                    <Link to={homeLink} className="text-xl btn btn-ghost pokemon">
                        Poketeam
                    </Link>
                ) : (
                    <h1 className="text-xl pokemon">Poketeam</h1>
                )}
            </div>
            <div className="flex-none">
                <ul className="items-center px-1 menu menu-horizontal">{renderHeaderItems()}</ul>
            </div>
        </div>
    );
};

export default Header;
