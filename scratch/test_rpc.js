import { createClient } from '@supabase/supabase-js';

const url = 'https://opwcvfvtelxytbybbxxa.supabase.co';
const key = 'sb_publishable_VqPJxoI8j1GrI0UTtLthMw_Dzb7wAXe';

const supabase = createClient(url, key);

async function test() {
  console.log('Testing active sessions...');
  const { data: sessions, error: sessionErr } = await supabase
    .from('sessions')
    .select('*')
    .eq('status', 'OPEN');
  
  console.log('Open Sessions:', sessions, 'Error:', sessionErr);

  if (sessions && sessions.length > 0) {
    const targetSession = sessions[0];
    console.log('Testing submit_attendance for session:', targetSession.id);
    
    const testName = 'Test User ' + Math.floor(Math.random() * 1000);
    const { data: rpcRes, error: rpcErr } = await supabase.rpc('submit_attendance', {
      p_session_id: targetSession.id,
      p_name: testName,
      p_class_name: 'Kelas 7',
      p_gender: 'MALE'
    });
    
    console.log('RPC Result:', rpcRes);
    console.log('RPC Error:', rpcErr);
  } else {
    console.log('No open session found! Testing with dummy UUID...');
    const { data: rpcRes, error: rpcErr } = await supabase.rpc('submit_attendance', {
      p_session_id: '00000000-0000-0000-0000-000000000000',
      p_name: 'Test User',
      p_class_name: 'Kelas 7',
      p_gender: 'MALE'
    });
    console.log('RPC Result:', rpcRes);
    console.log('RPC Error:', rpcErr);
  }
}

test();
