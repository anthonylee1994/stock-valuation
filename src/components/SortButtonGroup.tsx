interface Props {
    sortOrder: "asc" | "desc";
    onSortOrderChange: (order: "asc" | "desc") => void;
}

export const SortButtonGroup = ({sortOrder, onSortOrderChange}: Props) => {
    return (
        <div className="max-w-[1400px] mx-auto mb-6">
            <div className="inline-flex rounded-md border border-slate-700 overflow-hidden">
                <button
                    className={`px-4 py-2 text-sm font-medium transition-all ${sortOrder === "asc" ? "bg-[#2ead5a] text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}
                    onClick={() => onSortOrderChange("asc")}
                >
                    由殘到貴 ↑
                </button>
                <button
                    className={`px-4 py-2 text-sm font-medium transition-all border-l border-slate-700 ${
                        sortOrder === "desc" ? "bg-[#cb4745] text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                    onClick={() => onSortOrderChange("desc")}
                >
                    由貴到殘 ↓
                </button>
            </div>
        </div>
    );
};
