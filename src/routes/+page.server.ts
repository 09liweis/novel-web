
import { supabase } from "$lib/supabaseClient";

export async function load() {
  const { data } = await supabase.from("novels").select();
  return {
    novels: data ?? [],
  };
}
