import { motion } from 'framer-motion';
import { SimulationResult } from '@/types/reaction';

interface ReactionVisualizerProps {
  result: SimulationResult;
  progress: number;
}

export function ReactionVisualizer({ result, progress }: ReactionVisualizerProps) {
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
  
  return (
    <div className="glass-card p-6 space-y-6">
      <h3 className="font-display text-xl font-semibold text-center neon-text">
        Reaction Progress
      </h3>
      
      {/* Beaker Animation */}
      <div className="flex justify-center">
        <div className="relative w-40 h-52">
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
            {progress > 0 && progress < 100 && (
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
          
          {/* Temperature indicator */}
          {reaction.enthalpy_kj && (
            <div className="absolute -right-16 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              <div className={`font-mono ${isExothermic ? 'text-destructive' : 'text-primary'}`}>
                ΔH = {reaction.enthalpy_kj} kJ
              </div>
              <div className="mt-1">
                {isExothermic ? '🔥 Exothermic' : '❄️ Endothermic'}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Reaction Progress</span>
          <span className="text-primary font-mono">{Math.round(progress)}%</span>
        </div>
        <div className="h-3 rounded-full bg-muted/50 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
            style={{ width: `${progress}%` }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
      
      {/* Reactants Bars */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-muted-foreground">Reactants</h4>
        
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-mono text-primary">{reaction.reactant_a_formula}</span>
              <span className="text-muted-foreground">{reactantARemaining.toFixed(1)}% remaining</span>
            </div>
            <div className="reaction-bar">
              <motion.div
                className="reaction-fill-reactant"
                style={{ width: `${reactantARemaining}%` }}
                animate={{ width: `${reactantARemaining}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-mono text-primary">{reaction.reactant_b_formula}</span>
              <span className="text-muted-foreground">{reactantBRemaining.toFixed(1)}% remaining</span>
            </div>
            <div className="reaction-bar">
              <motion.div
                className="reaction-fill-reactant"
                style={{ width: `${reactantBRemaining}%` }}
                animate={{ width: `${reactantBRemaining}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Products Bars */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-muted-foreground">Products</h4>
        
        <div className="space-y-3">
          {productsFormed.map((product, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-mono text-secondary">{product.formula}</span>
                <span className="text-muted-foreground">{(productProgress).toFixed(1)}% formed</span>
              </div>
              <div className="reaction-bar">
                <motion.div
                  className="reaction-fill-product"
                  style={{ width: `${productProgress}%` }}
                  animate={{ width: `${productProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
