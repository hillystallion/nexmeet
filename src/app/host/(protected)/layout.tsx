import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { HostNav } from "@/components/layout/host-nav";

export default async function HostProtectedLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("host-token");
  if (!token) redirect("/host/login");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <HostNav />
      <main className="md:ml-64 pb-20 md:pb-8 pt-4 px-4 max-w-5xl mx-auto">
        {children}
      </main>
    </div>
  );
}
