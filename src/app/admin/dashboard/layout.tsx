import { getCurrentAdmin } from "@/lib/auth";
import DashboardShell from "@/components/DashboardShell";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();

  return <DashboardShell adminNama={admin?.nama || "Admin"}>{children}</DashboardShell>;
}
