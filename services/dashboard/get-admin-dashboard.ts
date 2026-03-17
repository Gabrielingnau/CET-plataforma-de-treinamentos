import { supabase } from "@/lib/supabase/client"
import { AdminDashboardStats } from "@/types/dashboard/admin-dashboard"

export async function getAdminDashboard(): Promise<AdminDashboardStats> {
  const { count: totalUsers } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
  const { count: totalCompanies } = await supabase
    .from("empresas")
    .select("*", { count: "exact", head: true })
  const { count: totalTrainings } = await supabase
    .from("treinamentos")
    .select("*", { count: "exact", head: true })
  const { count: totalCertificates } = await supabase
    .from("certificates")
    .select("*", { count: "exact", head: true })

  return {
    totalUsers: totalUsers || 0,
    totalCompanies: totalCompanies || 0,
    totalTrainings: totalTrainings || 0,
    totalCertificates: totalCertificates || 0,
    recentActivities: [],
  }
}
