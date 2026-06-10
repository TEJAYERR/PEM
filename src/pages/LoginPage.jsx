import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage({ onNavigate }) {
  const { login, loading, error, setError } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });

  function handleChange(e) {
    setError(null);
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await login(form.email, form.password);
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-violet-600 mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Welcome back</h1>
          <p className="text-sm text-gray-400 mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-950 border border-red-800 text-red-300 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Email</label>
            <input
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full bg-gray-900 border border-gray-800 text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition placeholder-gray-600"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Password</label>
            <input
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full bg-gray-900 border border-gray-800 text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition placeholder-gray-600"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-medium text-sm py-3 rounded-xl transition mt-2"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{" "}
          <button onClick={() => onNavigate("register")} className="text-violet-400 hover:text-violet-300 transition">
            Create one
          </button>
        </p>
      </div>
    </div>
  );
}
