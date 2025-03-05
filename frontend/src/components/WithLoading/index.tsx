import React, { useMemo } from "react";

type WithLoadingProps = {
    loading: boolean;
};

const withLoading = <P extends object>(Component: React.ComponentType<P>): React.FC<P & WithLoadingProps> => {
    return (props: P & WithLoadingProps) => {
        const { loading, ...rest } = props;
        const memoizedComponent = useMemo(() => <Component {...(rest as P)} />, [rest]);

        if (loading) {
            return (
                <div className="flex justify-center items-center w-full h-screen">
                    <span className="loading loading-dots loading-lg"></span>
                </div>
            );
        }

        return memoizedComponent;
    };
};

export default withLoading;
