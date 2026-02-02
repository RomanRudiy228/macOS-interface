import { createClient } from "@/supabase/server";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: todos } = await supabase.from("todos").select();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">macOS Interface</h1>
        <p className="text-center text-muted-foreground">
          Next.js + TypeScript + Tailwind CSS + shadcn/ui
        </p>
      </div>
    </main>
  );
}
