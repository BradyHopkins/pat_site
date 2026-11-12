// js/supabase-client.js
// Single source of truth for the Supabase connection.
// Uses the Supabase CDN script (loaded in each HTML page) so the site
// runs as plain static files with no build step required.

const supabaseUrl = 'https://otmnpalhsquzuemlmejv.supabase.co';
const supabaseAnonKey = 'sb_publishable_RH8POuYAI4EKJlcAfkS7VA_9K1298Qg';

const { createClient } = window.supabase;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Insert contact form submission
export async function submitContact({ name, email, message }) {
  try {
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([{ name, email, message }]);

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error submitting contact:', error.message);
    return { success: false, error: error.message };
  }
}

// Get current user
export async function getCurrentUser() {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  } catch (error) {
    console.error('Error getting current user:', error.message);
    return null;
  }
}

// Logout user
export async function logoutUser() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error logging out:', error.message);
    return { success: false, error: error.message };
  }
}
