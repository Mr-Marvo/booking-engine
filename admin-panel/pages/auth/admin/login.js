import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const res = await login(email, password);
        if (res.success) {
            router.push('/');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-slate-800 p-10 rounded-xl shadow-2xl border border-slate-700">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-white tracking-tight">
                        Admin<span className="text-blue-500">Panel</span>
                    </h2>
                    <p className="mt-2 text-center text-sm text-slate-400 font-medium uppercase tracking-widest">
                        Administrative Access Only
                    </p>
                </div>
                {error && (
                    <div className="bg-red-900/30 border-l-4 border-red-500 p-4 text-red-200 text-sm">
                        {error}
                    </div>
                )}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-slate-300 mb-1">Email Address</label>
                            <input
                                type="email"
                                required
                                className="appearance-none relative block w-full px-4 py-3 border border-slate-600 bg-slate-700 placeholder-slate-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-1">Password</label>
                            <input
                                type="password"
                                required
                                className="appearance-none relative block w-full px-4 py-3 border border-slate-600 bg-slate-700 placeholder-slate-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-black rounded-lg text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
                        >
                            Sign In to Dashboard
                        </button>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-slate-400 font-medium">
                            Need to create an admin account?{' '}
                            <Link href="/auth/admin/signup" className="text-blue-400 font-bold hover:underline">
                                Register Admin
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
