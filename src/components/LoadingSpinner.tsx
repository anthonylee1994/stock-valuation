export const LoadingSpinner = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="w-16 h-16 border-5 border-slate-700 border-t-white rounded-full animate-spin"></div>
        </div>
    );
};
