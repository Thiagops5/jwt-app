'use server';

import publicApi from '@/lib/api';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
;


// ===================================================================================================
// actions/user.ts - escritas de atendente (POST, PUT, PATCH) - tudo só admin
// ===================================================================================================
// - createUser(_prevState, formData): POST /v1/user { name, username, email, password, isAdmin }
// - updateUser(id, _prevState, formData): PUT /v1/user/:id { name, username, email }
// - toggleUserActive(id, active): PATCH /v1/user/:id/active { active }
// o back devolve 400 quando email ou username já existem (unique)
// no fim revalidatePath('/dashboard/atendentes')

export async function createUser(_prevState: { error: null | string }, formData: FormData) {
  const name = formData.get('name');
  const username = formData.get('username');
  const email = formData.get('email');

  //tem que add o password e isAdmin para conseguir criar o atendente
  const password = formData.get('password');
  const isAdmin = formData.get('isAdmin') === 'on';

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  try {
    await publicApi.post(
      '/user',
      {name, username, email, password, isAdmin},
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch(error){
    if (isAxiosError(error)) {
      return { error: error.response?.data?.error || 'Erro ao cadastrar atendente' };
    }
    return { error: 'Erro ao cadastrar atedente' };
  }
  revalidatePath('/dashboard/atendentes');
  return {error: null};
}

export async function updateUser(
  id: number,
  _prevState: { error: null | string },
  formData: FormData,
) {
  const name = formData.get('name');
  const username = formData.get('username');
  const email = formData.get('email');

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  try {
    await publicApi.put(
      `/user/${id}`,
      {name, username, email},
      { headers: { Authorization: `Bearer ${token}` } }

    );
  } catch(error){
    if (isAxiosError(error)) {
      return { error: error.response?.data?.error || 'Erro ao cadastrar atendente' };
    }
    return { error: 'Erro ao cadastrar atedente' };
  }
  revalidatePath('/dashboard/atendentes');
  redirect('/dashboard/atendentes');
}


//não tem delete somente a alteração de usuario de ativo para desativado
export async function toggleUserActive(id: number, active: boolean) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  try {
    await publicApi.patch(
      `/user/${id}/active`,
      { active },
      { headers: { Authorization: `Bearer ${token}` } },
    );
  } catch (error) {
    if (isAxiosError(error)) {
      return { error: error.response?.data?.error || 'Erro ao alterar status do atendente' };
    }
    return { error: 'Erro ao alterar status do atendente' };
  }

  revalidatePath('/dashboard/atendentes');
  return { error: null };
}

