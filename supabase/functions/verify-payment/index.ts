import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function verifySignature(orderId: string, paymentId: string, signature: string, secret: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(`${orderId}|${paymentId}`);

  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    messageData
  );

  const signatureArray = Array.from(new Uint8Array(signatureBuffer));
  const signatureHex = signatureArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return signatureHex === signature;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { booking_data, payment_data } = await req.json();

    if (!booking_data || !payment_data) {
      return new Response(
        JSON.stringify({ error: 'Missing booking or payment data payload.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
    if (!keySecret) {
      return new Response(
        JSON.stringify({ error: 'Razorpay secret key not configured in Edge Function secrets.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 1. Verify payment signature
    const isValid = await verifySignature(
      payment_data.razorpay_order_id,
      payment_data.razorpay_payment_id,
      payment_data.razorpay_signature,
      keySecret
    );

    if (!isValid) {
      return new Response(
        JSON.stringify({ error: 'Payment verification failed. Invalid signature.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Insert records inside a single transaction via stored procedure create_booking_transaction
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: txResult, error: txErr } = await supabase.rpc('create_booking_transaction', {
      p_client_name: booking_data.client_name,
      p_client_email: booking_data.client_email,
      p_client_phone: booking_data.client_phone,
      p_service_id: booking_data.service_id,
      p_service_package_id: booking_data.service_package_id,
      p_consultation_date: booking_data.consultation_date,
      p_slot_type: booking_data.slot_type,
      p_time_label: booking_data.time_label,
      p_birth_date: booking_data.birth_date,
      p_birth_time: booking_data.birth_time,
      p_birth_place: booking_data.birth_place,
      p_gender: booking_data.gender || 'Male',
      p_notes: booking_data.notes || '',
      p_razorpay_payment_id: payment_data.razorpay_payment_id,
      p_razorpay_order_id: payment_data.razorpay_order_id,
      p_razorpay_signature: payment_data.razorpay_signature,
      p_amount: booking_data.amount,
      p_currency: booking_data.currency || 'INR'
    });

    if (txErr || !txResult) {
      console.error('Database transaction failed:', txErr);
      return new Response(
        JSON.stringify({ error: txErr?.message || 'Database transaction insert failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        booking_id: txResult.booking_id,
        booking_number: txResult.booking_number
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
