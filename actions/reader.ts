'use server';

import publicApi from '@/lib/api';
import { isAxiosError } from 'axios';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// ===================================================================================================
// actions/reader.ts - as escritas de leitor (POST, PUT) - atendente também pode
// ===================================================================================================
// - createReader(_prevState, formData): POST /v1/readers { name, cpf, email, phone }
// - updateReader(id, _prevState, formData): PUT /v1/readers/:id
// (o README só pede GET/POST/PUT. o DELETE existe na API mas só deixa excluir leitor sem empréstimos, então é opcional)
// no fim revalidatePath('/dashboard/leitores')

export async function createReader(_prevState: { error: null | string }, formData: FormData) {
 const name = formData.get('name') as string;
 const cpf = Number(formData.get('cpf'));
 const email = formData.get('email') as string;
 const phone = formData.get('phone') as string;

   const cookieStore = await cookies();
   const token = cookieStore.get('token')?.value;

 try {
  await publicApi.post(
    '/readers',
    { name, cpf, email, phone },
    { headers: { Authorization: `Bearer ${token}` } },
  );
 } catch (error) {
  if (isAxiosError(error)) {
      return { error: error.response?.data?.error || 'Erro ao cadastrar Leitor' };
    }
    return { error: 'Erro ao cadastrar Leitor' };
 }

 revalidatePath('/dashboard/leitores');
 return{ error:null}
}

export async function updateReader(id: number, _prevState: { error: null | string }, formData: FormData) {
  const name = formData.get('name') as string;
  const cpf = Number(formData.get('cpf'));
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;


  try {
    await publicApi.put(
      `/readers/${id}`,
      {name, cpf, email, phone},
      { headers: { Authorization: `Bearer ${token}` } },
    )
  } catch (error) {
  if (isAxiosError(error)) {
      return { error: error.response?.data?.error || 'Erro ao alterar o Leitor' };
    }
    return { error: 'Erro ao alterar o Leitor' };


 }
    revalidatePath('/dashboard/leitores');
    redirect('/dashboard/leitores');
}

export async function deleteReader(id: number) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  try {

    await publicApi.delete(`/readers/${id}`, { headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    if (isAxiosError(error)) {
      return { error: error.response?.data?.error || 'Erro ao deletar Leitor' };
    }
    return { error: 'Erro ao deletar o Leitor' };
  }

  revalidatePath('/dashboard/leitores');
  return { error: null};
}
