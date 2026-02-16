import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Signup() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'vendor'
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight">
                        Vendor<span className="text-blue-600">Signup</span>
                    </h2>
                    <p className="mt-2 text-center text-sm text-secondary font-medium uppercase tracking-widest">
                        Join our multi-vendor platform
                    </p>
                </div>
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 text-red-700 text-sm">
                        {error}
                    </div>
                )}
                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                className="appearance-none relative block w-full px-4 py-3 border border-border placeholder-slate-400 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                required
                                className="appearance-none relative block w-full px-4 py-3 border border-border placeholder-slate-400 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
                            <input
                                type="password"
                                name="password"
                                required
                                className="appearance-none relative block w-full px-4 py-3 border border-border placeholder-slate-400 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                                placeholder="Password (min 6 characters)"
                                value={formData.password}
                                onChange={handleChange}
                                minLength={6}
                            />
                        </div>
                        <div>
                            <input type="hidden" name="role" value="vendor" />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-black rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
                        >
                            Register
                        </button>
                    </div>

                    <div className="text-center mt-6">
                        <p className="text-sm text-slate-600 font-medium">
                            Already have an account?{' '}
                            <Link href="/auth/login" className="text-blue-600 font-bold hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
