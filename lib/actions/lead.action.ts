'use server'

import { createClient } from '@/lib/supabase/server';
import { leadSchema, type LeadFormValues } from '@/lib/validations/lead.schema';

export async function submitLead(values: LeadFormValues) {
  const supabase = await createClient();
  
  // Validate data
  const validatedFields = leadSchema.safeParse(values);

  if (!validatedFields.success) {
    return { 
      success: false, 
      error: validatedFields.error.flatten().fieldErrors 
    };
  }
  if (!supabase) {
    return { success: false, error: 'Service unavailble' };
  }

  const { error } = await supabase.from('contacts').insert(validatedFields.data);

  if (error) {
    console.error('Error submitting contact:', error);
    return { success: false, error: 'Failed to submit inquiry. Please try again.' };
  }

  return { success: true };
}
