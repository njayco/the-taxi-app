import { useState, useCallback } from "react";
import { useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { TaxiLogo } from "@/components/TaxiLogo";

export function CompanyNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [, navigate] = useLocation();

  const navLinks = [
    { label: "Features", hash: "features" },
    { label: "Pricing", hash: "pricing" },
    { label: "About Us", hash: "" },
    { label: "Contact", hash: "contact" },
  ];

  const handleNavClick = useCallback((hash: string) => {
    setMobileMenuOpen(false);
    const currentPath = window.location.pathname;
    if (currentPath === "/about-us") {
      if (hash) {
        window.history.replaceState(null, "", `/about-us#${hash}`);
        const el = document.getElementById(hash);
        if (el) { el.scrollIntoView({ behavior: "smooth" }); return; }
      } else {
        window.history.replaceState(null, "", "/about-us");
        window.scrollTo({ top: 0, behavior: "smooth" }); return;
      }
    }
    navigate("/about-us");
    if (hash) {
      setTimeout(() => {
        window.history.replaceState(null, "", `/about-us#${hash}`);
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 150);
    }
  }, [navigate]);

  return (
    <nav
      className="sticky top-0 z-[9999] w-full border-b-4 border-black"
      style={{ backgroundColor: "hsl(50, 100%, 50%)", color: "hsl(0, 0%, 7%)" }}
      data-testid="company-nav"
    >
      <div className="px-4 md:px-8 py-3 md:py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
            <button onClick={() => handleNavClick("")} className="flex items-center gap-3 md:gap-4" data-testid="link-logo">
              <TaxiLogo size="sm" />
              <span className="hidden sm:inline font-black text-sm md:text-base tracking-tight whitespace-nowrap">
                THE TAXI COMPANY
              </span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-4">
              {navLinks.map((link, index) => (
                <div key={link.label} className="flex items-center gap-4">
                  <button
                    onClick={() => handleNavClick(link.hash)}
                    className="font-black text-sm tracking-tight hover:underline active:underline"
                    data-testid={`link-${link.label.toLowerCase().replace(" ", "-")}`}
                  >
                    {link.label}
                  </button>
                  {index < navLinks.length - 1 && (
                    <span className="font-black text-sm">|</span>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => { setMobileMenuOpen(false); navigate("/select"); }}
              className="font-black text-sm tracking-tight px-6 py-2 border-2 border-current hover:bg-black/5 active:bg-black/10 transition-colors whitespace-nowrap"
              data-testid="link-sign-in"
            >
              SIGN IN
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-black/5 active:bg-black/10 transition-colors"
            data-testid="button-mobile-menu-toggle"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div
            className="md:hidden mt-4 pt-4 border-t-2 border-current flex flex-col gap-3"
            data-testid="mobile-menu"
          >
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.hash)}
                className="font-black text-sm tracking-tight py-2 hover:bg-black/5 active:bg-black/10 transition-colors px-2 block text-left"
                data-testid={`mobile-link-${link.label.toLowerCase().replace(" ", "-")}`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => { setMobileMenuOpen(false); navigate("/select"); }}
              className="font-black text-sm tracking-tight px-4 py-3 border-2 border-current hover:bg-black/5 active:bg-black/10 transition-colors block text-center"
              data-testid="mobile-link-sign-in"
            >
              SIGN IN
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
