import { useEffect } from "react";

export default function AccountSwitcher({ accounts, activeAccount, onSelect, onClose }) {
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function colorForIndex(i) {
    const colors = [
      "bg-violet-600", "bg-emerald-600", "bg-blue-600",
      "bg-amber-600", "bg-rose-600", "bg-cyan-600",
    ];
    return colors[i % colors.length];
  }

  function initials(name) {
    return name?.slice(0, 2).toUpperCase() || "AC";
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-sm bg-gray-900 rounded-t-3xl sm:rounded-2xl border border-gray-800 pb-8 pt-2 z-10 animate-slide-up">
        <div className="flex justify-center mb-4">
          <div className="w-10 h-1 bg-gray-700 rounded-full" />
        </div>

        <div className="px-5 mb-4">
          <h2 className="text-sm font-medium text-gray-400">Switch account</h2>
        </div>

        <div className="space-y-1 px-3">
          {accounts.map((acc, i) => (
            <button
              key={acc.id}
              onClick={() => { onSelect(acc); onClose(); }}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition ${
                activeAccount?.id === acc.id
                  ? "bg-violet-600/20 border border-violet-500/30"
                  : "hover:bg-gray-800"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl ${colorForIndex(i)} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                {initials(acc.accountName)}
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-white">{acc.accountName}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {acc.transactions?.length ?? 0} transactions
                </p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${acc.balance >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  ₹{acc.balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </p>
              </div>
              {activeAccount?.id === acc.id && (
                <div className="w-2 h-2 rounded-full bg-violet-400 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
