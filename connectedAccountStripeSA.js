
"use server"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


export async function arePayoutsEnabled() {
    const cookieStore = cookies();
const supabase = createServerComponentClient({ cookies: () => cookieStore });

    const {
        data: { session },
      } = await supabase.auth.getSession();
      const user = session?.user;
      const { data: connectedAccountId, error } = await supabase
        .from("stripe")
        .select("account_id")
        .eq("user_id", user.id);
      if (error) {
        console.error("Error fetching stripe connected account Id");
      }
      const usersConnectedAccount = connectedAccountId[0]?.account_id;
      const account = await stripe.accounts.retrieve(usersConnectedAccount);
      const arePayoutsEnabledVar = await account.payouts_enabled;
      console.log("arePayoutsEnabledVar", arePayoutsEnabledVar)

        return arePayoutsEnabledVar;
}

