'use server';

import { revalidatePath } from 'next/cache';

/** Bust Next.js data cache for all admin listing surfaces after mutations. */
export async function revalidateAdminListings() {
  revalidatePath('/admin', 'layout');
  revalidatePath('/admin/listings');
  revalidatePath('/admin/dashboard');
}
