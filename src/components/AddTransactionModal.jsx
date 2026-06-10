import { useState } from "react";

export default function AddTransactionModal({ onAdd, onClose, loading }) {
  const [form, setForm] = useState({ description: "", transactionAmount: "", transactionType: "INCOME" });
  const [error, setError] = useState(null);

  function handleChange(e) {
    setError(null);
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const amount = parseFloat(form.transactionAmount);
    if (isNaN(amount) || amount <= 0) return setError("Enter a valid amount");
    if (!form.description.trim()) return setError("Description is required");
    try {
      await onAdd({
        description: form.description.trim(),
        transactionAmount: amount,
        transactionType: form.transactionType,
      });
      onClose();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-sm bg-gray-900 rounded-t-3xl sm:rounded-2xl border border-gray-800 p-6 z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-white">Add transaction</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-950 border border-red-800 text-red-300 text-xs px-3 py-2 rounded-xl">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            {["INCOME", "EXPENSE"].map((type) => (
              <button
                type="button"
                key={type}
                onClick={() => setForm((f) => ({ ...f, transactionType: type }))}
                className={`py-3 rounded-xl text-sm font-medium transition ${
                  form.transactionType === type
                    ? type === "INCOME"
                      ? "bg-emerald-600 text-white"
                      : "bg-red-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                {type === "INCOME" ? "↑ Income" : "↓ Expense"}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Amount (₹)</label>
            <input
              name="transactionAmount"
              type="number"
              step="0.01"
              min="0.01"
              value={form.transactionAmount}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition placeholder-gray-600"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Description</label>
            <input
              name="description"
              type="text"
              value={form.description}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition placeholder-gray-600"
              placeholder="e.g. Salary, Groceries"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-medium text-sm py-3 rounded-xl transition"
          >
            {loading ? "Adding…" : "Add transaction"}
          </button>
        </form>
      </div>
    </div>
  );
}
