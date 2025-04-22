import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Add useEffect to trigger payment on page load
  useEffect(() => {
    // Small timeout to ensure everything is loaded properly
    const timer = setTimeout(() => {
      paymentHandler();
    }, 0); // 1 second delay

    // Cleanup function
    return () => clearTimeout(timer);
  }, []); // Empty dependency array means this runs once on mount

  const paymentHandler = async (event) => {
    try {
      const amount = 500;
      const currency = 'INR';
      const receiptId = '1234567890';

      const response = await fetch('http://localhost:9000/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount,
          currency,
          receipt: receiptId
        })
      });

      const order = await response.json();
      console.log('order', order);

      var option = {
        key: "rzp_test_kEqy5IPKOz3WVi",
        amount,
        currency,
        name: "Manish",
        description: "Test Transaction",
        image: "https://i.ibb.co/5Y3m33n/test.png",
        order_id: order.id,
        handler: async function(response) {
          const body = {...response};
          const validateResponse = await fetch('http://localhost:9000/validate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
          });

          const jsonResponse = await validateResponse.json();
          console.log('jsonResponse', jsonResponse);
        },
        prefill: {
          name: "manish",
          email: "manish@example.com",
          contact: "9000000000",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };

      var rzp1 = new Razorpay(option);
      rzp1.on("payment.failed", function(response) {
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
      });

      rzp1.open();
      if (event) event.preventDefault();
    } catch (error) {
      console.error('Payment initialization failed:', error);
      alert('Payment initialization failed. Please try again.');
    }
  };

  return (
    <>
      <div className='product'>
       
        <button className='button' onClick={paymentHandler}>Pay Now</button>
      </div>
    </>
  );
}

export default App;
