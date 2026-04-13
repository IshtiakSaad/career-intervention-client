import BaseDashboardLayout from "@/components/layout/BaseDashboardLayout";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BaseDashboardLayout>
      {children}
    </BaseDashboardLayout>
  );
}
