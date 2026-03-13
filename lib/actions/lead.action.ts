'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
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

  const { error } = await supabase.from('leads').insert(validatedFields.data);

  if (error) {
    console.error('Error submitting lead:', error);
    return { success: false, error: 'Failed to submit inquiry. Please try again.' };
  }

  revalidatePath('/dashboard/leads');
  return { success: true };
}
