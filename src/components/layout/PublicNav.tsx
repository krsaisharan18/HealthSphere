import { Link } from "@tanstack/react-router";
import { HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";

export function PublicNav() {
  const { user } = useApp();
  return (
    <header className="sticky top-0 z-30 glass border-b border-border">
      <div className="max-w-7xl mx-auto flex items-center h-16 px-4 lg:px-8 gap-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}>
            <HeartPulse className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold tracking-tight">Health Sphere</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <Link to="/about" className="hover:text-foreground">About</Link>
          <Link to="/contact" className="hover:text-foreground">Contact</Link>
          <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
          <Link to="/terms" className="hover:text-foreground">Terms</Link>
        </nav>
        <div className="flex-1" />
        {user ? (
          <Link to="/dashboard"><Button>Open Dashboard</Button></Link>
        ) : (
          <>
            <Link to="/login" className="hidden sm:block"><Button variant="ghost">Sign in</Button></Link>
            <Link to="/signup"><Button>Get Started</Button></Link>
          </>
        )}
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-card mt-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
              <HeartPulse className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold">Health Sphere</span>
          </div>
          <p className="text-sm text-muted-foreground">Your personal premium health operating system. Track, learn, thrive.</p>
        </div>
        <div>
          <div className="font-semibold mb-2 text-sm">Product</div>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li><Link to="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
            <li><Link to="/assistant" className="hover:text-foreground">AI Assistant</Link></li>
            <li><Link to="/goals" className="hover:text-foreground">Goals</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2 text-sm">Company</div>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2 text-sm">Legal</div>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li><Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-foreground">Terms & Conditions</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} Health Sphere. All rights reserved.</div>
    </footer>
  );
}