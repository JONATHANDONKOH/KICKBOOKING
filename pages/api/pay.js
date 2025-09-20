import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const {
    total_price,
    booking_date,
    start_time,
    end_time,
    user_id,
    stadium_id,
    transaction_name,
    transaction_number,
  } = req.body;

  if (
    total_price === undefined ||
    booking_date === undefined ||
    start_time === undefined ||
    end_time === undefined ||
    user_id === undefined ||
    stadium_id === undefined ||
    transaction_name === undefined ||
    transaction_number === undefined
  ) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
          total_price,
          booking_date,
          start_time,
          end_time,
          user_id,
          stadium_id,
          transaction_name,
          transaction_number,
          status: 'pending',
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}
