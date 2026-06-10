import { useState, useEffect, useCallback } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import AccountSwitcher from "../components/AccountSwitcher";
import AddAccountModal from "../components/AddAccountModal";
import AddTransactionModal from "../components/AddTransactionModal";

function colorForIndex(i) {
  const colors = ["bg-violet-600", "bg-emerald-600", "bg-blue-600", "bg-amber-600", "bg-rose-600", "bg-cyan-600"];
  return colors[i % colors.length];
}

function initials(name) {
  return name?.slice(0, 2).toUpperCase() || "AC";
}

export default function DashboardPage() {
  const { logout } = useAuth();

  const [accounts, setAccounts] = useState([]);
  const [activeAccount, setActiveAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [loadingTx, setLoadingTx] = useState(false);
  const [txLoading, setTxLoading] = useState(false);
  const [accLoading, setAccLoading] = useState(false);

  const [showSwitcher, setShowSwitcher] = useState(false);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showAddTx, setShowAddTx] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [error, setError] = useState(null);

  const fetchAccounts = useCallback(async (currentActiveId = null) => {
    setLoadingAccounts(true);
    try {
      const data = await api.getAccounts();
      setAccounts(data);
      if (data.length === 0) return;
      if (currentActiveId) {
        const stillExists = data.find((a) => a.id === currentActiveId);
        setActiveAccount(stillExists ?? data[0]);
      } else {
        setActiveAccount((prev) => {
          if (prev) {
            const stillExists = data.find((a) => a.id === prev.id);
            return stillExists ?? data[0];
          }
          return data[0];
        });
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoadingAccounts(false);
    }
  }, []);

  const fetchTransactions = useCallback(async (accountId) => {
    setLoadingTx(true);
    try {
      const data = await api.getTransactions(accountId);
      setTransactions(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoadingTx(false);
    }
  }, []);

  useEffect(() => { fetchAccounts(); }, [fetchAccounts]);

  useEffect(() => {
    if (activeAccount) fetchTransactions(activeAccount.id);
    else setTransactions([]);
  }, [activeAccount, fetchTransactions]);

  async function handleAddAccount(body) {
    setAccLoading(true);
    const currentId = activeAccount?.id ?? null;
    try {
      await api.addAccount(body);
      await fetchAccounts(currentId);
    } finally {
      setAccLoading(false);
    }
  }

  async function handleDeleteAccount(id) {
    try {
      await api.deleteAccount(id);
      const updated = accounts.filter((a) => a.id !== id);
      setAccounts(updated);
      if (activeAccount?.id === id) {
        setActiveAccount(updated[0] || null);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setDeleteConfirm(null);
    }
  }

  async function handleAddTransaction(body) {
    setTxLoading(true);
    const currentId = activeAccount.id;
    try {
      await api.addTransaction(currentId, body);
      await fetchAccounts(currentId);
      await fetchTransactions(currentId);
    } finally {
      setTxLoading(false);
    }
  }

  const income = transactions.filter((t) => t.transactionType === "INCOME").reduce((s, t) => s + t.transactionAmount, 0);
  const expense = transactions.filter((t) => t.transactionType === "EXPENSE").reduce((s, t) => s + t.transactionAmount, 0);

  const activeIndex = accounts.findIndex((a) => a.id === activeAccount?.id);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <span className="text-base font-semibold tracking-tight">PEM</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddAccount(true)}
            className="text-xs text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg transition"
          >
            + Account
          </button>
          <button
            onClick={logout}
            className="text-xs text-gray-500 hover:text-white transition px-2 py-1.5"
          >
            Sign out
          </button>
        </div>
      </header>

      {error && (
        <div className="mx-5 mb-4 bg-red-950 border border-red-800 text-red-300 text-xs px-4 py-2 rounded-xl flex items-center justify-between">
          {error}
          <button onClick={() => setError(null)} className="ml-2 text-red-400 hover:text-white">✕</button>
        </div>
      )}

      {loadingAccounts ? (
        <div className="flex items-center justify-center py-32">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : accounts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-800 flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-gray-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75" />
            </svg>
          </div>
          <p className="text-sm font-medium text-white mb-1">No accounts yet</p>
          <p className="text-xs text-gray-500 mb-6">Create your first account to start tracking</p>
          <button
            onClick={() => setShowAddAccount(true)}
            className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition"
          >
            Create account
          </button>
        </div>
      ) : (
        <>
          {/* Active Account Card */}
          <div className="px-5 mb-5">
            <button
              onClick={() => setShowSwitcher(true)}
              className="w-full text-left"
            >
              <div className={`rounded-3xl p-5 ${colorForIndex(activeIndex)} relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-black/10 translate-y-1/2 -translate-x-1/4" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-xs font-bold text-white">
                        {initials(activeAccount?.accountName)}
                      </div>
                      <span className="text-sm font-medium text-white/90">{activeAccount?.accountName}</span>
                    </div>
                    <div className="flex items-center gap-1 text-white/60 text-xs">
                      <span>Switch</span>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-white/60 mb-1">Balance</p>
                    <p className="text-3xl font-bold text-white tracking-tight">
                      ₹{activeAccount?.balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </p>
                  </div>

                  <div className="flex gap-4 mt-5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15M19.5 4.5H8.25M19.5 4.5v11.25" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/50">Income</p>
                        <p className="text-xs font-semibold text-white">₹{income.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 4.5l-15 15M4.5 19.5H15.75M4.5 19.5V8.25" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/50">Expenses</p>
                        <p className="text-xs font-semibold text-white">₹{expense.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </button>

            {/* Account dots */}
            {accounts.length > 1 && (
              <div className="flex justify-center gap-1.5 mt-3">
                {accounts.map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => setActiveAccount(acc)}
                    className={`rounded-full transition-all ${
                      acc.id === activeAccount?.id ? "w-4 h-1.5 bg-violet-400" : "w-1.5 h-1.5 bg-gray-700"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Transactions section */}
          <div className="px-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white">Transactions</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDeleteConfirm(activeAccount?.id)}
                  className="text-xs text-gray-600 hover:text-red-400 transition p-1"
                  title="Delete account"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                <button
                  onClick={() => setShowAddTx(true)}
                  className="text-xs bg-violet-600 hover:bg-violet-500 text-white px-3 py-1.5 rounded-lg transition"
                >
                  + Add
                </button>
              </div>
            </div>

            {loadingTx ? (
              <div className="flex justify-center py-12">
                <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm text-gray-500">No transactions yet</p>
                <p className="text-xs text-gray-600 mt-1">Tap + Add to record your first one</p>
              </div>
            ) : (
              <div className="space-y-2 pb-10">
                {[...transactions].reverse().map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center gap-4 bg-gray-900 rounded-2xl px-4 py-3.5 border border-gray-800"
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      tx.transactionType === "INCOME" ? "bg-emerald-900/60" : "bg-red-900/60"
                    }`}>
                      {tx.transactionType === "INCOME" ? (
                        <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15M19.5 4.5H8.25M19.5 4.5v11.25" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 4.5l-15 15M4.5 19.5H15.75M4.5 19.5V8.25" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{tx.description}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Before: ₹{tx.amountBeforeTransaction?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        <span className="mx-1 text-gray-700">→</span>
                        After: ₹{tx.amountAfterTransaction?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <p className={`text-sm font-semibold flex-shrink-0 ${
                      tx.transactionType === "INCOME" ? "text-emerald-400" : "text-red-400"
                    }`}>
                      {tx.transactionType === "INCOME" ? "+" : "-"}₹{tx.transactionAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-xs text-center z-10">
            <p className="text-sm font-medium text-white mb-1">Delete this account?</p>
            <p className="text-xs text-gray-400 mb-5">All transactions will be permanently removed.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white text-sm py-2.5 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteAccount(deleteConfirm)}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white text-sm py-2.5 rounded-xl transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showSwitcher && (
        <AccountSwitcher
          accounts={accounts}
          activeAccount={activeAccount}
          onSelect={setActiveAccount}
          onClose={() => setShowSwitcher(false)}
        />
      )}
      {showAddAccount && (
        <AddAccountModal
          onAdd={handleAddAccount}
          onClose={() => setShowAddAccount(false)}
          loading={accLoading}
        />
      )}
      {showAddTx && (
        <AddTransactionModal
          onAdd={handleAddTransaction}
          onClose={() => setShowAddTx(false)}
          loading={txLoading}
        />
      )}
    </div>
  );
}
