// supabase/functions/sync-google-sheets/index.ts
//
// Supabase Edge Function: Google Sheets Sync
//
// This function syncs attendance data from Supabase to Google Sheets.
// It is triggered after a successful attendance submission.
//
// SETUP:
// 1. Create a Google Cloud service account
// 2. Enable the Google Sheets API
// 3. Share your spreadsheet with the service account email
// 4. Store credentials as Supabase secrets:
//    supabase secrets set GOOGLE_SERVICE_ACCOUNT_EMAIL=...
//    supabase secrets set GOOGLE_PRIVATE_KEY=...
//    supabase secrets set GOOGLE_SPREADSHEET_ID=...
//
// DEPLOYMENT:
// supabase functions deploy sync-google-sheets
//
// USAGE:
// Called from the client after successful attendance submission,
// or triggered via a database webhook/trigger.
//
// Architecture:
//   Teenager → QR → Supabase (primary DB) → This Function → Google Sheets
//   If Google Sheets fails, attendance is already safely saved in Supabase.

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AttendanceRecord {
  name: string;
  class_name: string;
  gender: string;
  created_at: string;
  session_name: string;
  session_date: string;
}

/**
 * Get Google OAuth2 access token using service account credentials.
 */
async function getGoogleAccessToken(email: string, privateKey: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    iss: email,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  }));

  // Sign the JWT with the private key
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'pkcs8',
    pemToBinary(privateKey),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    key,
    encoder.encode(`${header}.${payload}`)
  );
  const jwt = `${header}.${payload}.${btoa(String.fromCharCode(...new Uint8Array(signature)))}`;

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  const data = await response.json();
  return data.access_token;
}

function pemToBinary(pem: string): ArrayBuffer {
  const lines = pem.split('\n').filter(line => !line.startsWith('-----'));
  const base64 = lines.join('');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Append a row to Google Sheets.
 */
async function appendToSheet(
  accessToken: string,
  spreadsheetId: string,
  sheetName: string,
  values: string[][]
) {
  const range = `${sheetName}!A:F`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Google Sheets API error: ${error}`);
  }

  return response.json();
}

/**
 * Ensure a sheet tab exists for the given date.
 * Creates it if it doesn't exist.
 */
async function ensureSheet(
  accessToken: string,
  spreadsheetId: string,
  sheetName: string
) {
  // Get existing sheets
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await response.json();

  const exists = data.sheets?.some(
    (s: any) => s.properties.title === sheetName
  );

  if (!exists) {
    // Create the sheet
    await fetch(`${url}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [{
          addSheet: {
            properties: { title: sheetName },
          },
        }],
      }),
    });

    // Add headers
    await appendToSheet(accessToken, spreadsheetId, sheetName, [
      ['Name', 'Class', 'Gender', 'Time', 'Session', 'Date'],
    ]);
  }
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { attendance_id, session_id } = await req.json();

    // Get secrets
    const serviceAccountEmail = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_EMAIL');
    const privateKey = Deno.env.get('GOOGLE_PRIVATE_KEY');
    const spreadsheetId = Deno.env.get('GOOGLE_SPREADSHEET_ID');

    if (!serviceAccountEmail || !privateKey || !spreadsheetId) {
      return new Response(
        JSON.stringify({
          status: 'SYNC_NOT_CONFIGURED',
          message: 'Google Sheets sync is not configured. Attendance is safely stored in Supabase.',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Create Supabase admin client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch the attendance record
    const { data: record, error: fetchError } = await supabase
      .from('attendance')
      .select('name, class_name, gender, created_at, sessions(name, date)')
      .eq('id', attendance_id)
      .single();

    if (fetchError || !record) {
      throw new Error('Attendance record not found');
    }

    // Format date for sheet tab name (e.g., "12 Sep 2026")
    const sessionDate = new Date(record.sessions.date);
    const sheetName = sessionDate.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    // Format time in Jakarta timezone
    const createdAt = new Date(record.created_at);
    const jakartaTime = createdAt.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Jakarta',
    });

    // Get Google access token
    const accessToken = await getGoogleAccessToken(serviceAccountEmail, privateKey);

    // Ensure sheet tab exists
    await ensureSheet(accessToken, spreadsheetId, sheetName);

    // Append attendance row
    await appendToSheet(accessToken, spreadsheetId, sheetName, [
      [record.name, record.class_name, record.gender, jakartaTime, record.sessions.name, sheetName],
    ]);

    return new Response(
      JSON.stringify({ status: 'SYNCED', sheet: sheetName }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Google Sheets sync error:', error);
    return new Response(
      JSON.stringify({
        status: 'SYNC_ERROR',
        message: 'Google Sheets sync failed. Attendance is safely stored in Supabase.',
        error: error.message,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  }
});
