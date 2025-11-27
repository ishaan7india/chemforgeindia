import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { NavBar } from '@/components/NavBar';
import { SimulationHistory, Product } from '@/types/reaction';
import { 
  FlaskConical, 
  Plus, 
  Clock, 
  Beaker, 
  Zap, 
  Trash2, 
  Loader2,
  ChevronRight,
  Activity
} from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [history, setHistory] = useState<SimulationHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);
  
  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);
  
  const fetchHistory = async () => {
    const { data, error } = await supabase
      .from('simulation_history')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast({
        title: 'Error loading history',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      const parsed = data?.map(h => ({
        ...h,
        products_formed: typeof h.products_formed === 'string' 
          ? JSON.parse(h.products_formed) 
          : h.products_formed,
        leftover_reagent: typeof h.leftover_reagent === 'string'
          ? JSON.parse(h.leftover_reagent)
          : h.leftover_reagent,
        calculation_steps: typeof h.calculation_steps === 'string'
          ? JSON.parse(h.calculation_steps)
          : h.calculation_steps,
      })) as SimulationHistory[];
      setHistory(parsed || []);
    }
    setLoading(false);
  };
  
  const handleDelete = async (id: string) => {
    setDeleting(id);
    
    const { error } = await supabase
      .from('simulation_history')
      .delete()
      .eq('id', id);
    
    setDeleting(null);
    
    if (error) {
      toast({
        title: 'Error deleting simulation',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setHistory(prev => prev.filter(h => h.id !== id));
      toast({
        title: 'Simulation deleted',
        description: 'The simulation has been removed from your history.',
      });
    }
  };
  
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background bg-grid">
      <NavBar />
      
      <main className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-gradient">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, scientist!</p>
            </div>
            <Link to="/simulator">
              <Button variant="glow" size="lg" className="gap-2">
                <Plus className="w-5 h-5" />
                New Simulation
              </Button>
            </Link>
          </div>
          
          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="glass-card p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Simulations</p>
                  <p className="text-2xl font-display font-bold">{history.length}</p>
                </div>
              </div>
            </div>
            <div className="glass-card p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                  <Beaker className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Unique Reactions</p>
                  <p className="text-2xl font-display font-bold">
                    {new Set(history.map(h => h.balanced_equation)).size}
                  </p>
                </div>
              </div>
            </div>
            <div className="glass-card p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Yield</p>
                  <p className="text-2xl font-display font-bold">
                    {history.reduce((sum, h) => sum + Number(h.theoretical_yield), 0).toFixed(2)}g
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* History Section */}
          <div className="glass-card p-6">
            <h2 className="font-display text-xl font-semibold mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Simulation History
            </h2>
            
            {history.length === 0 ? (
              <div className="text-center py-12">
                <FlaskConical className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="font-display text-lg font-semibold text-muted-foreground mb-2">
                  No simulations yet
                </h3>
                <p className="text-muted-foreground/70 mb-6">
                  Start your first chemical reaction simulation!
                </p>
                <Link to="/simulator">
                  <Button variant="default">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Simulation
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((sim, index) => (
                  <motion.div
                    key={sim.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group p-4 rounded-lg bg-muted/20 border border-border/50 hover:border-primary/30 transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="font-mono text-lg text-foreground mb-2">
                          {sim.balanced_equation}
                        </div>
                        <div className="flex flex-wrap gap-3 text-sm">
                          <span className="px-2 py-1 rounded bg-primary/20 text-primary">
                            {sim.reaction_type}
                          </span>
                          <span className="text-muted-foreground">
                            Yield: <span className="text-secondary font-mono">{Number(sim.theoretical_yield).toFixed(4)}g</span>
                          </span>
                          <span className="text-muted-foreground">
                            Limiting: <span className="font-mono">{sim.limiting_reagent}</span>
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          {format(new Date(sim.created_at), 'MMM d, yyyy · h:mm a')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(sim.id)}
                          disabled={deleting === sim.id}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          {deleting === sim.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                        <Link to="/simulator">
                          <Button variant="outline" size="sm" className="gap-1">
                            Re-run
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
