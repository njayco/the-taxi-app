import { useLocation } from "wouter";
import { useCallback } from "react";

export function CompanyFooter() {
  const [, navigate] = useLocation();

  const footerLinks = [
    { label: "About Us", hash: "" },
    { label: "Features", hash: "features" },
    { label: "Pricing", hash: "pricing" },
    { label: "Contact", hash: "contact" },
  ];

  const handleNavClick = useCallback((hash: string) => {
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
    <footer
      className="w-full border-t-4 border-yellow-400 py-12 md:py-16"
      style={{ backgroundColor: "hsl(0, 0%, 7%)", color: "hsl(0, 0%, 98%)" }}
      data-testid="company-footer"
      id="contact"
    >
      <div className="px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-8">
            READY TO DISPATCH SMARTER?
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6 w-full sm:w-auto sm:justify-center">
            <button
              onClick={() => navigate("/select")}
              className="px-8 md:px-10 py-3 md:py-4 font-black text-sm md:text-base tracking-tight border-2 border-white bg-black text-white hover:bg-white/10 active:bg-white/20 transition-colors whitespace-nowrap"
              data-testid="link-view-live-demo"
            >
              VIEW LIVE DEMO
            </button>
            <a
              href="mailto:info@denoko.com"
              className="px-8 md:px-10 py-3 md:py-4 font-black text-sm md:text-base tracking-tight border-2 border-black whitespace-nowrap text-center"
              style={{ backgroundColor: "hsl(50, 100%, 50%)", color: "hsl(0, 0%, 7%)" }}
              data-testid="link-contact-us"
            >
              CONTACT US
            </a>
          </div>

          <p className="text-sm md:text-base font-medium tracking-tight">
            Email us at{" "}
            <a
              href="mailto:info@denoko.com"
              className="font-black hover:underline active:underline"
              data-testid="link-email"
            >
              info@denoko.com
            </a>
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 py-8 border-t border-white/10 border-b border-b-white/10">
          {footerLinks.map((link, index) => (
            <div key={link.label} className="flex items-center gap-3 md:gap-4">
              <button
                onClick={() => handleNavClick(link.hash)}
                className="font-black text-xs md:text-sm tracking-tight hover:underline active:underline"
                data-testid={`footer-link-${link.label.toLowerCase().replace(" ", "-")}`}
              >
                {link.label}
              </button>
              {index < footerLinks.length - 1 && (
                <span className="font-black text-xs md:text-sm">|</span>
              )}
            </div>
          ))}
        </div>

        <div className="text-center pt-8">
          <p className="text-xs md:text-sm font-medium tracking-wide">
            The Taxi Company (A Denoko Cooperative)
          </p>
        </div>
      </div>
    </footer>
  );
}
