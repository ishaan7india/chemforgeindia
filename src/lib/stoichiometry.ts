import { Reaction, SimulationResult, Product } from '@/types/reaction';

export function convertToMoles(
  quantity: number,
  unit: string,
  molarMass: number
): number {
  switch (unit) {
    case 'grams':
      return quantity / molarMass;
    case 'moles':
      return quantity;
    case 'mL': // Assuming 1M concentration for simplicity
      return quantity / 1000;
    default:
      return quantity;
  }
}

export function calculateStoichiometry(
  reaction: Reaction,
  quantityA: number,
  unitA: string,
  quantityB: number,
  unitB: string
): SimulationResult {
  const steps: string[] = [];
  
  // Step 1: Convert inputs to moles
  const molesA = convertToMoles(quantityA, unitA, reaction.reactant_a_molar_mass);
  const molesB = convertToMoles(quantityB, unitB, reaction.reactant_b_molar_mass);
  
  steps.push(`Step 1: Convert reactants to moles`);
  steps.push(`${reaction.reactant_a}: ${quantityA} ${unitA} ÷ ${reaction.reactant_a_molar_mass} g/mol = ${molesA.toFixed(4)} mol`);
  steps.push(`${reaction.reactant_b}: ${quantityB} ${unitB} ÷ ${reaction.reactant_b_molar_mass} g/mol = ${molesB.toFixed(4)} mol`);
  
  // Step 2: Determine limiting reagent using mole ratios
  const ratioA = molesA / reaction.reactant_a_coefficient;
  const ratioB = molesB / reaction.reactant_b_coefficient;
  
  steps.push(`\nStep 2: Calculate mole ratios`);
  steps.push(`${reaction.reactant_a}: ${molesA.toFixed(4)} mol ÷ ${reaction.reactant_a_coefficient} = ${ratioA.toFixed(4)}`);
  steps.push(`${reaction.reactant_b}: ${molesB.toFixed(4)} mol ÷ ${reaction.reactant_b_coefficient} = ${ratioB.toFixed(4)}`);
  
  const limitingReagent: 'A' | 'B' = ratioA <= ratioB ? 'A' : 'B';
  const limitingRatio = Math.min(ratioA, ratioB);
  
  const limitingName = limitingReagent === 'A' ? reaction.reactant_a : reaction.reactant_b;
  steps.push(`\nStep 3: Identify limiting reagent`);
  steps.push(`${limitingName} is the limiting reagent (smaller ratio)`);
  
  // Step 3: Calculate products formed
  const products = (reaction.products as Product[]).map((product) => {
    const productMoles = limitingRatio * product.coefficient;
    const productMass = productMoles * product.molar_mass;
    
    steps.push(`\nCalculating ${product.name}:`);
    steps.push(`Moles = ${limitingRatio.toFixed(4)} × ${product.coefficient} = ${productMoles.toFixed(4)} mol`);
    steps.push(`Mass = ${productMoles.toFixed(4)} mol × ${product.molar_mass} g/mol = ${productMass.toFixed(4)} g`);
    
    return {
      name: product.name,
      formula: product.formula,
      moles: productMoles,
      mass: productMass,
      coefficient: product.coefficient,
    };
  });
  
  // Step 4: Calculate excess reagent leftover
  const excessReagent = limitingReagent === 'A' 
    ? {
        name: reaction.reactant_b,
        usedMoles: limitingRatio * reaction.reactant_b_coefficient,
        leftoverMoles: molesB - (limitingRatio * reaction.reactant_b_coefficient),
        molarMass: reaction.reactant_b_molar_mass,
      }
    : {
        name: reaction.reactant_a,
        usedMoles: limitingRatio * reaction.reactant_a_coefficient,
        leftoverMoles: molesA - (limitingRatio * reaction.reactant_a_coefficient),
        molarMass: reaction.reactant_a_molar_mass,
      };
  
  const leftoverMass = excessReagent.leftoverMoles * excessReagent.molarMass;
  
  steps.push(`\nStep 4: Calculate excess reagent`);
  steps.push(`${excessReagent.name} leftover: ${excessReagent.leftoverMoles.toFixed(4)} mol = ${leftoverMass.toFixed(4)} g`);
  
  // Calculate theoretical yield (sum of all product masses)
  const theoreticalYield = products.reduce((sum, p) => sum + p.mass, 0);
  
  steps.push(`\nStep 5: Theoretical yield`);
  steps.push(`Total products mass: ${theoreticalYield.toFixed(4)} g`);
  
  return {
    reaction,
    inputA: { quantity: quantityA, unit: unitA, moles: molesA },
    inputB: { quantity: quantityB, unit: unitB, moles: molesB },
    limitingReagent,
    excessReagent: {
      name: excessReagent.name,
      leftoverMoles: excessReagent.leftoverMoles,
      leftoverMass,
    },
    productsFormed: products,
    theoreticalYield,
    calculationSteps: steps,
  };
}
