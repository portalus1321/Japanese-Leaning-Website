
import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = 'https://iimyvjgihsdkdklepmns.supabase.co'
const supkey  = process.env.REACT_APP_SUPABASE_API_URL
export const supabaseKey = supkey;
export const supabase = createClient(supabaseUrl, supabaseKey);


// export const supabase = createClient(supabaseUrl, supabaseKey)


export async function fetchUserId() {
      const { data: User, error } = await supabase
    .from('User')
    .select('id');

  if (error) {
        console.error('Error fetching User data:', error.message);
        return;
      }
    
      console.log('Fetched User data:', User);
    }
    
    
    // const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
    // const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;


