interface Props {
    lastUpdate: Date | null;
    pulse: boolean;
}

export const Header = ({lastUpdate, pulse}: Props) => {
    return (
        <header className="flex flex-wrap items-center justify-between gap-3 max-w-[1400px] mx-auto mb-6 max-[640px]:justify-center max-[640px]:flex-col">
            <h1 className="m-0 text-[1.75rem] font-bold text-slate-50 tracking-wide max-[640px]:text-[1.35rem]">估值參考</h1>
            <div className="flex items-center gap-2">
                {lastUpdate && <span className="text-[0.8rem] text-slate-400">更新時間（香港）: {formatHKTime(lastUpdate)}</span>}
                {lastUpdate && <div className={`w-2 h-2 rounded-full ${pulse ? "bg-green-500 pulse-glow" : "bg-slate-400"}`} />}
            </div>
        </header>
    );
};

const formatHKTime = (date: Date): string => {
    return date.toLocaleString("zh-HK", {
        timeZone: "Asia/Hong_Kong",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
};
