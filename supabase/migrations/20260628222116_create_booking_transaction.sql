CREATE OR REPLACE FUNCTION create_booking_transaction(
  p_client_name TEXT,
  p_client_email TEXT,
  p_client_phone TEXT,
  p_service_id UUID,
  p_service_package_id UUID,
  p_consultation_date DATE,
  p_slot_type TEXT,
  p_time_label TEXT,
  p_birth_date DATE,
  p_birth_time TIME,
  p_birth_place TEXT,
  p_gender TEXT,
  p_notes TEXT,
  p_razorpay_payment_id TEXT,
  p_razorpay_order_id TEXT,
  p_razorpay_signature TEXT,
  p_amount NUMERIC,
  p_currency TEXT
) RETURNS JSON AS $$
DECLARE
  v_booking_id UUID;
  v_booking_number TEXT;
  v_result JSON;
BEGIN
  -- Insert into bookings
  INSERT INTO bookings (
    client_name,
    client_email,
    client_phone,
    service_id,
    service_package_id,
    consultation_date,
    slot_type,
    time_label,
    booking_status,
    payment_status
  ) VALUES (
    p_client_name,
    p_client_email,
    p_client_phone,
    p_service_id,
    p_service_package_id,
    p_consultation_date,
    p_slot_type,
    p_time_label,
    'Confirmed',
    'Paid'
  ) RETURNING id, booking_number INTO v_booking_id, v_booking_number;

  -- Insert into booking_details
  INSERT INTO booking_details (
    booking_id,
    birth_date,
    birth_time,
    birth_place,
    gender,
    notes
  ) VALUES (
    v_booking_id,
    p_birth_date,
    p_birth_time,
    p_birth_place,
    p_gender,
    p_notes
  );

  -- Insert into payments
  INSERT INTO payments (
    booking_id,
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    amount,
    currency,
    payment_status,
    payment_method
  ) VALUES (
    v_booking_id,
    p_razorpay_payment_id,
    p_razorpay_order_id,
    p_razorpay_signature,
    p_amount,
    p_currency,
    'Paid',
    'Razorpay Online'
  );

  -- Construct result JSON
  v_result := json_build_object(
    'booking_id', v_booking_id,
    'booking_number', v_booking_number
  );

  RETURN v_result;
EXCEPTION WHEN OTHERS THEN
  RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
