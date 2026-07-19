import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, CreditCard, Landmark, QrCode, ShieldCheck, Smartphone, Truck } from "lucide-react";
import { API_URL } from "../config/api";
import authHeader from "../services/auth-header";
import "../styles/Payment.css";

const paymentOptions = [
  { id: "debit_card", label: "Credit or debit card", icon: CreditCard },
  { id: "upi", label: "UPI ID", icon: Smartphone },
  { id: "upi_qr", label: "Scan QR code", icon: QrCode },
  { id: "net_banking", label: "Net banking", icon: Landmark },
  { id: "cod", label: "Cash on delivery", icon: Truck }
];

const QRPattern = () => (
  <svg viewBox="0 0 120 120" aria-label="UPI QR code">
    <rect width="120" height="120" fill="#fff" />
    <path d="M8 8h30v30H8zM82 8h30v30H82zM8 82h30v30H8z" fill="#111" />
    <path d="M14 14h18v18H14zM88 14h18v18H88zM14 88h18v18H14z" fill="#fff" />
    <path d="M20 20h6v6h-6zM94 20h6v6h-6zM20 94h6v6h-6zM46 10h8v8h-8zM62 10h8v8h-8zM46 26h8v8h-8zM62 34h8v8h-8zM46 50h8v8h-8zM62 50h8v8h-8zM78 50h8v8h-8zM94 50h8v8h-8zM110 50h8v8h-8zM10 50h8v8h-8zM26 50h8v8h-8zM42 66h8v8h-8zM58 66h8v8h-8zM74 66h8v8h-8zM90 66h8v8h-8zM106 66h8v8h-8zM50 82h8v8h-8zM66 82h8v8h-8zM82 82h8v8h-8zM98 82h8v8h-8zM50 98h8v8h-8zM66 106h8v8h-8zM82 98h8v8h-8zM106 98h8v8h-8z" fill="#111" />
  </svg>
);

const Payment = () => {
  const navigate = useNavigate();
  const pendingOrderId = localStorage.getItem("pendingOrderId") || "";
  const pendingOrderAmount = Number(localStorage.getItem("pendingOrderAmount") || 0);
  const checkoutCartId = localStorage.getItem("checkoutCartId") || "";
  const payableAmount = pendingOrderAmount > 0 ? pendingOrderAmount : 0;

  const [method, setMethod] = useState("debit_card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [upiId, setUpiId] = useState("");
  const [bank, setBank] = useState("State Bank of India");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [processing, setProcessing] = useState(false);

  const selectedOption = useMemo(
    () => paymentOptions.find((option) => option.id === method) || paymentOptions[0],
    [method]
  );

  const formatCardNumber = (value) =>
    value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)} / ${digits.slice(2)}` : digits;
  };

  const getCardBrand = () => {
    const digits = cardNumber.replace(/\s/g, "");
    if (digits.startsWith("4")) return "VISA";
    if (digits.startsWith("5")) return "Mastercard";
    if (digits.startsWith("6")) return "RuPay";
    return "Card";
  };

  const validatePayment = () => {
    if (!pendingOrderId || payableAmount <= 0) {
      return "No pending order found. Please place an order again.";
    }

    if (method === "debit_card") {
      if (cardNumber.replace(/\s/g, "").length < 16 || !cardName.trim() || expiry.length < 7 || cvv.length < 3) {
        return "Enter complete card details to continue.";
      }
    }

    if (method === "upi" && !/^[\w.-]+@[\w.-]+$/.test(upiId.trim())) {
      return "Enter a valid UPI ID, for example name@upi.";
    }

    return "";
  };

  const clearCheckoutState = async () => {
    if (checkoutCartId) {
      await fetch(`${API_URL}/carts/${checkoutCartId}`, {
        method: "DELETE",
        headers: authHeader()
      }).catch(() => {});
    }

    localStorage.removeItem("pendingOrderId");
    localStorage.removeItem("pendingOrderAmount");
    localStorage.removeItem("checkoutCartId");
  };

  const handlePayment = async () => {
    const validationError = validatePayment();
    if (validationError) {
      setStatus({ type: "error", message: validationError });
      return;
    }

    setProcessing(true);
    setStatus({ type: "info", message: method === "cod" ? "Placing cash on delivery order..." : "Processing secure payment..." });

    try {
      const paymentDetails = {
        last4: cardNumber.replace(/\s/g, "").slice(-4),
        brand: method === "debit_card" ? getCardBrand() : undefined,
        upiId: method === "upi" ? upiId.trim() : undefined,
        payerName: method === "upi" ? upiId.split("@")[0] : undefined,
        qrReference: method === "upi_qr" ? `QR-${pendingOrderId}` : undefined,
        bank: method === "net_banking" ? bank : undefined
      };

      const createResponse = await fetch(`${API_URL}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify({
          orderId: pendingOrderId,
          amount: payableAmount,
          currency: "INR",
          paymentMethod: method,
          status: method === "cod" ? "pending" : "completed",
          details: paymentDetails
        })
      });

      if (!createResponse.ok) {
        const error = await createResponse.json().catch(() => ({}));
        throw new Error(error.message || "Unable to process payment.");
      }

      const payment = await createResponse.json();
      await clearCheckoutState();

      setStatus({
        type: "success",
        message:
          method === "cod"
            ? "Order placed with Cash on Delivery. Payment status is pending until delivery."
            : `Payment successful. Transaction ID: ${payment.transactionId || payment.paymentId}`
      });

      setTimeout(() => navigate("/order"), 1300);
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Payment failed. Please try again." });
    } finally {
      setProcessing(false);
    }
  };

  const SelectedIcon = selectedOption.icon;

  return (
    <div className="payment-page">
      <div className="payment-shell">
        <header className="payment-header">
          <div>
            <span>Checkout</span>
            <h1>Select a payment method</h1>
          </div>
          <div className="payment-secure">
            <ShieldCheck size={18} />
            Secure payment
          </div>
        </header>

        <div className="payment-grid">
          <section className="payment-methods">
            <div className="payment-step">
              <strong>1</strong>
              <span>Payment method</span>
            </div>

            <div className="payment-option-list">
              {paymentOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    type="button"
                    className={`payment-option ${method === option.id ? "is-active" : ""}`}
                    onClick={() => setMethod(option.id)}
                    key={option.id}
                  >
                    <Icon size={19} />
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="payment-panel">
              <div className="payment-panel__title">
                <SelectedIcon size={20} />
                <h2>{selectedOption.label}</h2>
              </div>

              {method === "debit_card" && (
                <div className="payment-fields">
                  <label>
                    Card number
                    <input value={cardNumber} onChange={(event) => setCardNumber(formatCardNumber(event.target.value))} placeholder="0000 0000 0000 0000" />
                  </label>
                  <label>
                    Name on card
                    <input value={cardName} onChange={(event) => setCardName(event.target.value)} placeholder="As printed on card" />
                  </label>
                  <div className="payment-field-row">
                    <label>
                      Expiry
                      <input value={expiry} onChange={(event) => setExpiry(formatExpiry(event.target.value))} placeholder="MM / YY" />
                    </label>
                    <label>
                      CVV
                      <input value={cvv} onChange={(event) => setCvv(event.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="123" type="password" />
                    </label>
                  </div>
                  <div className="payment-card-brand">{getCardBrand()} accepted</div>
                </div>
              )}

              {method === "upi" && (
                <div className="payment-fields">
                  <label>
                    UPI ID
                    <input value={upiId} onChange={(event) => setUpiId(event.target.value)} placeholder="yourname@upi" />
                  </label>
                  <div className="payment-help">Works with BHIM, GPay, PhonePe, Paytm, and other UPI apps.</div>
                </div>
              )}

              {method === "upi_qr" && (
                <div className="payment-qr-box">
                  <QRPattern />
                  <p>Scan this QR code using any UPI app and approve the payment for Rs. {payableAmount.toLocaleString("en-IN")}.</p>
                </div>
              )}

              {method === "net_banking" && (
                <div className="payment-fields">
                  <label>
                    Select bank
                    <select value={bank} onChange={(event) => setBank(event.target.value)}>
                      <option>State Bank of India</option>
                      <option>HDFC Bank</option>
                      <option>ICICI Bank</option>
                      <option>Axis Bank</option>
                      <option>Kotak Mahindra Bank</option>
                    </select>
                  </label>
                  <div className="payment-help">You will be redirected to your bank to authorize the payment.</div>
                </div>
              )}

              {method === "cod" && (
                <div className="payment-cod">
                  <Truck size={26} />
                  <div>
                    <strong>Pay with cash when your order is delivered.</strong>
                    <p>Payment status will remain pending until delivery collection is confirmed.</p>
                  </div>
                </div>
              )}
            </div>
          </section>

          <aside className="payment-summary">
            <div className="payment-step">
              <strong>2</strong>
              <span>Order summary</span>
            </div>
            <div className="summary-row">
              <span>Items total</span>
              <strong>Rs. {payableAmount.toLocaleString("en-IN")}</strong>
            </div>
            <div className="summary-row">
              <span>Delivery</span>
              <strong>FREE</strong>
            </div>
            <div className="summary-total">
              <span>Order total</span>
              <strong>Rs. {payableAmount.toLocaleString("en-IN")}</strong>
            </div>

            {status.message ? (
              <div className={`payment-status payment-status--${status.type}`}>
                {status.type === "success" ? <CheckCircle2 size={18} /> : null}
                <span>{status.message}</span>
              </div>
            ) : null}

            <button type="button" className="payment-place-order" onClick={handlePayment} disabled={processing}>
              {processing ? "Processing..." : method === "cod" ? "Place your order" : `Pay Rs. ${payableAmount.toLocaleString("en-IN")}`}
            </button>

            <p className="payment-note">
              By placing your order, you agree that the payment status will be saved against this order.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Payment;
