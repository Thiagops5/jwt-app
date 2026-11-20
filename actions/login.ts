'use server';

import publicApi from '@/lib/api';
import { saveSession } from '@/lib/session';
import { isAxiosError } from 'axios';
import { redirect } from 'next/navigation';


export async function login( _prevState: {error:null|string}, formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');

  try {
    const res = await publicApi.post(`/auth/login`, {
      email,
      password
    });

    // o back devolve os dois tokens, o saveSession grava os dois em cookies httpOnly (ver lib/session.ts)
    await saveSession(res.data.accessToken, res.data.refreshToken);
  } catch (error) {
    // o back responde { error: "..." }, por isso lemos response.data.error (ex: senha errada ou atendente desativado)
    if (isAxiosError(error)) {
      return { error: error.response?.data?.error || 'Erro ao fazer login' };
    }
    return { error: 'Erro ao fazer login' };
  }

  // o redirect fica fora do try/catch porque ele funciona jogando um erro especial que o catch ia engolir
  redirect('/dashboard');
}
