"use server"
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'


const stripe = require('stripe')('sk_test_MYSTRIPEKEYISHERE')

export async function isUserSubscribed() {

    const cookieStore = cookies()
    const supabase = createServerComponentClient({cookies: () => cookieStore})
    const { data: {session}} = await supabase.auth.getSession()
    const user = session?.user

    if (!user) {
        console.error("Aint no way, aint no fucking way, 808s...")
        return
    }

    const { data, error } = await supabase
        .from("stripe")
        .select("isSubscribed")
        .eq("user_id", user.id)

        if( error) {
            console.error("Error getting checkout session data", error)
            return
        }

        const isSubscribed = data[0].isSubscribed

        if (isSubscribed) {
            return true
        } else {

            const { subscriptionId, error } = await supabase
            .from("stripe")
            .select("subscription_id")
            .eq("user_id", user.id)

            if( error) {
                console.error("Error getting checkout session data", error)
                return
            }

            console.log("get sub_ID:", subscriptionId)

            // TODO: set subscription functionality...
// const subscription = await stripe.subscriptions.retrieve(
//   'sub_1MowQVLkdIwHu7ixeRlqHVzs'
// );

            // check customer subscription.... get sub_ID
            //  retrieve subscription
            //  see IF  there's  a complete
            // not open subscription set isSubscribed to TRUE
            //  if open subscription set isSubscribed to False
            //  set this in the database

            //  the return false is just to have an example before adding the functionality
            return false
        }

}
