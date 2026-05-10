import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { Sidebar } from './Sidebar';

export function AppShell() {
  return (
    <div className="md:flex md:max-w-desktop md:mx-auto min-h-screen bg-app-bg-primary">
      <Sidebar />
      <div className="flex-1 min-w-0 max-w-app md:max-w-none mx-auto md:mx-0 w-full">
        <Header />
        <main className="pb-16 md:pb-8">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
