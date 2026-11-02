import logoIcon from "@/assets/logo-icon.png";
import { CONTACT, NAV_LINKS } from "@/lib/site-data";
import { ChevronRight, Menu, Search, ShoppingCart, X } from "lucide-react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

function isActive(pathname: string, to: string) {
  return to === "/" ? pathname === "/" : pathname.startsWith(to);
}

export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close transient panels whenever navigation happens.
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setCartOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  const submitSearch = () => {
    const q = query.trim();
    setSearchOpen(false);
    setQuery("");
    navigate({ to: "/gallery", search: q ? { q } : {} });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 shadow-[0_1px_10px_rgba(0,0,0,0.04)] backdrop-blur supports-[backdrop-filter]:bg-background/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-3 sm:gap-4 sm:px-6">
        {/* Logo */}
        <Link
          to="/"
          className="flex min-w-0 shrink-0 items-center gap-1.5 sm:gap-2"
          aria-label="Mzansi Jungle Gyms home"
        >
          <img
            src={logoIcon}
            alt=""
            width={44}
            height={44}
            className="h-10 w-10 shrink-0 object-contain sm:h-11 sm:w-11"
          />
          <span className="flex min-w-0 flex-col leading-none">
            <span className="text-lg font-bold tracking-tight sm:text-2xl">
              <span className="text-wood">Mzansi</span>
            </span>
            <span className="mt-0.5 text-[0.55rem] font-semibold uppercase tracking-[0.35em] text-foreground/70">
              Jungle Gyms
            </span>
          </span>
        </Link>

        {/* Centre navigation */}
        <nav aria-label="Main" className="hidden flex-1 items-center justify-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = isActive(pathname, link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`-mb-2 border-b-2 pb-1 text-sm font-medium transition-colors ${
                  active
                    ? "border-primary font-semibold text-primary"
                    : "border-transparent text-foreground hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex shrink-0 items-center gap-0.5 sm:gap-2">
          {/* Search */}
          <div className="relative flex items-center">
            <button
              type="button"
              aria-label="Search"
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen((v) => !v)}
              className="rounded-full p-2 text-foreground/80 transition-colors hover:bg-accent hover:text-primary"
            >
              <Search size={20} />
            </button>
            {searchOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-border bg-popover p-2 shadow-lg">
                <input
                  ref={searchInputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitSearch()}
                  type="search"
                  placeholder="Search the gallery…"
                  aria-label="Search the gallery"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            )}
          </div>

          {/* Cart */}
          <div className="relative flex items-center">
            <button
              type="button"
              aria-label="Shopping cart"
              aria-expanded={cartOpen}
              onClick={() => setCartOpen((v) => !v)}
              className="rounded-full p-2 text-foreground/80 transition-colors hover:bg-accent hover:text-primary"
            >
              <ShoppingCart size={20} />
            </button>
            {cartOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-popover p-4 text-center shadow-lg">
                <p className="text-sm font-semibold text-foreground">Your cart is empty</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Browse our jungle gyms to get started.
                </p>
                <Link
                  to="/jungle-gyms"
                  className="mt-3 inline-block rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Browse Jungle Gyms
                </Link>
              </div>
            )}
          </div>

          {/* Get a Quote */}
          <Link
            to="/quote"
            className="hidden min-[360px]:inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-2 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-md sm:gap-1.5 sm:px-4 sm:text-sm md:px-5"
          >
            <span className="sm:hidden">Quote</span>
            <span className="hidden sm:inline">Get a Quote</span>
            <ChevronRight size={14} className="sm:h-4 sm:w-4" />
          </Link>

          {/* Mobile menu toggle */}
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-full p-2 text-foreground transition-colors hover:bg-accent lg:hidden"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav
          aria-label="Mobile"
          className="border-t border-border bg-background px-4 pb-4 pt-2 lg:hidden"
        >
          {NAV_LINKS.map((link) => {
            const active = isActive(pathname, link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-accent font-semibold text-primary"
                    : "text-foreground hover:bg-accent"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            to="/quote"
            search={{}}
            className="mt-2 flex items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Get a Quote
            <ChevronRight size={16} />
          </Link>
          <a
            href={CONTACT.phoneHref}
            className="mt-1 block rounded-lg px-3 py-2.5 text-center text-sm font-medium text-primary"
          >
            {CONTACT.phoneDisplay}
          </a>
        </nav>
      )}
    </header>
  );
}
