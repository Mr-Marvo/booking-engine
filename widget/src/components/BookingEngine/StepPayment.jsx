import { useState } from 'react';
import { useTheme } from './ThemeContext';

export default function StepPayment({ formData, updateFormData }) {
    const [selectedMethod, setSelectedMethod] = useState(formData.paymentMethod || 'card');
    const { isDark } = useTheme();

    const paymentMethods = [
        {
            id: 'card',
            name: 'Credit / Debit Card',
            sub: 'Powered by Stripe — secure 3D auth',
            icon: '💳',
            badge: 'Most Popular',
        },
        {
            id: 'koko',
            name: 'Koko Pay',
            sub: 'Split into 3 interest-free payments',
            icon: null,
            img: '/images/koko-logo.png',
            imgAlt: 'Koko',
            badge: 'Buy Now Pay Later',
        },
        {
            id: 'mintpay',
            name: 'Mint Pay',
            sub: 'Shop now, pay over time',
            icon: null,
            img: '/images/mintpay-logo.png',
            imgAlt: 'Mint Pay',
            badge: null,
        },
    ];

    const handleSelect = (id) => {
        setSelectedMethod(id);
        updateFormData({ paymentMethod: id });
    };

    const price = formData.selectedListing?.price || 0;

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 32,
            alignItems: 'start',
            width: '100%',
        }}>
            {/* Left — summary */}
            <div>
                <div className="w-badge" style={{ marginBottom: 20 }}>Step 5 of 5</div>
                <h1 style={{
                    fontSize: 'clamp(32px, 4.5vw, 60px)',
                    fontWeight: 900,
                    letterSpacing: '-0.04em',
                    color: 'var(--w-text)',
                    lineHeight: 1.05,
                    marginBottom: 16,
                }}>
                    Secure <span style={{ color: 'var(--w-accent)' }}>payment</span>
                </h1>
                <p style={{
                    fontSize: 'clamp(14px, 1.5vw, 18px)',
                    color: 'var(--w-text-muted)',
                    fontWeight: 500,
                    lineHeight: 1.7,
                    marginBottom: 32,
                }}>
                    Your transaction is protected with 256-bit SSL encryption. You can cancel anytime before check-in.
                </p>

                {/* Order summary card */}
                <div className="w-glass-card" style={{ padding: '24px 24px' }}>
                    <div style={{
                        fontSize: 11, fontWeight: 800,
                        letterSpacing: '0.12em', textTransform: 'uppercase',
                        color: 'var(--w-text-muted)', marginBottom: 16,
                    }}>
                        Order Summary
                    </div>

                    <div style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        paddingBottom: 14, marginBottom: 14,
                        borderBottom: '1px solid var(--w-border)',
                    }}>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--w-text)' }}>
                                {formData.selectedListing?.title}
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--w-text-muted)', fontWeight: 500, marginTop: 2 }}>
                                📍 {formData.selectedListing?.location}
                            </div>
                        </div>
                        <div style={{ fontWeight: 900, fontSize: 18, color: 'var(--w-text)' }}>
                            ${price}
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span style={{ color: 'var(--w-text-muted)', fontSize: 13, fontWeight: 500 }}>Subtotal</span>
                        <span style={{ fontWeight: 700, color: 'var(--w-text)' }}>${price}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <span style={{ color: 'var(--w-text-muted)', fontSize: 13, fontWeight: 500 }}>Taxes & fees</span>
                        <span style={{ fontWeight: 700, color: '#22c55e', fontSize: 13 }}>included</span>
                    </div>

                    <div style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '14px 0',
                        borderTop: '2px solid var(--w-border)',
                    }}>
                        <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--w-text)' }}>Total</span>
                        <span style={{ fontWeight: 900, fontSize: 28, color: 'var(--w-accent)' }}>${price}</span>
                    </div>
                </div>

                {/* Security badges */}
                <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
                    {['🔒 SSL Secure', '✅ Verified', '↩️ Refundable'].map(b => (
                        <span key={b} style={{
                            fontSize: 11, fontWeight: 700,
                            padding: '5px 12px',
                            borderRadius: 999,
                            background: 'var(--w-input-bg)',
                            border: '1px solid var(--w-border)',
                            color: 'var(--w-text-muted)',
                        }}>{b}</span>
                    ))}
                </div>
            </div>

            {/* Right — payment methods */}
            <div>
                <div style={{
                    fontSize: 11, fontWeight: 800,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: 'var(--w-text-muted)', marginBottom: 14,
                }}>
                    Select payment method
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {paymentMethods.map(method => {
                        const isSelected = selectedMethod === method.id;
                        return (
                            <div
                                key={method.id}
                                className={`w-option-card ${isSelected ? 'selected' : ''}`}
                                onClick={() => handleSelect(method.id)}
                                style={{ position: 'relative' }}
                            >
                                {method.badge && (
                                    <span style={{
                                        position: 'absolute', top: -10, right: 16,
                                        fontSize: 10, fontWeight: 800,
                                        textTransform: 'uppercase', letterSpacing: '0.08em',
                                        background: 'var(--w-accent)',
                                        color: 'var(--w-accent-text)',
                                        padding: '3px 10px', borderRadius: 999,
                                    }}>
                                        {method.badge}
                                    </span>
                                )}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                    <div className="w-icon-circle" style={{ background: isSelected ? 'color-mix(in srgb, var(--w-accent) 10%, white)' : undefined }}>
                                        {method.icon ? (
                                            <span style={{ fontSize: 24 }}>{method.icon}</span>
                                        ) : (
                                            <img src={method.img} alt={method.imgAlt} style={{ maxWidth: 52, maxHeight: 24, objectFit: 'contain' }} />
                                        )}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{
                                            fontWeight: 800, fontSize: 15,
                                            color: isSelected ? 'var(--w-accent)' : 'var(--w-text)',
                                            marginBottom: 3,
                                        }}>
                                            {method.name}
                                        </div>
                                        <div style={{ fontSize: 12, color: 'var(--w-text-muted)', fontWeight: 500 }}>
                                            {method.sub}
                                        </div>
                                    </div>
                                </div>
                                <div className="w-radio-dot" />
                            </div>
                        );
                    })}
                </div>

                <p style={{
                    marginTop: 20, fontSize: 11,
                    color: 'var(--w-text-muted)', fontWeight: 500,
                    lineHeight: 1.6, textAlign: 'center',
                }}>
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    );
}
