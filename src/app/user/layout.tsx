import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { UserNav } from "@/components/layout/user-nav";

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <UserNav />
      <main className="md:ml-64 pb-20 md:pb-8 pt-4 px-4 max-w-5xl mx-auto">
        {children}
      </main>
    </div>
  );
}
