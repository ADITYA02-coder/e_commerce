import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config/api';

const styles = {
  wrap: {
    minHeight: '100vh',
    background: '#f5f5f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  card: {
    background: '#fff',
    borderRadius: '16px',
    border: '1px solid #e5e5e5',
    padding: '1.75rem',
    width: '100%',
    maxWidth: '460px',
    boxSizing: 'border-box',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #f0f0f0',
  },
  headerIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: '#EBF4FF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  headerTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#111',
    margin: 0,
  },
  headerSub: {
    fontSize: '12px',
    color: '#888',
    margin: '2px 0 0',
  },
  amountRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 14px',
    background: '#f8f9fa',
    borderRadius: '10px',
    marginBottom: '1.5rem',
  },
  amountLabel: {
    fontSize: '13px',
    color: '#666',
  },
  amountValue: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#111',
  },
  tabRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '1.5rem',
  },
  tab: (active) => ({
    flex: 1,
    padding: '10px 8px',
    border: active ? '1.5px solid #185FA5' : '1px solid #e0e0e0',
    borderRadius: '10px',
    background: active ? '#EBF4FF' : 'transparent',
    color: active ? '#185FA5' : '#666',
    fontSize: '13px',
    fontWeight: active ? 600 : 400,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    transition: 'all 0.15s',
  }),
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  fieldRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  label: {
    fontSize: '12px',
    fontWeight: 500,
    color: '#666',
    letterSpacing: '0.02em',
  },
  input: {
    height: '42px',
    border: '1px solid #e0e0e0',
    borderRadius: '10px',
    padding: '0 12px',
    fontSize: '14px',
    color: '#111',
    background: '#fff',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  },
  chipRow: {
    display: 'flex',
    gap: '6px',
    marginTop: '4px',
  },
  chip: {
    height: '26px',
    padding: '0 10px',
    border: '1px solid #e0e0e0',
    borderRadius: '999px',
    fontSize: '11px',
    color: '#555',
    background: 'transparent',
    cursor: 'pointer',
  },
  upiRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-end',
  },
  verifyBtn: {
    height: '42px',
    padding: '0 16px',
    border: '1px solid #e0e0e0',
    borderRadius: '10px',
    background: 'transparent',
    fontSize: '13px',
    color: '#444',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  dividerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: '4px 0',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: '#f0f0f0',
  },
  dividerText: {
    fontSize: '12px',
    color: '#aaa',
  },
  qrArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    padding: '20px',
    background: '#f8f9fa',
    borderRadius: '12px',
  },
  qrBox: {
    width: '160px',
    height: '160px',
    background: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px',
    boxSizing: 'border-box',
  },
  qrLabel: {
    fontSize: '12px',
    color: '#666',
    textAlign: 'center',
    lineHeight: 1.6,
    margin: 0,
  },
  appChipsRow: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  appChip: {
    padding: '4px 10px',
    border: '1px solid #e0e0e0',
    borderRadius: '999px',
    fontSize: '11px',
    color: '#555',
    background: '#fff',
  },
  verifiedBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 12px',
    background: '#EDFAF4',
    borderRadius: '10px',
    border: '1px solid #A3E6C8',
  },
  verifiedName: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#0F6E56',
    margin: 0,
  },
  verifiedId: {
    fontSize: '11px',
    color: '#3a9e7e',
    margin: '2px 0 0',
  },
  verifiedBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '3px 10px',
    borderRadius: '999px',
    background: '#C5F0DF',
    color: '#0F6E56',
    fontSize: '11px',
    fontWeight: 600,
  },
  errorBox: {
    padding: '10px 12px',
    background: '#FEF2F2',
    borderRadius: '10px',
    border: '1px solid #FECACA',
    fontSize: '13px',
    color: '#B91C1C',
  },
  payBtn: (processing, success) => ({
    width: '100%',
    height: '46px',
    borderRadius: '12px',
    background: success ? '#0F6E56' : '#185FA5',
    border: 'none',
    color: '#fff',
    fontSize: '15px',
    fontWeight: 600,
    cursor: processing ? 'not-allowed' : 'pointer',
    marginTop: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    opacity: processing ? 0.75 : 1,
    transition: 'background 0.3s, opacity 0.15s',
  }),
  secureNote: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '5px',
    marginTop: '10px',
    fontSize: '11px',
    color: '#aaa',
  },
};

// QR Code SVG (static UPI QR pattern)
const QRCode = () => (
  <svg viewBox="0 0 144 144" width="144" height="144" xmlns="http://www.w3.org/2000/svg">
    <rect width="144" height="144" fill="white" />
    <g fill="#111">
      {/* Finder top-left */}
      <rect x="4" y="4" width="52" height="52" rx="2" />
      <rect x="8" y="8" width="44" height="44" rx="1" fill="white" />
      <rect x="14" y="14" width="32" height="32" rx="1" />
      <rect x="18" y="18" width="8" height="8" fill="white" />
      {/* Finder top-right */}
      <rect x="88" y="4" width="52" height="52" rx="2" />
      <rect x="92" y="8" width="44" height="44" rx="1" fill="white" />
      <rect x="98" y="14" width="32" height="32" rx="1" />
      <rect x="102" y="18" width="8" height="8" fill="white" />
      {/* Finder bottom-left */}
      <rect x="4" y="88" width="52" height="52" rx="2" />
      <rect x="8" y="92" width="44" height="44" rx="1" fill="white" />
      <rect x="14" y="98" width="32" height="32" rx="1" />
      <rect x="18" y="102" width="8" height="8" fill="white" />
      {/* Data modules */}
      <rect x="62" y="4" width="8" height="8" /><rect x="74" y="4" width="8" height="8" />
      <rect x="62" y="16" width="8" height="8" /><rect x="74" y="16" width="8" height="8" />
      <rect x="62" y="28" width="8" height="8" />
      <rect x="62" y="40" width="8" height="8" /><rect x="74" y="40" width="8" height="8" />
      <rect x="62" y="52" width="8" height="8" /><rect x="74" y="52" width="8" height="8" />
      <rect x="62" y="64" width="8" height="8" /><rect x="74" y="64" width="8" height="8" />
      <rect x="4" y="62" width="8" height="8" /><rect x="16" y="62" width="8" height="8" />
      <rect x="28" y="62" width="8" height="8" /><rect x="40" y="62" width="8" height="8" />
      <rect x="52" y="62" width="8" height="8" />
      <rect x="4" y="74" width="8" height="8" /><rect x="16" y="74" width="8" height="8" />
      <rect x="40" y="74" width="8" height="8" />
      <rect x="4" y="86" width="8" height="8" /><rect x="28" y="86" width="8" height="8" />
      <rect x="40" y="86" width="8" height="8" /><rect x="52" y="86" width="8" height="8" />
      <rect x="88" y="62" width="8" height="8" /><rect x="100" y="62" width="8" height="8" />
      <rect x="112" y="62" width="8" height="8" /><rect x="124" y="62" width="8" height="8" />
      <rect x="136" y="62" width="8" height="8" />
      <rect x="88" y="74" width="8" height="8" /><rect x="112" y="74" width="8" height="8" />
      <rect x="124" y="74" width="8" height="8" /><rect x="136" y="74" width="8" height="8" />
      <rect x="88" y="86" width="8" height="8" /><rect x="100" y="86" width="8" height="8" />
      <rect x="112" y="86" width="8" height="8" /><rect x="136" y="86" width="8" height="8" />
      <rect x="62" y="88" width="8" height="8" /><rect x="74" y="88" width="8" height="8" />
      <rect x="62" y="100" width="8" height="8" />
      <rect x="74" y="112" width="8" height="8" />
      <rect x="62" y="124" width="8" height="8" /><rect x="74" y="124" width="8" height="8" />
      <rect x="62" y="136" width="8" height="8" /><rect x="74" y="136" width="8" height="8" />
      <rect x="88" y="100" width="8" height="8" /><rect x="100" y="100" width="8" height="8" />
      <rect x="112" y="100" width="8" height="8" /><rect x="124" y="100" width="8" height="8" />
      <rect x="136" y="100" width="8" height="8" />
      <rect x="88" y="112" width="8" height="8" /><rect x="100" y="112" width="8" height="8" />
      <rect x="124" y="112" width="8" height="8" />
      <rect x="88" y="124" width="8" height="8" /><rect x="112" y="124" width="8" height="8" />
      <rect x="124" y="124" width="8" height="8" /><rect x="136" y="124" width="8" height="8" />
      <rect x="100" y="136" width="8" height="8" /><rect x="112" y="136" width="8" height="8" />
      <rect x="136" y="136" width="8" height="8" />
    </g>
  </svg>
);

const Payment = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('debit');
  const pendingOrderId = localStorage.getItem('pendingOrderId') || '';
  const pendingOrderAmount = Number(localStorage.getItem('pendingOrderAmount') || 0);
  const checkoutCartId = localStorage.getItem('checkoutCartId') || '';
  const payableAmount = pendingOrderAmount > 0 ? pendingOrderAmount : 1499;

  // Debit card fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  // UPI fields
  const [upiId, setUpiId] = useState('');
  const [upiStatus, setUpiStatus] = useState(null); // null | 'verifying' | 'verified' | 'error'
  const [upiName, setUpiName] = useState('');

  // Submit state
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  // Input focus state
  const [focusedInput, setFocusedInput] = useState(null);

  const formatCardNumber = (val) => {
    const digits = val.replace(/\D/g, '').substring(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, '').substring(0, 4);
    if (digits.length >= 2) return digits.substring(0, 2) + ' / ' + digits.substring(2);
    return digits;
  };

  const getCardBrand = () => {
    const d = cardNumber.replace(/\s/g, '');
    if (d.startsWith('4')) return 'VISA';
    if (d.startsWith('5')) return 'MC';
    if (d.startsWith('6')) return 'RuPay';
    return '';
  };

  const verifyUpi = () => {
    if (!upiId || !upiId.includes('@')) {
      setUpiStatus('error');
      return;
    }
    setUpiStatus('verifying');
    setTimeout(() => {
      const name = upiId.split('@')[0]
        .replace(/[._]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
      setUpiName(name);
      setUpiStatus('verified');
    }, 1200);
  };

  const handlePay = () => {
    setProcessing(true);
    const finalizePayment = async () => {
      try {
        if (pendingOrderId) {
          await fetch(`${API_URL}/orders/${pendingOrderId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentStatus: 'paid', orderStatus: 'processing' }),
          });
        }

        if (checkoutCartId) {
          await fetch(`${API_URL}/carts/${checkoutCartId}`, { method: 'DELETE' });
        }

        localStorage.removeItem('pendingOrderId');
        localStorage.removeItem('pendingOrderAmount');
        localStorage.removeItem('checkoutCartId');

        setProcessing(false);
        setSuccess(true);
        setTimeout(() => {
          navigate('/order');
        }, 1200);
      } catch (error) {
        setProcessing(false);
      }
    };

    setTimeout(finalizePayment, 1300);
  };

  const inputStyle = (id) => ({
    ...styles.input,
    borderColor: focusedInput === id ? '#185FA5' : '#e0e0e0',
    boxShadow: focusedInput === id ? '0 0 0 3px rgba(24,95,165,0.1)' : 'none',
  });

  const btnLabel = success
    ? '✓ Payment successful!'
    : processing
    ? 'Processing…'
    : tab === 'upi' && upiStatus === 'verified'
    ? `Pay ₹${payableAmount.toFixed(2)} via UPI`
    : `Pay ₹${payableAmount.toFixed(2)}`;

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <div>
            <p style={styles.headerTitle}>Secure checkout</p>
            <p style={styles.headerSub}>256-bit SSL encrypted</p>
          </div>
        </div>

        {/* Amount */}
        <div style={styles.amountRow}>
          <span style={styles.amountLabel}>Order total</span>
          <span style={styles.amountValue}>₹{payableAmount.toFixed(2)}</span>
        </div>

        {/* Tabs */}
        <div style={styles.tabRow}>
          <button style={styles.tab(tab === 'debit')} onClick={() => setTab('debit')}>
            💳 Debit card
          </button>
          <button style={styles.tab(tab === 'upi')} onClick={() => setTab('upi')}>
            📱 UPI
          </button>
        </div>

        {/* Debit Card Panel */}
        {tab === 'debit' && (
          <div style={styles.fieldGroup}>
            <div style={styles.field}>
              <label style={styles.label}>Card number</label>
              <div style={{ position: 'relative' }}>
                <input
                  style={{ ...inputStyle('card'), paddingRight: '52px' }}
                  type="text"
                  placeholder="0000  0000  0000  0000"
                  value={cardNumber}
                  maxLength={19}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  onFocus={() => setFocusedInput('card')}
                  onBlur={() => setFocusedInput(null)}
                />
                {getCardBrand() && (
                  <span style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    fontSize: '10px', fontWeight: 700, color: '#185FA5', background: '#EBF4FF',
                    padding: '2px 6px', borderRadius: '4px',
                  }}>
                    {getCardBrand()}
                  </span>
                )}
              </div>
              <div style={styles.chipRow}>
                <button style={styles.chip} onClick={() => setCardNumber('4111 1111 1111 1111')}>Demo Visa</button>
                <button style={styles.chip} onClick={() => setCardNumber('5500 0000 0000 0004')}>Demo MC</button>
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Cardholder name</label>
              <input
                style={inputStyle('name')}
                type="text"
                placeholder="As printed on card"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                onFocus={() => setFocusedInput('name')}
                onBlur={() => setFocusedInput(null)}
              />
            </div>

            <div style={styles.fieldRow}>
              <div style={styles.field}>
                <label style={styles.label}>Expiry date</label>
                <input
                  style={inputStyle('expiry')}
                  type="text"
                  placeholder="MM / YY"
                  value={expiry}
                  maxLength={7}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  onFocus={() => setFocusedInput('expiry')}
                  onBlur={() => setFocusedInput(null)}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>CVC</label>
                <input
                  style={inputStyle('cvc')}
                  type="password"
                  placeholder="•••"
                  value={cvc}
                  maxLength={4}
                  onChange={(e) => setCvc(e.target.value)}
                  onFocus={() => setFocusedInput('cvc')}
                  onBlur={() => setFocusedInput(null)}
                />
              </div>
            </div>
          </div>
        )}

        {/* UPI Panel */}
        {tab === 'upi' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={styles.upiRow}>
              <div style={{ ...styles.field, flex: 1 }}>
                <label style={styles.label}>UPI ID</label>
                <input
                  style={inputStyle('upi')}
                  type="text"
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={(e) => { setUpiId(e.target.value); setUpiStatus(null); }}
                  onFocus={() => setFocusedInput('upi')}
                  onBlur={() => setFocusedInput(null)}
                />
              </div>
              <button style={styles.verifyBtn} onClick={verifyUpi}>Verify</button>
            </div>

            {upiStatus === 'error' && (
              <div style={styles.errorBox}>
                ⚠ Enter a valid UPI ID (e.g. name@upi)
              </div>
            )}
            {upiStatus === 'verifying' && (
              <div style={{ ...styles.errorBox, background: '#f8f9fa', border: '1px solid #e0e0e0', color: '#666' }}>
                Verifying…
              </div>
            )}
            {upiStatus === 'verified' && (
              <div style={styles.verifiedBox}>
                <div>
                  <p style={styles.verifiedName}>{upiName}</p>
                  <p style={styles.verifiedId}>{upiId}</p>
                </div>
                <span style={styles.verifiedBadge}>✓ Verified</span>
              </div>
            )}

            <div style={styles.dividerRow}>
              <div style={styles.dividerLine} />
              <span style={styles.dividerText}>or scan QR code</span>
              <div style={styles.dividerLine} />
            </div>

            <div style={styles.qrArea}>
              <div style={styles.qrBox}>
                <QRCode />
              </div>
              <p style={styles.qrLabel}>
                Open any UPI app, tap "Scan QR"<br />
                and pay ₹{payableAmount.toFixed(2)}
              </p>
              <div style={styles.appChipsRow}>
                {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                  <span key={app} style={styles.appChip}>{app}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Pay Button */}
        <button
          style={styles.payBtn(processing, success)}
          onClick={handlePay}
          disabled={processing || success}
        >
          {!processing && !success && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          )}
          {btnLabel}
        </button>

        {/* Secure note */}
        <div style={styles.secureNote}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Secured by Razorpay · PCI DSS compliant
        </div>
      </div>
    </div>
  );
};

export default Payment;