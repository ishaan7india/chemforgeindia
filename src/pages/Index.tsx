import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { FlaskConical, Atom, Zap, Beaker, ChevronRight, Sparkles, Target, BarChart3, ArrowRight } from 'lucide-react';
import chemforgeLogo from '@/assets/chemforge-logo.png';

export default function Index() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const features = [
    {
      icon: Beaker,
      title: 'Interactive Simulations',
      description: 'Watch chemical reactions unfold with real-time animations and microscopic molecular views.',
      gradient: 'from-primary/20 to-cyan-500/20',
    },
    {
      icon: Target,
      title: 'Accurate Stoichiometry',
      description: 'Calculate limiting reagents, theoretical yields, and excess reactants with precision.',
      gradient: 'from-secondary/20 to-emerald-500/20',
    },
    {
      icon: BarChart3,
      title: 'Detailed Analysis',
      description: 'Get step-by-step calculations, balanced equations, and lab observations.',
      gradient: 'from-amber-500/20 to-orange-500/20',
    },
    {
      icon: Zap,
      title: 'Save & Track',
      description: 'Save simulations to your dashboard and access your reaction history anytime.',
      gradient: 'from-purple-500/20 to-pink-500/20',
    },
  ];
  
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-grid opacity-50" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-secondary/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px]" />
      
      <div className="relative z-10">
        {/* Navigation */}
        <motion.nav 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container flex items-center justify-between py-6"
        >
          <Link to="/" className="flex items-center gap-3 group">
            <motion.img 
              src={chemforgeLogo} 
              alt="ChemForge" 
              className="w-12 h-12 object-contain"
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            />
            <span className="text-2xl font-display font-bold text-gradient">ChemForge</span>
          </Link>
          <Link to="/auth">
            <Button variant="glow" size="sm">
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.nav>
        
        {/* Hero Section */}
        <section className="container py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="space-y-8"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 backdrop-blur-sm"
              >
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-sm text-primary font-medium">Next-Gen Chemistry Lab</span>
              </motion.div>
              
              <h1 className="text-5xl lg:text-7xl font-display font-bold leading-[1.1]">
                <span className="text-foreground">Simulate </span>
                <span className="text-gradient neon-text">Chemical</span>
                <br />
                <span className="text-foreground">Reactions </span>
                <span className="text-secondary neon-green-text">Live</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
                Enter reactants, calculate stoichiometry, identify limiting reagents, and watch reactions unfold with stunning visualizations.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/auth">
                  <Button variant="glow" size="xl" className="gap-2 group shadow-lg shadow-primary/25">
                    Start Simulating
                    <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="outline" size="xl" className="backdrop-blur-sm">
                    Sign In
                  </Button>
                </Link>
              </div>
              
              {/* Stats */}
              <div className="flex gap-8 pt-8 border-t border-border/50">
                <div>
                  <div className="text-3xl font-display font-bold text-primary">20+</div>
                  <div className="text-sm text-muted-foreground">Reactions</div>
                </div>
                <div>
                  <div className="text-3xl font-display font-bold text-secondary">100%</div>
                  <div className="text-sm text-muted-foreground">Accurate</div>
                </div>
                <div>
                  <div className="text-3xl font-display font-bold text-amber-400">∞</div>
                  <div className="text-sm text-muted-foreground">Simulations</div>
                </div>
              </div>
            </motion.div>
            
            {/* Hero Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full aspect-square max-w-md mx-auto">
                {/* Glowing backdrop */}
                <div className="absolute inset-0 bg-gradient-radial from-primary/30 via-primary/5 to-transparent blur-2xl" />
                
                {/* Orbital rings */}
                <motion.div 
                  className="absolute inset-4 border-2 border-dashed border-primary/20 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div 
                  className="absolute inset-16 border border-secondary/20 rounded-full"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                />
                
                {/* Orbiting particles */}
                <motion.div
                  className="absolute inset-0"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-primary to-cyan-400 shadow-lg shadow-primary/50" />
                  </div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-secondary to-emerald-400 shadow-lg shadow-secondary/50" />
                  </div>
                </motion.div>
                
                <motion.div
                  className="absolute inset-0"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                >
                  <div className="absolute top-1/2 left-0 -translate-y-1/2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-400/50" />
                  </div>
                  <div className="absolute top-1/2 right-0 -translate-y-1/2">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 shadow-lg shadow-purple-400/50" />
                  </div>
                </motion.div>
                
                {/* Center logo */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ 
                      y: [0, -15, 0],
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150" />
                    <img
                      src={chemforgeLogo}
                      alt="ChemForge"
                      className="w-40 h-40 object-contain relative z-10 drop-shadow-2xl"
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="container py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-4">
              Everything You Need for <span className="text-gradient">Chemistry</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From basic stoichiometry to complex reaction analysis, ChemForge provides the tools you need to excel.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6 group hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-foreground" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="container py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="glass-card p-12 lg:p-16 text-center relative overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10">
                <Atom className="w-24 h-24 text-primary" />
              </div>
              <div className="absolute bottom-10 right-10">
                <FlaskConical className="w-28 h-28 text-secondary" />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <img src={chemforgeLogo} alt="" className="w-64 h-64 opacity-20" />
              </div>
            </div>
            
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
                Ready to Start <span className="text-gradient">Experimenting</span>?
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10">
                Join ChemForge today and transform the way you learn chemistry. No safety goggles required.
              </p>
              <Link to="/auth">
                <Button variant="glow" size="xl" className="shadow-lg shadow-primary/25">
                  Launch Simulator
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>
        
        {/* Footer */}
        <footer className="border-t border-border/50 py-8">
          <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={chemforgeLogo} alt="ChemForge" className="w-8 h-8" />
              <span className="font-display font-semibold">ChemForge</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 ChemForge. Built for chemistry enthusiasts.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
