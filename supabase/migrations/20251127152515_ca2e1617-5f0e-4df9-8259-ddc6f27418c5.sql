-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, SPLIT_PART(NEW.email, '@', 1));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create reactions table (public readable)
CREATE TABLE public.reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reactant_a TEXT NOT NULL,
  reactant_b TEXT NOT NULL,
  reactant_a_formula TEXT NOT NULL,
  reactant_b_formula TEXT NOT NULL,
  reactant_a_molar_mass DECIMAL NOT NULL,
  reactant_b_molar_mass DECIMAL NOT NULL,
  reactant_a_coefficient INTEGER DEFAULT 1,
  reactant_b_coefficient INTEGER DEFAULT 1,
  products JSONB NOT NULL,
  balanced_equation TEXT NOT NULL,
  reaction_type TEXT NOT NULL,
  enthalpy_kj DECIMAL,
  observation TEXT,
  state_changes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read reactions" ON public.reactions
  FOR SELECT USING (true);

-- Create simulation history table
CREATE TABLE public.simulation_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  reaction_id UUID REFERENCES public.reactions(id),
  reactant_a TEXT NOT NULL,
  reactant_b TEXT NOT NULL,
  reactant_a_quantity DECIMAL NOT NULL,
  reactant_b_quantity DECIMAL NOT NULL,
  reactant_a_unit TEXT NOT NULL,
  reactant_b_unit TEXT NOT NULL,
  balanced_equation TEXT NOT NULL,
  limiting_reagent TEXT NOT NULL,
  products_formed JSONB NOT NULL,
  leftover_reagent JSONB,
  theoretical_yield DECIMAL NOT NULL,
  reaction_type TEXT NOT NULL,
  observation TEXT,
  calculation_steps JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.simulation_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own history" ON public.simulation_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own history" ON public.simulation_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own history" ON public.simulation_history
  FOR DELETE USING (auth.uid() = user_id);