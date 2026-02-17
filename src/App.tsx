import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { HomePage } from "./components/HomePage";
import { ServicesPage } from "./components/ServicesPage";
import { ContactPage } from "./components/ContactPage";
import { ContactPageEnhanced } from "./components/ContactPageEnhanced";
import { LoginPage } from "./components/LoginPage";
import { AdminLoginPage } from "./components/AdminLoginPage";
import { Dashboard } from "./components/Dashboard";
import { LeadsList } from "./components/LeadsList";
import { ButtonTestPage } from "./components/ButtonTestPage";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [serviceId, setServiceId] = useState<string | undefined>(undefined);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Handle URL-based routing for /admin
  useEffect(() => {
    const path = window.location.pathname;
    if (path === "/admin") {
      setCurrentPage("login");
    }
  }, []);

  // Handle hash-based navigation for services
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash === "legal" || hash === "it" || hash === "accounting") {
        setServiceId(hash);
        setCurrentPage("services");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange(); // Check initial hash

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Check user role on component mount
  useEffect(() => {
    const role = localStorage.getItem("user_role");
    setUserRole(role);
  }, []);

  const handleLoginSuccess = () => {
    const role = localStorage.getItem("user_role");
    console.log('🎯 Login success handler called, role:', role);
    setUserRole(role);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("user_role");
    setUserRole(null);
    setCurrentPage("home");
  };

  const handleNavigate = (page: string, newServiceId?: string) => {
    console.log('🧭 Navigating to:', page, 'Current userRole:', userRole);

    // Special handling for admin pages
    if ((page === "metrics" || page === "button-test") && userRole !== "admin") {
      console.log('🔒 Admin access required, redirecting to login');
      setCurrentPage("login");
    } else {
      setCurrentPage(page);
    }

    if (newServiceId) {
      setServiceId(newServiceId);
      window.location.hash = newServiceId;
    } else if (page !== "services") {
      setServiceId(undefined);
      window.location.hash = "";
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={handleNavigate} />;
      case "services":
        return <ServicesPage serviceId={serviceId} onNavigate={handleNavigate} />;
      case "contact":
        return <ContactPageEnhanced />; // Use enhanced version with backend integration
      case "login":
        return <AdminLoginPage onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate} />;
      case "dashboard":
        return userRole === "admin" ? (
          <Dashboard onNavigate={handleNavigate} />
        ) : (
          <AdminLoginPage onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate} />
        );
      case "leads":
        return userRole === "admin" ? (
          <LeadsList onNavigate={handleNavigate} />
        ) : (
          <AdminLoginPage onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate} />
        );
      case "metrics":
        return userRole === "admin" ? (
          <MetricsDashboardSimple />
        ) : (
          <AdminLoginPage onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate} />
        );
      case "button-test":
        return userRole === "admin" ? (
          <ButtonTestPage />
        ) : (
          <AdminLoginPage onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate} />
        );
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        userRole={userRole}
        onLogout={handleLogout}
      />
      <main className="flex-grow">{renderPage()}</main>
      <Footer />
      <Toaster />
    </div>
  );
}