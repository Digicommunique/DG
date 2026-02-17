
import React from 'react';
import { Role } from '../types';
import { LayoutDashboard, Truck, ShieldCheck, Power, Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeRole: Role;
  setRole: (role: Role) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeRole, setRole }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const NavItem = ({ role, icon: Icon, label }: { role: Role, icon: any, label: string }) => (
    <button
      onClick={() => { setRole(role); setIsMenuOpen(false); }}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
        activeRole === role 
          ? 'bg-amber-500 text-white' 
          : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      <Icon size={18} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-amber-500 p-2 rounded-lg shadow-sm">
              <Power className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">PowerFlow</span>
          </div>

          <nav className="hidden md:flex items-center space-x-4">
            <NavItem role={Role.CUSTOMER} icon={LayoutDashboard} label="Customer App" />
            <NavItem role={Role.OPERATOR} icon={Truck} label="Operator App" />
            <NavItem role={Role.ADMIN} icon={ShieldCheck} label="Admin Console" />
          </nav>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-slate-600">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden p-4 bg-white border-b border-slate-200 space-y-2 animate-in slide-in-from-top duration-200">
            <NavItem role={Role.CUSTOMER} icon={LayoutDashboard} label="Customer" />
            <NavItem role={Role.OPERATOR} icon={Truck} label="Operator" />
            <NavItem role={Role.ADMIN} icon={ShieldCheck} label="Admin" />
          </div>
        )}
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6">
        {children}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm">
            © 2024 PowerFlow Digital Marketplace. DG-as-a-Service Platform.
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Service Terms</a>
            <a href="#" className="hover:text-white">Compliance</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
