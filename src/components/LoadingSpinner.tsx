import {Spinner} from "@heroui/react";
import React from "react";

export const LoadingSpinner = React.memo(() => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-background">
            <Spinner size="xl" color="current" className="w-20 h-20" />
        </div>
    );
});
