import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function AdminSignup() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'admin',
        adminSecret: ''
    });
    const [error, setError] = useState('');
    const { signup } = useAuth();
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const res = await signup(formData);
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
                        Admin<span className="text-blue-500">Access</span>
                    </h2>
                    <p className="mt-2 text-center text-sm text-slate-400 font-medium uppercase tracking-widest">
                        System Administrator Registration
                    </p>
                </div>
                {error && (
                    <div className="bg-red-900/30 border-l-4 border-red-500 p-4 text-red-200 text-sm">
                        {error}
                    </div>
                )}
                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-1">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                className="appearance-none relative block w-full px-4 py-3 border border-slate-600 bg-slate-700 placeholder-slate-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-1">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                required
                                className="appearance-none relative block w-full px-4 py-3 border border-slate-600 bg-slate-700 placeholder-slate-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-1">Password</label>
                            <input
                                type="password"
                                name="password"
                                required
                                className="appearance-none relative block w-full px-4 py-3 border border-slate-600 bg-slate-700 placeholder-slate-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                                placeholder="Password (min 6 characters)"
                                value={formData.password}
                                onChange={handleChange}
                                minLength={6}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-blue-400 mb-1">Admin Setup Key</label>
                            <input
                                type="password"
                                name="adminSecret"
                                required
                                className="appearance-none relative block w-full px-4 py-3 border border-blue-500/50 bg-slate-900 placeholder-slate-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                                placeholder="Enter secret key to create admin"
                                value={formData.adminSecret}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <input type="hidden" name="role" value="admin" />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-black rounded-lg text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
                        >
                            Register Admin
                        </button>
                    </div>

                    <div className="text-center mt-6">
                        <p className="text-sm text-slate-400 font-medium">
                            Already have an account?{' '}
                            <Link href="/auth/admin/login" className="text-blue-400 font-bold hover:underline">
                                Admin Login
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
