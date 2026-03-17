import { supabase } from "@/lib/supabase/client"
import { CompanyDashboardStats } from "@/types/dashboard/company-dashboard"

export async function getCompanyDashboard(
  companyId: number
): Promise<CompanyDashboardStats> {
  const { count: totalCollaborators } = await supabase
    .from("colaboradores")
    .select("*", { count: "exact", head: true })
    .eq("empresa_id", companyId)
  const { count: totalTrainings } = await supabase
    .from("treinamentos")
    .select("*", { count: "exact", head: true })
    .eq("empresa_id", companyId)
  // TODO: implement completed and pending trainings

  return {
    totalCollaborators: totalCollaborators || 0,
    totalTrainings: totalTrainings || 0,
    completedTrainings: 0,
    pendingTrainings: 0,
  }
}
