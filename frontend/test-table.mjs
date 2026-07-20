import { createClient } from "@supabase/supabase-js";
const supabase = createClient("https://txcpkpzrtvggmurlygwv.supabase.co", "sb_publishable_dijFvEaOMASCpWXwvuDj2w_9cKfizM2");
async function test() {
  const { error } = await supabase.from("group_members").select("id, group_id, user_id").limit(1);
  console.log(error);
}
test();
