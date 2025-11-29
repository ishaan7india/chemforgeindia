import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { FlaskConical, Atom, Zap, Beaker, ChevronRight, Sparkles, Target, BarChart3, ArrowRight, TestTubes, Flame, Droplets, Activity, BookOpen, Users } from 'lucide-react';
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
      description: 'Watch reactions unfold with real-time animations and microscopic molecular views.',
      color: 'primary',
    },
    {
      icon: Target,
      title: 'Accurate Stoichiometry',
      description: 'Calculate limiting reagents, yields, and excess reactants with precision.',
      color: 'secondary',
    },
    {
      icon: BarChart3,
      title: 'Detailed Analysis',
      description: 'Get step-by-step calculations, balanced equations, and lab observations.',
      color: 'amber',
    },
    {
      icon: Zap,
      title: 'Save & Track',
      description: 'Save simulations to your dashboard and access history anytime.',
      color: 'purple',
    },
  ];

  const reactionTypes = [
    { icon: TestTubes, name: 'Neutralization', count: '40+', color: 'from-cyan-500 to-blue-500' },
    { icon: Flame, name: 'Combustion', count: '25+', color: 'from-orange-500 to-red-500' },
    { icon: Droplets, name: 'Precipitation', count: '35+', color: 'from-purple-500 to-pink-500' },
    { icon: Activity, name: 'Redox', count: '30+', color: 'from-green-500 to-emerald-500' },
    { icon: Atom, name: 'Displacement', count: '20+', color: 'from-amber-500 to-yellow-500' },
    { icon: FlaskConical, name: 'Decomposition', count: '20+', color: 'from-rose-500 to-red-500' },
  ];

  const stats = [
    { value: '200+', label: 'Reactions', icon: FlaskConical },
    { value: '100%', label: 'Accurate', icon: Target },
    { value: '∞', label: 'Simulations', icon: Activity },
    { value: '6', label: 'Categories', icon: BookOpen },
  ];
  
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-[10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-20 right-[10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[130px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[180px]" />
      </div>
      
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
          <div className="flex items-center gap-4">
            <Link to="/auth" className="text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              Sign In
            </Link>
            <Link to="/auth">
              <Button variant="glow" size="sm">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </motion.nav>
        
        {/* Hero Section */}
        <section className="container py-16 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
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
                <span className="text-sm text-primary font-medium">200+ Chemical Reactions</span>
              </motion.div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold leading-[1.1]">
                <span className="text-foreground">Simulate </span>
                <span className="text-gradient neon-text">Chemical</span>
                <br />
                <span className="text-foreground">Reactions </span>
                <span className="text-secondary neon-green-text">Live</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-lg leading-relaxed">
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
                  <Button variant="outline" size="xl" className="backdrop-blur-sm border-border/50 hover:bg-muted/50">
                    Sign In
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            {/* Hero Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                {/* Glowing backdrop */}
                <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-primary/5 to-transparent blur-3xl" />
                
                {/* Hexagon grid pattern */}
                <div className="absolute inset-0 opacity-20">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-24 h-24 border border-primary/30 rotate-45"
                      style={{
                        top: `${20 + (i % 3) * 30}%`,
                        left: `${10 + Math.floor(i / 3) * 40}%`,
                      }}
                      animate={{ 
                        scale: [1, 1.1, 1],
                        opacity: [0.2, 0.4, 0.2],
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        delay: i * 0.3,
                      }}
                    />
                  ))}
                </div>
                
                {/* Orbital rings */}
                <motion.div 
                  className="absolute inset-8 border-2 border-dashed border-primary/20 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div 
                  className="absolute inset-20 border border-secondary/20 rounded-full"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                />
                
                {/* Orbiting particles */}
                <motion.div
                  className="absolute inset-0"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                >
                  <div className="absolute top-6 left-1/2 -translate-x-1/2">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-cyan-400 shadow-lg shadow-primary/50" />
                  </div>
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-secondary to-emerald-400 shadow-lg shadow-secondary/50" />
                  </div>
                </motion.div>
                
                <motion.div
                  className="absolute inset-0"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                >
                  <div className="absolute top-1/2 left-4 -translate-y-1/2">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-400/50" />
                  </div>
                  <div className="absolute top-1/2 right-4 -translate-y-1/2">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 shadow-lg shadow-purple-400/50" />
                  </div>
                </motion.div>
                
                {/* Center logo */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150" />
                    <img
                      src={chemforgeLogo}
                      alt="ChemForge"
                      className="w-44 h-44 object-contain relative z-10 drop-shadow-2xl"
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="glass-card p-6 lg:p-8"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center group"
                >
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="text-3xl lg:text-4xl font-display font-bold text-gradient mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Reaction Types Section */}
        <section className="container py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-5xl font-display font-bold mb-4">
              Explore <span className="text-gradient">Reaction Types</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From acid-base neutralization to complex redox reactions, we've got them all covered.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {reactionTypes.map((type, index) => (
              <motion.div
                key={type.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="glass-card p-5 text-center group hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${type.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <type.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-display font-semibold text-sm mb-1">{type.name}</h3>
                <p className="text-xs text-primary font-medium">{type.count} reactions</p>
              </motion.div>
            ))}
          </div>
        </section>
        
        {/* Features Section */}
        <section className="container py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-5xl font-display font-bold mb-4">
              Powerful <span className="text-gradient">Features</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to master chemistry calculations and visualizations.
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
                <div className={`w-14 h-14 rounded-2xl bg-${feature.color}/10 border border-${feature.color}/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-7 h-7 text-${feature.color}`} />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="container py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-5xl font-display font-bold mb-4">
              How It <span className="text-gradient">Works</span>
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-primary/50 via-secondary/50 to-accent/50" />
            
            {[
              { step: '01', title: 'Select Reactants', desc: 'Choose your chemicals from our extensive database of 200+ reactions.' },
              { step: '02', title: 'Enter Quantities', desc: 'Input the amounts in grams or moles for accurate calculations.' },
              { step: '03', title: 'Watch & Learn', desc: 'See the reaction animate with detailed stoichiometry analysis.' },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="text-center relative"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30 relative z-10">
                  <span className="text-lg font-display font-bold text-primary-foreground">{item.step}</span>
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="container py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="glass-card p-10 lg:p-16 text-center relative overflow-hidden"
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
              <motion.div 
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                viewport={{ once: true }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-8 shadow-lg shadow-primary/30"
              >
                <FlaskConical className="w-10 h-10 text-primary-foreground" />
              </motion.div>
              
              <h2 className="text-3xl lg:text-5xl font-display font-bold mb-6">
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
              © 2025 ChemForge India by IshSeven Enterprises. Built for chemistry enthusiasts.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
