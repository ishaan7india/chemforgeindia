export interface Product {
  name: string;
  formula: string;
  molar_mass: number;
  coefficient: number;
  state: string;
}

export interface Reaction {
  id: string;
  reactant_a: string;
  reactant_b: string;
  reactant_a_formula: string;
  reactant_b_formula: string;
  reactant_a_molar_mass: number;
  reactant_b_molar_mass: number;
  reactant_a_coefficient: number;
  reactant_b_coefficient: number;
  products: Product[];
  balanced_equation: string;
  reaction_type: string;
  enthalpy_kj: number | null;
  observation: string | null;
  state_changes: string | null;
}

export interface SimulationResult {
  reaction: Reaction;
  inputA: { quantity: number; unit: string; moles: number };
  inputB: { quantity: number; unit: string; moles: number };
  limitingReagent: 'A' | 'B';
  excessReagent: { name: string; leftoverMoles: number; leftoverMass: number };
  productsFormed: Array<{
    name: string;
    formula: string;
    moles: number;
    mass: number;
    coefficient: number;
  }>;
  theoreticalYield: number;
  calculationSteps: string[];
}

export interface SimulationHistory {
  id: string;
  user_id: string;
  reaction_id: string | null;
  reactant_a: string;
  reactant_b: string;
  reactant_a_quantity: number;
  reactant_b_quantity: number;
  reactant_a_unit: string;
  reactant_b_unit: string;
  balanced_equation: string;
  limiting_reagent: string;
  products_formed: Product[];
  leftover_reagent: { name: string; mass: number } | null;
  theoretical_yield: number;
  reaction_type: string;
  observation: string | null;
  calculation_steps: string[] | null;
  created_at: string;
}
