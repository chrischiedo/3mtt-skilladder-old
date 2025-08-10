'use server';

import { redirect, RedirectType } from 'next/navigation';

export async function redirectTo(path: string, type?: RedirectType) {
  redirect(path, type);
}

export async function refreshHistory(path: string) {
  redirect(path);
}
