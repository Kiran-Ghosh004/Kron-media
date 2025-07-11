import { createClient } from "@supabase/supabase-js";

const supabaseURL= "https://ldxegmhjavkmvkfdxphf.supabase.co";
const supabaaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
// Ensure the environment variable is defined

export const supabase= createClient(
    supabaseURL, 
    supabaaseAnonKey
)