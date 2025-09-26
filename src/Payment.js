import React from 'react'
import {Navigate, useNavigate } from 'react-router-dom';
const Payment = () => {
  const[paymentMethod, setPaymentMethod] = React.useState('');
  const[cardNumber, setCardNumber] = React.useState('');
  const[cardHolderName, setCardHolderName] = React.useState('');
  const[expiryDate, setExpiryDate] = React.useState('');
  const[cvc, setCvc] = React.useState('');
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();

    // Handle payment submission logic here
    alert('Payment submitted!');
    // Reset form fields
    setPaymentMethod('');
    setCardNumber('');
    setCardHolderName('');
    setExpiryDate('');
    setCvc('');
    navigate('/order');
  }
  const fakeCardDetails = {
    cardNumber: '1234 5678 9012 3456',
    cardHolderName: 'Aditya Shukla',
    expiryDate: '12/27',
    cvc: '123',
  };
  return (
    <div>
      <h2>Payment Page</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Payment Method:</label>
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            <option value="">Select</option>
            <option value="debit">Debit Card</option>
            <option value="upi">UPI</option>
          </select>
        </div>
        {paymentMethod === 'debit' && (
          <>
            <div>
              <label>Card Number:</label>
              <input
                type="text"
                value={fakeCardDetails.cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
              />
            </div>
            <div>
              <label>Card Holder Name:</label>
              <input
                type="text"
                value={fakeCardDetails.cardHolderName}
                onChange={(e) => setCardHolderName(e.target.value)}
              />
            </div>
            <div>
              <label>Expiry Date:</label>
              <input
                type="text"
                value={fakeCardDetails.expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </div>
            <div>
              <label>CVC:</label>
              <input
                type="number"
                value={fakeCardDetails.cvc}
                onChange={(e) => setCvc(e.target.value)}
              />
            </div>
          </>
        )}
        <button type="submit">Proceed to Payment</button>
      </form>
    </div>
  )
}

export default Payment