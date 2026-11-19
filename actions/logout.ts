'use server';


import publicApi from '@/lib/api';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';


export async function logout() {

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  try {
    await publicApi.post(
      '/auth/logout',
      { refreshToken },
      { headers: { Authorization: `Bearer ${token}` } },
    );
  } catch {
    // se der erro aqui (por exemplo, o token de 15 min já tinha vencido), a gente NÃO trava o usuário!
    // deixa passar reto porque ele quer sair da conta de qualquer jeito
  }
  // 3. A PARTE NOVA: apaga os cookies do navegador!
  // sem o cookie 'token', o proxy.ts já barra qualquer tentativa de entrar em /dashboard
  cookieStore.delete('token');
  cookieStore.delete('refreshToken');
  // 4. manda o usuário de volta pra tela de login ("/")
  redirect('/');
}
