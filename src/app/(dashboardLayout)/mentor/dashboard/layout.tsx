import BaseDashboardLayout from "@/components/layout/BaseDashboardLayout";

export default function MentorDashboardLayout({
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
