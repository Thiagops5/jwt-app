// função que as páginas usam pra ler dados da API (GET), pra não repetir cookie e try/catch em toda page.tsx
// o token vem do cookie e vai no header Authorization, que é o que o verifyToken do back-end lê
// se a API responder 401 a sessão acabou e manda pro login, se responder 404 abre a página de não encontrado
// qualquer outro erro (403, API fora do ar...) é jogado pra frente pra página decidir o que fazer
import publicApi from '@/lib/api';
import { getAccessToken } from '@/lib/session';
import { isAxiosError } from 'axios';
import { notFound, redirect } from 'next/navigation';

export async function apiGet<T>(path: string, params?: Record<string, string | undefined>): Promise<T> {
  const token = await getAccessToken();

  try {
    const res = await publicApi.get<T>(path, {
      params,
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.status === 401) {
        redirect('/');
      }
      if (error.response?.status === 404) {
        notFound();
      }
    }
    throw error;
  }
}
