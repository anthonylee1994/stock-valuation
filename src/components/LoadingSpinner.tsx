import React from "react";
import {Spinner} from "@heroui/react";

export const LoadingSpinner = React.memo(() => {
    return (
        <div className="bg-background fixed inset-0 flex items-center justify-center">
            <Spinner size="xl" color="current" className="h-20 w-20" />
        </div>
    );
});
