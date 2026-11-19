'use server';

import publicApi from '@/lib/api';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';


// TODO: actions/author.ts - as escritas de autor (POST, PUT, DELETE)

// o GET (listar) não fica aqui, ele fica direto na page.tsx (leitura = Server Component, escrita = action)
// a estrutura de cada função é a mesma do actions/category.ts: ler o formData, ler o token do cookie,
// chamar o axios com o header Authorization, tratar o erro com isAxiosError e dar revalidatePath
//
// funções:
// - createAuthor(_prevState, formData): POST /v1/authors { name, nationality, birthDate } -> devolve { error: null | string }
// - updateAuthor(id, _prevState, formData): PUT /v1/authors/:id
//   (pra mandar o id junto use createAuthor.bind(null, id) no componente, o bind joga o id como primeiro parâmetro)
// - deleteAuthor(id): DELETE /v1/authors/:id -> 409 quando o autor tem livros, devolver a mensagem do back
//
// as 3 rotas de escrita exigem ADMIN no back (verifyAdmin). atendente recebe 403

export async function createAuthor( _prevState: { error: null | string }, formData: FormData) {
  const name = formData.get('name') as string;
  const nationality = formData.get('nationality') as string;
  const birthDate = formData.get('birthDate') as string;

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  
  try {
    await publicApi.post(
      '/authors',
      { name, nationality, birthDate },
      { headers: { Authorization: `Bearer ${token}` } },
    );
  } catch (error) {
    if (isAxiosError(error)) {
      return { error: error.response?.data?.error || 'Erro ao cadastrar autor' };
    }
    return { error: 'Erro ao cadastrar autor' };
  }

  revalidatePath('/dashboard/autores');
  return {error: null};
}

export async function updateAuthor(
  id: number,
  _prevState: { error: null | string },
  formData: FormData,
) {
  const name = formData.get('name') as string;
  const nationality = formData.get('nationality') as string;
  const birthDate = formData.get('birthDate') as string;

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  try {
    await publicApi.put(
      `/authors/${id}`,
      { name, nationality, birthDate },
      { headers: { Authorization: `Bearer ${token}` } },
    );
  } catch (error) {
    if (isAxiosError(error)) {
      return { error: error.response?.data?.error || 'Erro ao atualizar autor' };
    }
    return { error: 'Erro ao atualizar autor' };
  }

  revalidatePath('/dashboard/autores');
  redirect('/dashboard/autores');
}

export async function deleteAuthor(id: number) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  try {
    await publicApi.delete(`/authors/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    if (isAxiosError(error)) {
      return { error: error.response?.data?.error || 'Erro ao deletar autor' };
    }
    return { error: 'Erro ao deletar autor' };
  }

  revalidatePath('/dashboard/autores');
  return { error: null};
}
