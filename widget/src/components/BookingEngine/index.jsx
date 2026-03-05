import { useState, useEffect } from 'react';
import axios from 'axios';
import { ThemeProvider, useTheme } from './ThemeContext';
import ThemeSettingsPanel from './ThemeSettingsPanel';
import StepTypeSelection from './StepTypeSelection';
import StepDetails from './StepDetails';
import StepListingSelection from './StepListingSelection';
import StepBookingUI from './StepBookingUI';
import StepPayment from './StepPayment';

const API_BASE = 'http://localhost:5000/api';

const STEP_LABELS = ['Type', 'Info', 'Select', 'Book', 'Pay'];
const TOTAL_STEPS = 5;

// Parse widget HTML attributes for theming
function getWidgetAttrs() {
    try {
        const el = document.querySelector('booking-engine');
        if (!el) return {};
        return {
            theme: el.getAttribute('data-theme') || 'ocean',
            font: el.getAttribute('data-font') || 'inter',
            radius: el.getAttribute('data-radius') || 'round',
            accent: el.getAttribute('data-accent') || null,
        };
    } catch { return {}; }
}

export default function BookingEngine() {
    const attrs = getWidgetAttrs();
    return (
        <ThemeProvider
            initialTheme={attrs.theme || 'ocean'}
            initialFont={attrs.font || 'inter'}
            initialRadius={attrs.radius || 'round'}
            customAccent={attrs.accent}
        >
            <BookingEngineInner />
        </ThemeProvider>
    );
}

function BookingEngineInner() {
    const { getCSSVars, isDark, showPanel, setShowPanel } = useTheme();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        businessType: '',
        name: '',
        email: '',
        propertyType: '',
        rooms: '',
        country: 'Singapore',
        selectedListing: null,
        bookingDetails: {},
        paymentMethod: 'card'
    });
    const [showConfirmClose, setShowConfirmClose] = useState(false);
    try {
        await axios.post(`${API_BASE}/payments/verify-session`, { sessionId }, {
            headers: { 'Authorization': `Bearer ${savedToken}` }
        });

    } catch (err) {
        console.error('[Widget] Session verification failed:', err);
    }
}) ();
setPaymentStatus('success');
setStep(6);
        } else if (window.location.pathname.includes('payment-cancel')) {
    setPaymentStatus('cancel');
    setStep(5);
}
    }, []);

console.log('[Widget] Session verification successful');
                } catch (err) {
    console.error('[Widget] Session verification failed:', err);
}
            }) ();
setPaymentStatus('success');
setStep(6);
        } else if (window.location.pathname.includes('payment-cancel')) {
    setPaymentStatus('cancel');
    setStep(5);
}
    }, []);


const nextStep = () => setStep(prev => prev + 1);
const prevStep = () => setStep(prev => prev - 1);
const updateFormData = (newData) => setFormData(prev => ({ ...prev, ...newData }));

const canProceed = () => {
    if (step === 1) return !!formData.businessType;
    if (step === 2) return !!formData.name && !!formData.email;
    if (step === 3) return !!formData.selectedListing;
    return true;
};

const handleConfirm = async () => {
    if (step === 5) {
        setIsProcessing(true);
        try {
            // In a real app, this would initiate the payment gateway
            await axios.post(`${API_BASE}/bookings`, {
                listingId: formData.selectedListing.id,
            });

            const userObj = customerRes.data.user;
            const userId = userObj?._id || userObj?.id;

            const token = customerRes.data.token;
            if (token) localStorage.setItem('booking_token', token);

            const selectedListing = formData.selectedListing;
            const listingId = selectedListing?._id || selectedListing?.id;
            if (!userId || !listingId || !token) throw new Error('Missing required data');

            const bookingRes = await axios.post(`${API_BASE}/bookings`, {
                listingId, userId,


                const token = customerRes.data.token; // Extract token

                // Persist token for redirect fallback
                if(token) {
                    localStorage.setItem('booking_token', token);
                }

                console.log('[Widget] User ID:', userId);
                console.log('[Widget] Token:', token ? 'Received' : 'Missing');

                const selectedListing = formData.selectedListing;
                const listingId = selectedListing?._id || selectedListing?.id;
                if(!userId || !listingId || !token) throw new Error('Missing required data');

            const bookingRes = await axios.post(`${API_BASE}/bookings`, {
                listingId: listingId,
                userId: userId,

                details: {
                    ...formData.bookingDetails,
                    paymentMethod: formData.paymentMethod || 'card',
                    customerEmail: formData.email || '',  // real contact email
                    customerName: formData.name || 'Guest',
                },
                totalPrice: formData.selectedListing.price
            });

            const bookingId = bookingRes.data._id;

            let paymentRes;
            if (formData.paymentMethod === 'koko') {
                paymentRes = await axios.post(`${API_BASE}/payments/koko/initiate`, { bookingId }, { headers: { 'Authorization': `Bearer ${token}` } });
            } else if (formData.paymentMethod === 'mintpay') {
                paymentRes = await axios.post(`${API_BASE}/payments/mintpay/initiate`, { bookingId }, { headers: { 'Authorization': `Bearer ${token}` } });
            } else {
                paymentRes = await axios.post(`${API_BASE}/payments/create-stripe-session`, { bookingId }, { headers: { 'Authorization': `Bearer ${token}` } });
            }

            if (paymentRes.data.url || paymentRes.data.redirectUrl) {
                window.location.href = paymentRes.data.url || paymentRes.data.redirectUrl;
            } else {
                nextStep();
            }
        } catch (err) {
            alert('Payment/Booking failed. Please try again.');
            console.error(err);

            console.error('[Widget] Booking error:', err);
            console.error('[Widget] Error response:', err.response?.data);

            const errorMessage = err.response?.data?.message || err.message || 'Unknown error';
            alert(`Payment/Booking failed: ${errorMessage}`);

        }
    } else {
        nextStep();
    }
};

const renderStep = () => {
    switch (step) {
        case 1: return <StepTypeSelection formData={formData} updateFormData={updateFormData} />;
        case 2: return <StepDetails formData={formData} updateFormData={updateFormData} />;
        case 3: return <StepListingSelection formData={formData} updateFormData={updateFormData} />;
        case 4: return <StepBookingUI formData={formData} updateFormData={updateFormData} />;
        case 5: return <StepPayment formData={formData} updateFormData={updateFormData} />;
        case 6: return <ConfirmationStep formData={formData} onRestart={() => { setStep(1); setFormData({ businessType: '', name: '', email: '', propertyType: '', rooms: '', country: 'Singapore', selectedListing: null, bookingDetails: {}, paymentMethod: 'card' }); }} />;
        default: return <StepTypeSelection formData={formData} updateFormData={updateFormData} />;
    }
};

const progressPct = step <= TOTAL_STEPS ? ((step - 1) / TOTAL_STEPS) * 100 : 100;
const cssVars = getCSSVars();

return (
    <div className="booking-engine-root" style={cssVars}>
        {/* Theme Panel */}
        <ThemeSettingsPanel />

        {/* Header */}
        <header style={{
            position: 'absolute', top: 0, left: 0, right: 0, zIndex: 60,
            padding: '20px 24px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
            {/* Logo / Brand */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'var(--w-glass)',
                backdropFilter: 'blur(12px)',
                border: '1px solid var(--w-border)',
                borderRadius: 'var(--w-radius)',
                padding: '8px 16px',
                boxShadow: 'var(--w-shadow)',
            }}>
                <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: 'var(--w-accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14,
                }}>🗓</div>
                <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--w-text)', letterSpacing: '0.04em' }}>
                    BookEngine
                </span>
            </div>

            {/* Right controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {/* Theme toggle button */}
                <button
                    onClick={() => setShowPanel(true)}
                    title="Customize Theme"
                    style={{
                        width: 40, height: 40, borderRadius: 'calc(var(--w-radius) * 0.6)',
                        border: '1px solid var(--w-border)',
                        background: 'var(--w-glass)',
                        backdropFilter: 'blur(12px)',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 18,
                        boxShadow: 'var(--w-shadow)',
                        transition: 'all var(--w-transition)',
                        color: 'var(--w-text)',
                    }}
                >
                    🎨
                </button>

                {/* Close button */}
                <button
                    onClick={() => setShowConfirmClose(true)}
                    style={{
                        width: 40, height: 40, borderRadius: 'calc(var(--w-radius) * 0.6)',
                        border: '1px solid var(--w-border)',
                        background: 'var(--w-glass)',
                        backdropFilter: 'blur(12px)',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 22, fontWeight: 400,
                        color: 'var(--w-text-muted)',
                        boxShadow: 'var(--w-shadow)',
                        transition: 'all var(--w-transition)',
                    }}
                >
                    ×
                </button>
            </div>
        </header>

        {/* Progress bar — thin strip at very top */}
        <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, zIndex: 70,
            height: 3
        }}>
            <div className="w-progress-fill" style={{ width: `${progressPct}%` }} />
        </div>

        {/* Confirm close modal */}
        {showConfirmClose && (
            <div style={{
                position: 'fixed', inset: 0, zIndex: 110,
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
            }}>
                <div
                    style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
                    onClick={() => setShowConfirmClose(false)}
                />
                <div className="w-step-enter-fast" style={{
                    background: 'var(--w-surface)',
                    borderRadius: 'var(--w-radius)',
                    padding: 40,
                    maxWidth: 400, width: '100%',
                    position: 'relative', zIndex: 1,
                    boxShadow: '0 32px 64px rgba(0,0,0,0.25)',
                    border: '1px solid var(--w-border)',
                    textAlign: 'center',
                }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
                    <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--w-text)', marginBottom: 8 }}>Leave booking?</h3>
                    <p style={{ color: 'var(--w-text-muted)', fontSize: 15, fontWeight: 500, marginBottom: 32, lineHeight: 1.6 }}>
                        Your progress will be lost. Are you sure you want to exit?
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <button
                            onClick={() => window.location.href = '/'}
                            style={{
                                padding: '14px', borderRadius: 'var(--w-radius-sm)',
                                background: '#ef4444', color: 'white',
                                fontWeight: 800, fontSize: 15, border: 'none',
                                cursor: 'pointer', transition: 'all 0.2s',
                                fontFamily: 'var(--w-font)',
                            }}
                        >
                            Yes, exit
                        </button>
                        <button
                            onClick={() => setShowConfirmClose(false)}
                            style={{
                                padding: '14px', borderRadius: 'var(--w-radius-sm)',
                                background: 'var(--w-input-bg)',
                                color: 'var(--w-text)', fontWeight: 700, fontSize: 15,
                                border: '1px solid var(--w-border)',
                                cursor: 'pointer', transition: 'all 0.2s',
                                fontFamily: 'var(--w-font)',
                            }}
                        >
                            Stay here
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Main content */}
        <main style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '100px 24px 24px',
            overflowY: 'auto',
        }}>
            <div key={step} className="w-step-enter" style={{ width: '100%', maxWidth: 1100 }}>
                {renderStep()}
            </div>
        </main>

        {/* Footer */}
        {step <= TOTAL_STEPS && (
            <footer className="w-footer">
                {/* Back */}
                <div style={{ flex: 1 }}>
                    {step > 1 && (
                        <button
                            onClick={prevStep}
                            style={{
                                background: 'none', border: 'none',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                                fontWeight: 800, fontSize: 13,
                                letterSpacing: '0.12em', textTransform: 'uppercase',
                                color: 'var(--w-text-muted)',
                                fontFamily: 'var(--w-font)',
                                transition: 'all var(--w-transition)',
                                padding: 0,
                            }}
                            onMouseEnter={e => { e.currentTarget.style.color = 'var(--w-accent)'; e.currentTarget.querySelector('span').style.transform = 'translateX(-4px)'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = 'var(--w-text-muted)'; e.currentTarget.querySelector('span').style.transform = 'translateX(0)'; }}
                        >
                            <span style={{ fontSize: 20, transition: 'transform 0.2s' }}>←</span>
                            Back
                        </button>
                    )}
                </div>

                {/* Step dots */}
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 8, alignItems: 'center' }}>
                    {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                        <div
                            key={i}
                            className={`w-step-dot ${step === i + 1 ? 'active' : step > i + 1 ? 'done' : ''}`}
                        />
                    ))}
                </div>

                {/* Next / Purchase */}
                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        onClick={handleConfirm}
                        disabled={!canProceed() || isProcessing}
                        className="w-btn-next"
                        style={{ borderRadius: 0 }}
                    >
                        {isProcessing ? (
                            <>
                                <div style={{
                                    width: 18, height: 18, borderRadius: '50%',
                                    border: '3px solid rgba(255,255,255,0.3)',
                                    borderTopColor: 'white',
                                    animation: 'w-spin 0.8s linear infinite',
                                }} />
                                Processing…
                            </>
                        ) : (
                            <>
                                <span>{step === 5 ? 'Purchase' : 'Continue'}</span>
                                <span style={{ fontSize: 20, transition: 'transform 0.2s' }}>→</span>
                            </>
                        )}
                    </button>
                </div>
            </footer>
        )}
    </div>
);
}

function ConfirmationStep({ formData, onRestart }) {
    const [showEmbed, setShowEmbed] = useState(false);
    const { themeKey, fontId, radiusId } = useTheme();

    const embedCode = `<!-- BookEngine Widget -->
<script src="https://booking-engine-widget.vercel.app/loader.js"></script>
<booking-engine
  data-account-id="YOUR_ACCOUNT_ID"
  data-theme="${themeKey}"
  data-font="${fontId}"
  data-radius="${radiusId}"
></booking-engine>`;

    return (
        <div className="w-step-enter" style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto', padding: '0 16px' }}>
            {/* Animated success icon */}
            <div style={{
                width: 100, height: 100,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 44,
                margin: '0 auto 32px',
                boxShadow: '0 16px 48px rgba(22,163,74,0.4)',
                animation: 'w-bounce 1.2s ease infinite',
            }}>
                ✓
            </div>

            <h1 style={{
                fontSize: 'clamp(32px, 5vw, 56px)',
                fontWeight: 900,
                color: 'var(--w-text)',
                marginBottom: 12,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
            }}>
                Booking Confirmed!
            </h1>

            <p style={{ fontSize: 18, color: 'var(--w-text-muted)', fontWeight: 500, lineHeight: 1.6, marginBottom: 40 }}>
                Your booking at <strong style={{ color: 'var(--w-accent)' }}>{formData.selectedListing?.title}</strong> has been successfully processed. A confirmation email will be sent shortly.
            </p>

            {/* Summary card */}
            <div className="w-glass-card" style={{ padding: '24px 32px', marginBottom: 32, textAlign: 'left' }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--w-text-muted)', marginBottom: 16 }}>Booking Summary</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ color: 'var(--w-text-muted)', fontWeight: 500 }}>Listing</span>
                    <span style={{ fontWeight: 700, color: 'var(--w-text)' }}>{formData.selectedListing?.title}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ color: 'var(--w-text-muted)', fontWeight: 500 }}>Guest</span>
                    <span style={{ fontWeight: 700, color: 'var(--w-text)' }}>{formData.name}</span>
                </div>
                <div style={{ height: 1, background: 'var(--w-border)', margin: '12px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 800, color: 'var(--w-text)' }}>Total</span>
                    <span style={{ fontWeight: 900, fontSize: 24, color: 'var(--w-accent)' }}>${formData.selectedListing?.price}</span>
                </div>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
                <button
                    onClick={onRestart}
                    style={{
                        padding: '14px 28px',
                        borderRadius: 'var(--w-radius)',
                        background: 'var(--w-accent)',
                        color: 'var(--w-accent-text)',
                        fontWeight: 800, fontSize: 15,
                        border: 'none', cursor: 'pointer',
                        fontFamily: 'var(--w-font)',
                        boxShadow: 'var(--w-shadow-accent)',
                        transition: 'all var(--w-transition)',
                    }}
                >
                    New Booking
                </button>
                <button
                    onClick={() => setShowEmbed(!showEmbed)}
                    style={{
                        padding: '14px 28px',
                        borderRadius: 'var(--w-radius)',
                        background: 'var(--w-input-bg)',
                        color: 'var(--w-text)',
                        fontWeight: 700, fontSize: 15,
                        border: '1px solid var(--w-border)',
                        cursor: 'pointer',
                        fontFamily: 'var(--w-font)',
                        transition: 'all var(--w-transition)',
                    }}
                >
                    {showEmbed ? 'Hide Code' : 'Get Embed Code'}
                </button>
            </div>

            {showEmbed && (
                <div className="w-step-enter-fast">
                    <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--w-text-muted)', marginBottom: 12 }}>
                        Add to your website
                    </p>
                    <div className="w-code-card" style={{ textAlign: 'left' }}>
                        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all', color: '#94a3b8' }}>
                            {embedCode}
                        </pre>
                        <button className="w-copy-btn" onClick={() => {
                            navigator.clipboard.writeText(embedCode);
                            alert('Copied!');
                        }}>
                            Copy
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
