import BaseDashboardLayout from "@/components/layout/BaseDashboardLayout";

export default function DashboardLayout({
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
