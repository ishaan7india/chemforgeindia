import { motion } from 'framer-motion';
import { SimulationResult } from '@/types/reaction';
import { FlaskConical, Zap, AlertTriangle, Beaker, Save, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SimulationResultsProps {
  result: SimulationResult;
  onSave: () => void;
  saving: boolean;
}

export function SimulationResults({ result, onSave, saving }: SimulationResultsProps) {
  const { reaction, inputA, inputB, limitingReagent, excessReagent, productsFormed, theoreticalYield, calculationSteps } = result;
  
  const limitingReagentName = limitingReagent === 'A' ? reaction.reactant_a : reaction.reactant_b;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Balanced Equation Card */}
      <div className="glass-card p-6">
        <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-primary" />
          Balanced Equation
        </h3>
        <div className="bg-muted/30 rounded-lg p-4 text-center">
          <p className="font-mono text-xl text-foreground tracking-wide">
            {reaction.balanced_equation}
          </p>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <span className="px-2 py-1 rounded bg-accent/20 text-accent">
            {reaction.reaction_type}
          </span>
          {reaction.enthalpy_kj && (
            <span className={`px-2 py-1 rounded ${reaction.enthalpy_kj < 0 ? 'bg-destructive/20 text-destructive' : 'bg-primary/20 text-primary'}`}>
              ΔH = {reaction.enthalpy_kj} kJ/mol
            </span>
          )}
        </div>
      </div>
      
      {/* Limiting Reagent Card */}
      <div className="glass-card p-6">
        <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-secondary" />
          Limiting Reagent
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg border ${limitingReagent === 'A' ? 'border-secondary bg-secondary/10' : 'border-border bg-muted/20'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-lg">{reaction.reactant_a_formula}</span>
              {limitingReagent === 'A' && <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">LIMITING</span>}
            </div>
            <p className="text-sm text-muted-foreground">{reaction.reactant_a}</p>
            <p className="text-sm mt-2">Input: {inputA.quantity} {inputA.unit} ({inputA.moles.toFixed(4)} mol)</p>
          </div>
          <div className={`p-4 rounded-lg border ${limitingReagent === 'B' ? 'border-secondary bg-secondary/10' : 'border-border bg-muted/20'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-lg">{reaction.reactant_b_formula}</span>
              {limitingReagent === 'B' && <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">LIMITING</span>}
            </div>
            <p className="text-sm text-muted-foreground">{reaction.reactant_b}</p>
            <p className="text-sm mt-2">Input: {inputB.quantity} {inputB.unit} ({inputB.moles.toFixed(4)} mol)</p>
          </div>
        </div>
      </div>
      
      {/* Products Table */}
      <div className="glass-card p-6">
        <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
          <Beaker className="w-5 h-5 text-primary" />
          Products Formed
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Product</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Formula</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Moles</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Mass (g)</th>
              </tr>
            </thead>
            <tbody>
              {productsFormed.map((product, index) => (
                <tr key={index} className="border-b border-border/50">
                  <td className="py-3 px-4">{product.name}</td>
                  <td className="py-3 px-4 font-mono text-secondary">{product.formula}</td>
                  <td className="py-3 px-4 text-right font-mono">{product.moles.toFixed(4)}</td>
                  <td className="py-3 px-4 text-right font-mono text-primary">{product.mass.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 p-4 bg-secondary/10 rounded-lg border border-secondary/30">
          <div className="flex items-center justify-between">
            <span className="font-medium">Theoretical Yield</span>
            <span className="font-mono text-xl text-secondary neon-green-text">{theoreticalYield.toFixed(4)} g</span>
          </div>
        </div>
      </div>
      
      {/* Excess Reagent */}
      <div className="glass-card p-6">
        <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-accent" />
          Excess Reagent Remaining
        </h3>
        <div className="bg-muted/30 rounded-lg p-4">
          <p className="text-lg">
            <span className="font-mono text-accent">{excessReagent.name}</span>
            <span className="text-muted-foreground mx-2">→</span>
            <span className="font-mono">{excessReagent.leftoverMoles.toFixed(4)} mol</span>
            <span className="text-muted-foreground mx-2">=</span>
            <span className="font-mono text-primary">{excessReagent.leftoverMass.toFixed(4)} g</span>
          </p>
        </div>
      </div>
      
      {/* Observation */}
      {reaction.observation && (
        <div className="glass-card p-6">
          <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            Laboratory Observations
          </h3>
          <p className="text-muted-foreground">{reaction.observation}</p>
        </div>
      )}
      
      {/* Calculation Steps (Collapsible) */}
      <details className="glass-card p-6">
        <summary className="font-display text-lg font-semibold cursor-pointer hover:text-primary transition-colors">
          📝 Detailed Calculation Steps
        </summary>
        <div className="mt-4 space-y-2 font-mono text-sm text-muted-foreground">
          {calculationSteps.map((step, index) => (
            <p key={index} className={step.startsWith('Step') || step.startsWith('\nStep') ? 'text-primary font-medium mt-4' : ''}>
              {step}
            </p>
          ))}
        </div>
      </details>
      
      {/* Save Button */}
      <div className="flex justify-center">
        <Button
          variant="glow"
          size="lg"
          onClick={onSave}
          disabled={saving}
          className="px-8"
        >
          <Save className="w-5 h-5 mr-2" />
          {saving ? 'Saving...' : 'Save to History'}
        </Button>
      </div>
    </motion.div>
  );
}
