import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { FlaskConical, Atom, LogOut, LayoutDashboard, Beaker } from 'lucide-react';

export function NavBar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  
  return (
    <nav className="border-b border-border/50 bg-background/80 backdrop-blur-lg sticky top-0 z-50">
      <div className="container flex items-center justify-between h-16">
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <div className="relative">
            <FlaskConical className="w-7 h-7 text-primary transition-transform group-hover:scale-110" />
            <Atom className="w-3 h-3 text-secondary absolute -top-0.5 -right-0.5 animate-float" />
          </div>
          <span className="text-xl font-display font-bold text-gradient">ChemForge</span>
        </Link>
        
        {user && (
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Button>
            </Link>
            <Link to="/simulator">
              <Button variant="ghost" size="sm" className="gap-2">
                <Beaker className="w-4 h-4" />
                Simulator
              </Button>
            </Link>
            <div className="h-6 w-px bg-border" />
            <span className="text-sm text-muted-foreground hidden md:block">
              {user.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
