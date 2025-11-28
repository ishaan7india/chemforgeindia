import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ReactionVisualizer } from '@/components/ReactionVisualizer';
import { SimulationResults } from '@/components/SimulationResults';
import { calculateStoichiometry } from '@/lib/stoichiometry';
import { Reaction, SimulationResult } from '@/types/reaction';
import { FlaskConical, Atom, ArrowLeft, Play, RotateCcw, Loader2 } from 'lucide-react';
import { NavBar } from '@/components/NavBar';

export default function Simulator() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [reactantA, setReactantA] = useState('');
  const [reactantB, setReactantB] = useState('');
  const [quantityA, setQuantityA] = useState('');
  const [quantityB, setQuantityB] = useState('');
  const [unitA, setUnitA] = useState('grams');
  const [unitB, setUnitB] = useState('grams');
  
  // Simulation state
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [availableReactantB, setAvailableReactantB] = useState<Reaction[]>([]);
  const animationRef = useRef<number | null>(null);
  
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);
  
  useEffect(() => {
    fetchReactions();
  }, []);
  
  useEffect(() => {
    if (reactantA) {
      const compatible = reactions.filter(
        r => r.reactant_a === reactantA || r.reactant_b === reactantA
      );
      setAvailableReactantB(compatible);
      setReactantB('');
    }
  }, [reactantA, reactions]);

  // Animation loop
  useEffect(() => {
    if (isPlaying && progress < 100) {
      const animate = () => {
        setProgress(prev => {
          const next = prev + 0.5;
          if (next >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return next;
        });
        animationRef.current = requestAnimationFrame(animate);
      };
      const timeoutId = setTimeout(() => {
        animationRef.current = requestAnimationFrame(animate);
      }, 50);
      return () => {
        clearTimeout(timeoutId);
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
      };
    }
  }, [isPlaying, progress]);
  
  const fetchReactions = async () => {
    const { data, error } = await supabase
      .from('reactions')
      .select('*');
    
    if (error) {
      toast({
        title: 'Error loading reactions',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      const parsed = data?.map(r => ({
        ...r,
        products: typeof r.products === 'string' ? JSON.parse(r.products) : r.products,
      })) as Reaction[];
      setReactions(parsed || []);
    }
    setLoading(false);
  };
  
  const findReaction = (): Reaction | null => {
    return reactions.find(r => 
      (r.reactant_a === reactantA && r.reactant_b === reactantB) ||
      (r.reactant_a === reactantB && r.reactant_b === reactantA)
    ) || null;
  };
  
  const handleSimulate = () => {
    const reaction = findReaction();
    if (!reaction) {
      toast({
        title: 'Reaction not found',
        description: 'This combination of reactants is not in our database.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!quantityA || !quantityB || parseFloat(quantityA) <= 0 || parseFloat(quantityB) <= 0) {
      toast({
        title: 'Invalid quantities',
        description: 'Please enter valid positive quantities for both reactants.',
        variant: 'destructive',
      });
      return;
    }
    
    setProgress(0);
    setIsPlaying(false);
    
    let qA = parseFloat(quantityA);
    let qB = parseFloat(quantityB);
    let uA = unitA;
    let uB = unitB;
    
    if (reaction.reactant_a !== reactantA) {
      [qA, qB] = [qB, qA];
      [uA, uB] = [uB, uA];
    }
    
    const simulationResult = calculateStoichiometry(reaction, qA, uA, qB, uB);
    setResult(simulationResult);
  };
  
  const handlePlay = useCallback(() => {
    if (progress >= 100) setProgress(0);
    setIsPlaying(true);
  }, [progress]);
  
  const handlePause = useCallback(() => setIsPlaying(false), []);
  
  const handleProgressReset = useCallback(() => {
    setProgress(0);
    setIsPlaying(false);
  }, []);
  
  const handleProgressChange = useCallback((newProgress: number) => {
    setProgress(newProgress);
    setIsPlaying(false);
  }, []);
  
  const handleSave = async () => {
    if (!result || !user) return;
    
    setSaving(true);
    
    const { error } = await supabase
      .from('simulation_history')
      .insert([{
        user_id: user.id,
        reaction_id: result.reaction.id,
        reactant_a: result.reaction.reactant_a,
        reactant_b: result.reaction.reactant_b,
        reactant_a_quantity: result.inputA.quantity,
        reactant_b_quantity: result.inputB.quantity,
        reactant_a_unit: result.inputA.unit,
        reactant_b_unit: result.inputB.unit,
        balanced_equation: result.reaction.balanced_equation,
        limiting_reagent: result.limitingReagent === 'A' ? result.reaction.reactant_a : result.reaction.reactant_b,
        products_formed: result.productsFormed,
        leftover_reagent: { name: result.excessReagent.name, mass: result.excessReagent.leftoverMass },
        theoretical_yield: result.theoreticalYield,
        reaction_type: result.reaction.reaction_type,
        observation: result.reaction.observation,
        calculation_steps: result.calculationSteps,
      }]);
    
    setSaving(false);
    
    if (error) {
      toast({
        title: 'Error saving simulation',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Simulation saved!',
        description: 'You can view it in your dashboard.',
      });
    }
  };
  
  const handleReset = () => {
    setResult(null);
    setProgress(0);
    setIsPlaying(false);
    setReactantA('');
    setReactantB('');
    setQuantityA('');
    setQuantityB('');
    setUnitA('grams');
    setUnitB('grams');
  };
  
  const uniqueReactants = [...new Set(reactions.flatMap(r => [r.reactant_a, r.reactant_b]))].sort();
  
  const getCompatibleReactants = () => {
    if (!reactantA) return [];
    return [...new Set(availableReactantB.flatMap(r => 
      [r.reactant_a, r.reactant_b].filter(x => x !== reactantA)
    ))].sort();
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
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-display font-bold text-gradient">Reaction Simulator</h1>
              <p className="text-muted-foreground">Select reactants and simulate stoichiometry</p>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="space-y-6">
              <div className="glass-card p-6">
                <h2 className="font-display text-xl font-semibold mb-6 flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-primary" />
                  Reactant Selection
                </h2>
                
                <div className="space-y-6">
                  {/* Reactant A */}
                  <div className="space-y-2">
                    <Label>Reactant A</Label>
                    <Select value={reactantA} onValueChange={setReactantA}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select first reactant" />
                      </SelectTrigger>
                      <SelectContent>
                        {uniqueReactants.map(r => (
                          <SelectItem key={r} value={r}>{r}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Quantity"
                        value={quantityA}
                        onChange={(e) => setQuantityA(e.target.value)}
                        className="flex-1"
                      />
                      <Select value={unitA} onValueChange={setUnitA}>
                        <SelectTrigger className="w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="grams">grams</SelectItem>
                          <SelectItem value="moles">moles</SelectItem>
                          <SelectItem value="mL">mL (1M)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {/* Plus icon */}
                  <div className="flex justify-center">
                    <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center">
                      <Atom className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  
                  {/* Reactant B */}
                  <div className="space-y-2">
                    <Label>Reactant B</Label>
                    <Select 
                      value={reactantB} 
                      onValueChange={setReactantB}
                      disabled={!reactantA}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={reactantA ? "Select second reactant" : "Select Reactant A first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {getCompatibleReactants().map(r => (
                          <SelectItem key={r} value={r}>{r}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Quantity"
                        value={quantityB}
                        onChange={(e) => setQuantityB(e.target.value)}
                        className="flex-1"
                        disabled={!reactantB}
                      />
                      <Select value={unitB} onValueChange={setUnitB}>
                        <SelectTrigger className="w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="grams">grams</SelectItem>
                          <SelectItem value="moles">moles</SelectItem>
                          <SelectItem value="mL">mL (1M)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="glow"
                      size="lg"
                      className="flex-1"
                      onClick={handleSimulate}
                      disabled={!reactantA || !reactantB || !quantityA || !quantityB}
                    >
                      <Play className="w-5 h-5" />
                      Simulate Reaction
                    </Button>
                    <Button variant="outline" size="lg" onClick={handleReset}>
                      <RotateCcw className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Visualizer */}
              {result && (
                <ReactionVisualizer 
                  result={result} 
                  progress={progress}
                  isPlaying={isPlaying}
                  onPlay={handlePlay}
                  onPause={handlePause}
                  onReset={handleProgressReset}
                  onProgressChange={handleProgressChange}
                />
              )}
            </div>
            
            {/* Results */}
            <div>
              {result && progress >= 100 ? (
                <SimulationResults result={result} onSave={handleSave} saving={saving} />
              ) : (
                <div className="glass-card p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
                  <FlaskConical className="w-16 h-16 text-muted-foreground/30 mb-4" />
                  <h3 className="font-display text-xl font-semibold text-muted-foreground mb-2">
                    No Simulation Yet
                  </h3>
                  <p className="text-muted-foreground/70 max-w-sm">
                    Select two reactants, enter quantities, and click "Simulate Reaction" to see detailed stoichiometry calculations.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
