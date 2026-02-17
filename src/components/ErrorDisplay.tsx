import React from "react";
import {Button, Alert} from "@heroui/react";

interface Props {
    error: string;
    onRetry: () => void;
}

export const ErrorDisplay = React.memo<Props>(({error, onRetry}) => {
    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center">
                <div className="text-6xl mb-4">⚠️</div>
                <h1 className="text-2xl font-bold mb-4 text-foreground">應用程式發生錯誤</h1>
                <p className="text-muted mb-6">抱歉，應用程式遇到了意外錯誤。請嘗試重新載入頁面。</p>
                {error && (
                    <Alert status="danger" className="mb-6 text-left">
                        <Alert.Indicator />
                        <Alert.Content>
                            <Alert.Title>錯誤詳情</Alert.Title>
                            <Alert.Description className="font-mono text-sm break-all">{error}</Alert.Description>
                        </Alert.Content>
                    </Alert>
                )}
                <Button variant="primary" size="lg" onPress={onRetry}>
                    重新載入應用程式
                </Button>
            </div>
        </div>
    );
});
