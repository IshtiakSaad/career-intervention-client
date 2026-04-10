export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Basic dashboard wrapper */}
      <main className="p-4 sm:p-6 lg:p-8 uppercase">
        {children}
      </main>
    </div>
  );
}
