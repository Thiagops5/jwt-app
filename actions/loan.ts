'use server';

import publicApi from "@/lib/api";
import { isAxiosError } from "axios";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


// actions/loan.ts - registrar empréstimo e devolução (POST e PATCH) - atendente e admin

// - createLoan(_prevState, formData): POST /v1/loans { bookId, readerId } (converter pra Number)
//   erros que o back devolve em { error } com status 400: 'Nenhuma cópia disponível', 'Limite de empréstimos atingido',
//   'Existem empréstimos em atraso', 'Livro não encontrado'. mostrar a mensagem do jeito que vier
//   deu certo -> revalidatePath('/dashboard/emprestimos') e redirect('/dashboard/emprestimos')
// - returnLoan(id): PATCH /v1/loans/:id/return -> devolve o empréstimo com o campo fine (multa)
//   retornar { error: null, fine: loan.fine } pro ReturnButton mostrar

export async function createLoan(_prevState: { error: null | string }, formData: FormData) {
  const bookId = Number(formData.get('bookId'));
  const readerId = Number(formData.get('readerId'));

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  try {
    await publicApi.post(
      '/loans',
      {bookId, readerId},
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch(error){
      if (isAxiosError(error)) {
        return { error: error.response?.data?.error || 'Erro ao criar empréstimo' };
      }
      return { error: 'Erro ao criar empréstimo' };
    }
    revalidatePath('/dashboard/emprestimos');
    // o novo empréstimo foi registrado, então volta pra lista de empréstimos
    redirect('/dashboard/emprestimos');
}

export async function returnBook(id: number) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  // declaramos o fine FORA do try com "let" pra ele existir até o final da função!
  let fine = 0;

  try {
    const res = await publicApi.patch(
      `/loans/${id}/return`,
      {},
      { headers: { Authorization: `Bearer ${token}` } },
    );
    fine = res.data.fine;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        error: error.response?.data?.error || 'Erro ao devolver o empréstimo',
        fine: null,
      };
    }
    return { error: 'Erro ao devolver o empréstimo', fine: null };
  }

  revalidatePath('/dashboard/emprestimos');
  return {
    error: null,
    fine,
  };
}