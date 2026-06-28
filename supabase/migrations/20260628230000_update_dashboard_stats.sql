CREATE OR REPLACE FUNCTION get_admin_dashboard_stats()
RETURNS JSON AS $$
DECLARE
  v_total_bookings INT;
  v_today_bookings INT;
  v_upcoming_bookings INT;
  v_total_clients INT;
  v_result JSON;
BEGIN
  -- 1. Total bookings (excluding Cancelled & deleted ones)
  SELECT COUNT(*) INTO v_total_bookings
  FROM bookings
  WHERE deleted_at IS NULL
    AND booking_status != 'Cancelled';

  -- 2. Today's bookings (excluding Cancelled & deleted ones)
  SELECT COUNT(*) INTO v_today_bookings
  FROM bookings
  WHERE consultation_date = CURRENT_DATE
    AND deleted_at IS NULL
    AND booking_status != 'Cancelled';

  -- 3. Upcoming bookings (excluding Cancelled, Completed & deleted ones)
  SELECT COUNT(*) INTO v_upcoming_bookings
  FROM bookings
  WHERE consultation_date >= CURRENT_DATE
    AND deleted_at IS NULL
    AND booking_status NOT IN ('Cancelled', 'Completed');

  -- 4. Total clients (excluding Cancelled & deleted ones)
  SELECT COUNT(DISTINCT client_email) INTO v_total_clients
  FROM bookings
  WHERE deleted_at IS NULL
    AND booking_status != 'Cancelled';

  -- Construct JSON response
  v_result := json_build_object(
    'total_bookings', v_total_bookings,
    'today_bookings', v_today_bookings,
    'upcoming_bookings', v_upcoming_bookings,
    'total_clients', v_total_clients
  );

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
