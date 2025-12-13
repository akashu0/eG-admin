// app/admin/layout.tsx

import Header from "../components/Resusable/Header";
import Sidebar from "../components/Resusable/Sidebar";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Fixed Header */}
        {/* <Header /> */}

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto bg-white">
          <div className="mx-auto max-w-7xl px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}