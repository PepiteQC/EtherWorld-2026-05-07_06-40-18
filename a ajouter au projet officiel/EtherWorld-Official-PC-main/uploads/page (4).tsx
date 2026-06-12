import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import GameClient from "@/components/game/GameClient"

export const metadata = {
  title: "EtherWorld — Route 138",
  description: "Conduis sur la Route 138 jusqu'a EtherWorld City",
}

export default async function GamePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <main className="h-screen w-full overflow-hidden bg-black">
      <GameClient />
    </main>
  )
}
