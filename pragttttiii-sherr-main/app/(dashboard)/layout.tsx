import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col infra-bg-atmosphere relative overflow-x-hidden">
      {/* Low-opacity technical grid & geographic network motif overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.035] infra-grid-pattern" 
        aria-hidden="true" 
      />
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.02] infra-contour-bg" aria-hidden="true" />
      
      <Sidebar />
      
      <div className="lg:pl-64 flex flex-col flex-1 relative z-10">
        <Topbar />
        
        <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}

