import React, { useMemo } from "react";

const withLoading =
    (Component) =>
    ({ loading, ...rest }) => {
        const MemoizedComponent = useMemo(() => <Component {...rest} />, [rest]);

        if (loading) {
            return (
                <div className="flex justify-center items-center w-full h-screen">
                    <span className="loading loading-dots loading-lg"></span>
                </div>
            );
        }

        return MemoizedComponent;
    };

export default withLoading;
