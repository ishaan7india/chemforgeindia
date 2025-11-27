import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { FlaskConical, Atom, Zap, Beaker, ChevronRight, Sparkles } from 'lucide-react';

export default function Index() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);
  
  return (
    <div className="min-h-screen bg-background bg-grid relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[128px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px]" />
      
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="container min-h-screen flex flex-col">
          {/* Navigation */}
          <nav className="flex items-center justify-between py-6">
            <div className="flex items-center gap-2">
              <div className="relative">
                <FlaskConical className="w-8 h-8 text-primary" />
                <Atom className="w-4 h-4 text-secondary absolute -top-1 -right-1 animate-float" />
              </div>
              <span className="text-2xl font-display font-bold text-gradient">ChemForge</span>
            </div>
            <Link to="/auth">
              <Button variant="outline">Sign In</Button>
            </Link>
          </nav>
          
          {/* Hero Content */}
          <div className="flex-1 flex items-center justify-center py-20">
            <div className="text-center max-w-4xl mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50 text-sm mb-8">
                  <Sparkles className="w-4 h-4 text-secondary" />
                  <span className="text-muted-foreground">Interactive Chemistry Simulator</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
                  <span className="text-foreground">Simulate </span>
                  <span className="text-gradient neon-text">Chemical</span>
                  <br />
                  <span className="text-foreground">Reactions in </span>
                  <span className="text-secondary neon-green-text">Real-Time</span>
                </h1>
                
                <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
                  Enter reactants, calculate stoichiometry, identify limiting reagents, 
                  and visualize reaction progress with our advanced chemistry simulation platform.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/auth">
                    <Button variant="glow" size="xl" className="gap-2 group">
                      Start Simulating
                      <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button variant="glass" size="xl">
                      View Demo
                    </Button>
                  </Link>
                </div>
              </motion.div>
              
              {/* Feature Cards */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="grid md:grid-cols-3 gap-6 mt-24"
              >
                <div className="glass-card p-6 text-left hover:scale-105 transition-transform">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                    <Beaker className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-2">20+ Reactions</h3>
                  <p className="text-sm text-muted-foreground">
                    Curated database of common chemical reactions including neutralization, 
                    precipitation, and redox reactions.
                  </p>
                </div>
                
                <div className="glass-card p-6 text-left hover:scale-105 transition-transform">
                  <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-2">Live Calculations</h3>
                  <p className="text-sm text-muted-foreground">
                    Real-time stoichiometry calculations with step-by-step explanations 
                    and theoretical yield predictions.
                  </p>
                </div>
                
                <div className="glass-card p-6 text-left hover:scale-105 transition-transform">
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4">
                    <Atom className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-2">Visual Animation</h3>
                  <p className="text-sm text-muted-foreground">
                    Watch reactions unfold with animated beaker visualizations and 
                    dynamic progress indicators.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Footer */}
          <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border/50">
            <p>© 2024 ChemForge. Built for chemistry enthusiasts.</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
