import React from "react";
import {Button} from "@heroui/react";
import type {FallbackProps} from "react-error-boundary";

export const ErrorDisplay = React.memo<FallbackProps>(({error, resetErrorBoundary}) => {
    return (
        <div className="flex min-h-screen items-center justify-center p-6">
            <div className="w-full max-w-md text-center">
                <div className="mb-4 text-6xl">⚠️</div>
                <h1 className="text-foreground mb-4 text-2xl font-bold">應用程式發生錯誤</h1>
                <p className="text-muted mb-6">抱歉，應用程式遇到了意外錯誤。請嘗試重新載入頁面。</p>
                {error instanceof Error && (
                    <div className="mb-6 rounded-lg border border-red-500/30 bg-red-950/30 p-4 text-left">
                        <p className="font-mono text-sm text-red-300">{error.message}</p>
                    </div>
                )}
                <Button variant="primary" size="lg" onPress={resetErrorBoundary}>
                    重新載入應用程式
                </Button>
            </div>
        </div>
    );
});
