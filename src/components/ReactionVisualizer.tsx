import { motion, AnimatePresence } from 'framer-motion';
import { SimulationResult } from '@/types/reaction';
import { Play, Pause, RotateCcw, Atom } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReactionVisualizerProps {
  result: SimulationResult;
  progress: number;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onProgressChange: (progress: number) => void;
}

// Molecule component for microscopic view
const Molecule = ({ 
  type, 
  x, 
  y, 
  delay = 0,
  isReacting = false 
}: { 
  type: 'reactantA' | 'reactantB' | 'product';
  x: number;
  y: number;
  delay?: number;
  isReacting?: boolean;
}) => {
  const colors = {
    reactantA: 'from-primary to-cyan-400',
    reactantB: 'from-secondary to-emerald-400',
    product: 'from-amber-400 to-orange-500',
  };

  return (
    <motion.div
      className={`absolute w-3 h-3 rounded-full bg-gradient-to-br ${colors[type]} shadow-lg`}
      initial={{ x, y, scale: 0, opacity: 0 }}
      animate={{ 
        x: isReacting ? x + (Math.random() - 0.5) * 20 : x,
        y: isReacting ? y + (Math.random() - 0.5) * 20 : y,
        scale: 1, 
        opacity: 1 
      }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ 
        delay, 
        duration: 0.5,
        x: { duration: 0.3, repeat: isReacting ? Infinity : 0, repeatType: 'mirror' },
        y: { duration: 0.3, repeat: isReacting ? Infinity : 0, repeatType: 'mirror' }
      }}
    />
  );
};

export function ReactionVisualizer({ 
  result, 
  progress, 
  isPlaying, 
  onPlay, 
  onPause, 
  onReset,
  onProgressChange 
}: ReactionVisualizerProps) {
  const { reaction, inputA, inputB, limitingReagent, productsFormed } = result;
  
  // Calculate visual percentages based on progress
  const reactantARemaining = limitingReagent === 'A' 
    ? Math.max(0, 100 - progress)
    : Math.max(0, 100 - (progress * (inputA.moles / inputB.moles) * (reaction.reactant_b_coefficient / reaction.reactant_a_coefficient)));
  
  const reactantBRemaining = limitingReagent === 'B'
    ? Math.max(0, 100 - progress)
    : Math.max(0, 100 - (progress * (inputB.moles / inputA.moles) * (reaction.reactant_a_coefficient / reaction.reactant_b_coefficient)));
  
  const productProgress = progress;
  
  // Calculate beaker liquid level and color
  const liquidLevel = 30 + (progress / 100) * 40;
  const isExothermic = reaction.enthalpy_kj !== null && reaction.enthalpy_kj < 0;
  
  // Generate molecules for microscopic view
  const reactantAMolecules = Math.round((reactantARemaining / 100) * 8);
  const reactantBMolecules = Math.round((reactantBRemaining / 100) * 8);
  const productMolecules = Math.round((productProgress / 100) * 10);
  const isReacting = progress > 0 && progress < 100;
  
  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl font-semibold neon-text">
          Reaction Progress
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onReset}
            className="h-8 w-8"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            variant="glow"
            size="icon"
            onClick={isPlaying ? onPause : onPlay}
            className="h-8 w-8"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
        </div>
      </div>
      
      {/* Main Visualization Area */}
      <div className="grid grid-cols-2 gap-6">
        {/* Beaker Animation */}
        <div className="flex flex-col items-center">
          <span className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">Macroscopic View</span>
          <div className="relative w-36 h-48">
            {/* Beaker outline */}
            <div className="beaker w-full h-full">
              {/* Liquid */}
              <motion.div
                className="liquid"
                style={{ 
                  height: `${liquidLevel}%`,
                  background: `linear-gradient(180deg, 
                    hsla(${187 - (progress * 0.5)}, 100%, ${50 + progress * 0.1}%, 0.8) 0%, 
                    hsla(${142 + (progress * 0.3)}, 100%, ${40 + progress * 0.15}%, 0.9) 100%)`
                }}
                animate={{
                  height: `${liquidLevel}%`,
                }}
                transition={{ duration: 0.5 }}
              />
              
              {/* Bubbles when reaction is active */}
              {isReacting && (
                <div className="bubbles">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="bubble"
                      style={{
                        left: `${15 + i * 12}%`,
                        animationDelay: `${i * 0.3}s`,
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.6 }}
                    />
                  ))}
                </div>
              )}
              
              {/* Glow effect for exothermic reactions */}
              {isExothermic && progress > 0 && (
                <motion.div
                  className="absolute inset-0 rounded-b-3xl"
                  style={{
                    background: `radial-gradient(circle at center bottom, hsla(30, 100%, 50%, ${progress * 0.003}), transparent 70%)`,
                  }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </div>
            
            {/* Labels */}
            <div className="absolute -left-2 top-1/2 -translate-y-1/2 -translate-x-full text-[10px] text-muted-foreground">
              <div className="flex flex-col items-end gap-1">
                <span className="text-primary font-mono">{reaction.reactant_a_formula}</span>
                <span className="text-secondary font-mono">{reaction.reactant_b_formula}</span>
              </div>
            </div>
          </div>
          
          {/* Temperature indicator */}
          {reaction.enthalpy_kj && (
            <div className="mt-3 text-center">
              <div className={`text-xs font-mono ${isExothermic ? 'text-destructive' : 'text-primary'}`}>
                ΔH = {reaction.enthalpy_kj} kJ/mol
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                {isExothermic ? '🔥 Exothermic' : '❄️ Endothermic'}
              </div>
            </div>
          )}
        </div>
        
        {/* Microscopic View */}
        <div className="flex flex-col items-center">
          <span className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">Microscopic View</span>
          <div className="relative w-36 h-48 rounded-xl border border-border/50 bg-muted/20 overflow-hidden">
            {/* Background grid */}
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: 'radial-gradient(circle, hsl(var(--primary)/0.3) 1px, transparent 1px)',
              backgroundSize: '12px 12px'
            }} />
            
            {/* Legend */}
            <div className="absolute top-2 left-2 right-2 flex justify-between text-[8px]">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-gradient-to-br from-primary to-cyan-400" />
                <span className="text-muted-foreground">{reaction.reactant_a_formula}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-gradient-to-br from-secondary to-emerald-400" />
                <span className="text-muted-foreground">{reaction.reactant_b_formula}</span>
              </div>
            </div>
            
            {/* Product legend */}
            {productMolecules > 0 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 text-[8px]">
                <div className="w-2 h-2 rounded-full bg-gradient-to-br from-amber-400 to-orange-500" />
                <span className="text-muted-foreground">Products</span>
              </div>
            )}
            
            {/* Molecules */}
            <AnimatePresence>
              {/* Reactant A molecules */}
              {[...Array(reactantAMolecules)].map((_, i) => (
                <Molecule
                  key={`a-${i}`}
                  type="reactantA"
                  x={20 + (i % 4) * 25}
                  y={40 + Math.floor(i / 4) * 35}
                  delay={i * 0.05}
                  isReacting={isReacting}
                />
              ))}
              
              {/* Reactant B molecules */}
              {[...Array(reactantBMolecules)].map((_, i) => (
                <Molecule
                  key={`b-${i}`}
                  type="reactantB"
                  x={30 + (i % 4) * 25}
                  y={60 + Math.floor(i / 4) * 35}
                  delay={i * 0.05}
                  isReacting={isReacting}
                />
              ))}
              
              {/* Product molecules */}
              {[...Array(productMolecules)].map((_, i) => (
                <Molecule
                  key={`p-${i}`}
                  type="product"
                  x={25 + (i % 5) * 22}
                  y={100 + Math.floor(i / 5) * 30}
                  delay={0.2 + i * 0.05}
                  isReacting={false}
                />
              ))}
            </AnimatePresence>
            
            {/* Reaction zone indicator */}
            {isReacting && (
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-2 border-dashed border-primary/30"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Atom className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-primary/40" />
              </motion.div>
            )}
          </div>
          
          <div className="mt-3 text-center text-[10px] text-muted-foreground">
            {isReacting ? 'Molecules colliding...' : progress >= 100 ? 'Reaction complete' : 'Ready to react'}
          </div>
        </div>
      </div>
      
      {/* Progress Bar with Video Controls */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Reaction Timeline</span>
          <span className="text-primary font-mono">{Math.round(progress)}%</span>
        </div>
        <div className="relative">
          <div className="h-2 rounded-full bg-muted/50 overflow-hidden cursor-pointer" 
               onClick={(e) => {
                 const rect = e.currentTarget.getBoundingClientRect();
                 const x = e.clientX - rect.left;
                 const newProgress = Math.max(0, Math.min(100, (x / rect.width) * 100));
                 onProgressChange(newProgress);
               }}>
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
              style={{ width: `${progress}%` }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          {/* Playhead */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary shadow-lg shadow-primary/50 cursor-pointer"
            style={{ left: `calc(${progress}% - 8px)` }}
            animate={{ left: `calc(${progress}% - 8px)` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
          <span>0:00</span>
          <span>Reactants → Products</span>
          <span>1:00</span>
        </div>
      </div>
      
      {/* Reactants & Products Bars */}
      <div className="grid grid-cols-2 gap-4">
        {/* Reactants */}
        <div className="space-y-3">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Reactants</h4>
          
          <div className="space-y-2">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-mono text-primary">{reaction.reactant_a_formula}</span>
                <span className="text-muted-foreground">{reactantARemaining.toFixed(0)}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-400"
                  animate={{ width: `${reactantARemaining}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-mono text-secondary">{reaction.reactant_b_formula}</span>
                <span className="text-muted-foreground">{reactantBRemaining.toFixed(0)}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-secondary to-emerald-400"
                  animate={{ width: `${reactantBRemaining}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Products */}
        <div className="space-y-3">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Products</h4>
          
          <div className="space-y-2">
            {productsFormed.map((product, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-mono text-amber-400">{product.formula}</span>
                  <span className="text-muted-foreground">{productProgress.toFixed(0)}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                    animate={{ width: `${productProgress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
