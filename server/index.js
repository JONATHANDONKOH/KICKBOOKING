require('dotenv').config();

// 1-4: Express and dependencies import
const express = require('express');
const axios = require('axios');
const qs = require('qs');
const { createClient } = require('@supabase/supabase-js');

// 6-8: Express app setup
const app = express();
app.use(express.json());

// 10: Supabase setup using environment variables
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// 12-17: ExpressPay config
const EXPRESSPAY_API_URL = 'https://sandbox.expresspaygh.com/api';
const EXPRESSPAY_MERCHANT_ID = 'demo';
const EXPRESSPAY_API_KEY = 'demo';
const EXPRESSPAY_PAYMENT_ENDPOINT = `${EXPRESSPAY_API_URL}/submit.php`;
const EXPRESSPAY_STATUS_ENDPOINT = `${EXPRESSPAY_API_URL}/query.php`;

// 19: POST /pay
app.post('/pay', async (req, res) => {
  const { amount, currency, customer_name, customer_email, order_id, description, user_id } = req.body;
  try {
    const payload = {
      merchant_id: EXPRESSPAY_MERCHANT_ID,
      api_key: EXPRESSPAY_API_KEY,
      amount,
      currency: currency || 'GHS',
      order_id,
      description: description || 'KickBooking Payment',
      customer_name,
      customer_email,
      redirect_url: 'http://localhost:3000/thankyou',
      cancel_url: 'http://localhost:3000/cancel',
    };

    const response = await axios.post(EXPRESSPAY_PAYMENT_ENDPOINT, qs.stringify(payload));
    const { token } = response.data;
    if (!token) throw new Error('No token received from ExpressPay');

    // Log transaction to Supabase
    await supabase.from('payments').insert([
      { user_id, order_id, amount, status: 'Pending', token, customer_email, customer_name }
    ]);

    // Send checkout URL to frontend
    res.json({ checkout_url: `https://sandbox.expresspaygh.com/api/checkout.php?token=${token}` });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Payment initiation failed' });
  }
});

// 44: GET /thankyou
app.get('/thankyou', async (req, res) => {
  const { order_id, token } = req.query;
  try {
    const statusRes = await axios.post(EXPRESSPAY_STATUS_ENDPOINT, qs.stringify({
      merchant_id: EXPRESSPAY_MERCHANT_ID,
      api_key: EXPRESSPAY_API_KEY,
      token,
    }));
    const { status } = statusRes.data;

    await supabase.from('payments').update({ status }).eq('order_id', order_id);
    res.send(`<h2>Thank you for your payment!</h2><p>Status: ${status}</p>`);
  } catch (error) {
    res.status(500).send('Could not verify payment.');
  }
});

// 59: POST /postback
app.post('/postback', async (req, res) => {
  const { order_id, token } = req.body;
  try {
    const statusRes = await axios.post(EXPRESSPAY_STATUS_ENDPOINT, qs.stringify({
      merchant_id: EXPRESSPAY_MERCHANT_ID,
      api_key: EXPRESSPAY_API_KEY,
      token,
    }));
    const { status } = statusRes.data;

    await supabase.from('payments').update({ status }).eq('order_id', order_id);
    res.status(200).json({ message: 'OK' });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Postback failed' });
  }
});

// 74: Server listen
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
