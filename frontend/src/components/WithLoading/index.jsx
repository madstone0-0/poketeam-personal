import React from "react";

const withLoading =
    (Component) =>
    ({ loading, ...rest }) => {
        if (loading) {
            return (
                <div className="flex justify-center w-full h-full">
                    <span className="loading loading-dots loading-lg"></span>
                </div>
            );
        }
        return <Component {...rest} />;
    };

export default withLoading;
