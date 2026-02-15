import {Spinner} from "@heroui/react";

export const LoadingSpinner = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-background">
            <Spinner size="xl" color="current" className="w-20 h-20" />
        </div>
    );
};
