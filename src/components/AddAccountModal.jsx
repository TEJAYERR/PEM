import { useState } from "react";

export default function AddAccountModal({ onAdd, onClose, loading }) {
  const [form, setForm] = useState({ accountName: "", balance: "" });
  const [error, setError] = useState(null);

  function handleChange(e) {
    setError(null);
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.accountName.trim()) return setError("Account name is required");
    const balance = parseFloat(form.balance);
    if (isNaN(balance)) return setError("Enter a valid starting balance");
    try {
      await onAdd({ accountName: form.accountName.trim(), balance });
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
          <h2 className="text-base font-semibold text-white">New account</h2>
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
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Account name</label>
            <input
              name="accountName"
              type="text"
              value={form.accountName}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition placeholder-gray-600"
              placeholder="e.g. Savings, HDFC"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Starting balance (₹)</label>
            <input
              name="balance"
              type="number"
              step="0.01"
              value={form.balance}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition placeholder-gray-600"
              placeholder="0.00"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-medium text-sm py-3 rounded-xl transition"
          >
            {loading ? "Creating…" : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}
