import React from "react";
import { mapStatToIcon } from "../utils/helpers";

const StatsDisplay = ({ stats, className = "bg-base-300" }) => {
    if (!stats) {
        return <></>;
    }

    return (
        <div className={`p-5 m-0 w-full h-full ${className}`}>
            {stats.map(({ name, value }, key) => (
                <div key={key} className="flex justify-between">
                    {mapStatToIcon(name)}
                    <div>{value}</div>
                </div>
            ))}
        </div>
    );
};

export default React.memo(StatsDisplay);
