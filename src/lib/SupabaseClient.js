import { createClient } from "@supabase/supabase-js";
import useAuthUser from "@/lib/UseAuthUser";

const supabaseUrl = "https://nxpuhfmpulxvcuhdghqs.supabase.co";
const supabaseAnonKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54cHVoZm1wdWx4dmN1aGRnaHFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzcwNzQzOTIsImV4cCI6MTk5MjY1MDM5Mn0.F9XLYIygJ7rzM528QBmMHEUiDRRtgBnGryacMbB5ORM";
const supabase = createClient(supabaseUrl, supabaseAnonKey);
supabase.auth.onAuthStateChange((event, session) => {
    const { user } = useAuthUser();
    user.value = session?.user || null;
});

export default function useSupabase() {
    return { supabase };
}
