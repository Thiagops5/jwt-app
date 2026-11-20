'use server';


import publicApi from '@/lib/api';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';



export async function createBook(_prevState: { error: null | string }, formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const isbn = formData.get('isbn') as string;
  const year = Number(formData.get('year'));
  const totalCopies = Number(formData.get('totalCopies'));

  // se não vier availableCopies do form, começa igual ao totalCopies
const availableCopies = formData.get('availableCopies')
  ? Number(formData.get('availableCopies'))
  : totalCopies;

  const categoryId = Number(formData.get('categoryId'));
  const authors = formData.getAll('authors').map((id) => Number(id));

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  try {
    await publicApi.post(
      '/books',
      { title, description, isbn, year, totalCopies, availableCopies, categoryId, authors },
      { headers: { Authorization: `Bearer ${token}` } },
    );
  } catch (error) {
    if (isAxiosError(error)) {
      return { error: error.response?.data?.error || 'Erro ao cadastrar livro' };
    }
    return { error: 'Erro ao cadastrar livro' };
  }


  revalidatePath('/dashboard/livros');

  return { error: null };

}

export async function updateBook(
  id: number,
  _prevState: { error: null | string },
  formData: FormData,
) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const isbn = formData.get('isbn') as string;
  const year = Number(formData.get('year'));
  const totalCopies = Number(formData.get('totalCopies'));

  // se não vier availableCopies do form, começa igual ao totalCopies
  const availableCopies = formData.get('availableCopies')
    ? Number(formData.get('availableCopies'))
    : totalCopies;

  const categoryId = Number(formData.get('categoryId'));
  const authors = formData.getAll('authors').map((id) => Number(id));

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  try {
    await publicApi.put(
      `/books/${id}`,
      { title, description, isbn, year, totalCopies, availableCopies, categoryId, authors },
      { headers: { Authorization: `Bearer ${token}` } },
    );
  } catch (error) {
    if (isAxiosError(error)) {
      return { error: error.response?.data?.error || 'Erro ao atualizar livro' };
    }
    return { error: 'Erro ao atualizar livro' };
  }

  revalidatePath('/dashboard/livros');

  // depois de editar volta pra lista de livros
  redirect('/dashboard/livros');
}

export async function deleteBook(id: number) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  try {
    await publicApi.delete(`/books/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    if (isAxiosError(error)) {
      return { error: error.response?.data?.error || 'Erro ao excluir livro' };
    }
    return { error: 'Erro ao excluir livro' };
  }

  revalidatePath('/dashboard/livros');

  redirect('/dashboard/livros');
}
