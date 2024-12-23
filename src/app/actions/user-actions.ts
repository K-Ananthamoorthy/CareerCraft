'use server'

import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { StudentProfile } from '@/types/student-profile'

export async function updateUser(userId: string, userData: Partial<StudentProfile>) {
  const supabase = createServerActionClient({ cookies })
  
  const { error } = await supabase
    .from('student_profiles')
    .update(userData)
    .eq('id', userId)

  if (error) throw new Error('Failed to update user')
  
  revalidatePath('/admin/users')
}

export async function deleteUser(userId: string) {
  const supabase = createServerActionClient({ cookies })
  
  const { error } = await supabase
    .from('student_profiles')
    .delete()
    .eq('id', userId)

  if (error) throw new Error('Failed to delete user')
  
  revalidatePath('/admin/users')
}

