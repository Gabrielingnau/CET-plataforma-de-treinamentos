import { StudentDashboardStats } from "@/types/dashboard/student-dashboard"

export async function getStudentDashboard(
  _userId: string
): Promise<StudentDashboardStats> {
  // TODO: implement logic for student dashboard
  return {
    myTrainings: 0,
    completedLessons: 0,
    certificatesEarned: 0,
    progressPercentage: 0,
  }
}
