import {Button} from "@heroui/react";

interface Props {
    error: string;
    onRetry: () => void;
}

export const ErrorDisplay = ({error, onRetry}: Props) => {
    return (
        <div className="min-h-screen flex items-center justify-center p-6 text-slate-200">
            <div className="max-w-md w-full text-center">
                <div className="text-6xl mb-4">⚠️</div>
                <h1 className="text-2xl font-bold mb-4">應用程式發生錯誤</h1>
                <p className="text-slate-400 mb-6">抱歉，應用程式遇到了意外錯誤。請嘗試重新載入頁面。</p>
                {error && (
                    <div className="bg-red-950/30 border border-red-500/30 rounded-lg p-4 mb-6 text-left">
                        <p className="text-sm text-red-300 font-mono">{error}</p>
                    </div>
                )}
                <Button variant="primary" size="lg" onPress={onRetry}>
                    重新載入應用程式
                </Button>
            </div>
        </div>
    );
};
