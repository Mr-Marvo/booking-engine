export default function StepDetails({ formData, updateFormData }) {
    const typeLabel = formData.businessType === 'hotel' ? 'hotel' : formData.businessType;

    return (
        <div className="booking-step-content">
            <div className="text-center lg:text-left py-4 lg:py-0 self-center">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 lg:mb-6 flex flex-col lg:flex-row items-center gap-3 lg:gap-6 text-slate-900 tracking-tight leading-tight">
                    The Details <span className="text-3xl lg:text-6xl text-blue-500 animate-pulse">→</span>
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-slate-500 font-semibold leading-relaxed max-w-xl mx-auto lg:mx-0">
                    Let's get some basic information about your property.
                </p>
            </div>

            <div className="space-y-6 w-full max-w-lg mx-auto lg:ml-auto bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-blue-900/5 border border-slate-100">
                <div className="space-y-3">
                    <label className="text-xs md:text-sm font-black text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                    <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full text-base md:text-xl p-4 md:p-5 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all rounded-2xl"
                        value={formData.name || ''}
                        onChange={(e) => updateFormData({ name: e.target.value })}
                        required
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-xs md:text-sm font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                    <input
                        type="email"
                        placeholder="john@example.com"
                        className="w-full text-base md:text-xl p-4 md:p-5 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all rounded-2xl"
                        value={formData.email || ''}
                        onChange={(e) => updateFormData({ email: e.target.value })}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

                    <div className="space-y-3">
                        <label className="text-xs md:text-sm font-black text-slate-400 uppercase tracking-widest px-1">Property Standard</label>
                        <select
                            className="w-full text-base md:text-xl p-4 md:p-5 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all rounded-2xl appearance-none"
                            value={formData.propertyType}
                            onChange={(e) => updateFormData({ propertyType: e.target.value })}
                        >
                            <option value="">Select Category</option>
                            <option value="luxury">💎 Luxury</option>
                            <option value="budget">💰 Budget</option>
                            <option value="boutique">✨ Boutique</option>
                        </select>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs md:text-sm font-black text-slate-400 uppercase tracking-widest px-1">Quantity (Units)</label>
                        <input
                            type="number"
                            placeholder="0"
                            className="w-full text-base md:text-xl p-4 md:p-5 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all rounded-2xl"
                            value={formData.rooms}
                            onChange={(e) => updateFormData({ rooms: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-xs md:text-sm font-black text-slate-400 uppercase tracking-widest px-1">Property Country</label>
                    <input
                        type="text"
                        className="w-full text-base md:text-xl p-4 md:p-5 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all rounded-2xl"
                        placeholder="e.g. Singapore"
                        value={formData.country}
                        onChange={(e) => updateFormData({ country: e.target.value })}
                    />
                </div>
            </div>
        </div>
    );
}
