import { Menu, X, BarChart3, FileText, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  userRole?: string | null;
  onLogout?: () => void;
}

export function Header({ currentPage, onNavigate, userRole, onLogout }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Navigation items based on user role
  const getNavItems = () => {
    if (userRole === "admin") {
      return [
        { name: "Dashboard", id: "dashboard" },
        { name: "Leads", id: "leads" },
      ];
    }
    
    // Regular user navigation
    return [
      { name: "Inicio", id: "home" },
      { name: "Servicios", id: "services" },
      { name: "Contacto", id: "contact" },
    ];
  };

  const navItems = getNavItems();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo/Brand */}
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <h3 className="text-white">
              {userRole === "admin" ? (
                <span className="flex items-center space-x-2">
                  <BarChart3 className="text-accent" size={20} />
                  <span className="text-accent">HHBC</span>
                  <span className="text-sm text-gray-300">Admin</span>
                </span>
              ) : (
                <>
                  <span className="text-accent">HHBC</span> Consulting Group
                </>
              )}
            </h3>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative transition-all duration-200 text-white hover:text-accent group ${
                  currentPage === item.id 
                    ? "text-accent font-semibold" 
                    : "hover:font-medium"
                }`}
              >
                {item.name}
                <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-accent transform transition-transform duration-200 ${
                  currentPage === item.id ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`}></span>
              </button>
            ))}
            
            {/* Show different buttons based on user role */}
            {userRole === "admin" ? (
              <Button
                onClick={onLogout}
                className="bg-red-600 hover:bg-red-700 text-white flex items-center space-x-2 px-4 py-2 rounded-md transition-colors duration-200"
              >
                <LogOut size={16} />
                <span>Cerrar Sesión</span>
              </Button>
            ) : (
              <Button
                onClick={() => onNavigate("login")}
                className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-md transition-colors duration-200"
              >
                Portal Admin
              </Button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 space-y-4 border-t border-gray-800">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left py-3 px-4 rounded-md transition-all duration-200 text-white hover:text-accent hover:bg-gray-800 ${
                  currentPage === item.id 
                    ? "text-accent bg-gray-800 font-semibold" 
                    : ""
                }`}
              >
                {item.name}
              </button>
            ))}
            
            {/* Show different buttons based on user role for mobile */}
            {userRole === "admin" ? (
              <Button
                onClick={() => {
                  onLogout?.();
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center space-x-2 py-3"
              >
                <LogOut size={16} />
                <span>Cerrar Sesión</span>
              </Button>
            ) : (
              <Button
                onClick={() => {
                  onNavigate("login");
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-accent hover:bg-accent/90 text-white py-3"
              >
                Portal Admin
              </Button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}