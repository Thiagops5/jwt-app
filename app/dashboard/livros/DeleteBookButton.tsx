'use client';
// botão de excluir livro. o back bloqueia quando o livro tem empréstimos vinculados (book.service.js)
// e a mensagem de erro aparece do lado do botão

import { deleteBook } from '@/actions/book';
import { ui } from '@/lib/ui';
import { useActionState } from 'react';

export default function DeleteBookButton({ id }: { id: number }) {
  const [state, formAction, isPending] = useActionState(
    () => deleteBook(id),
    { error: null as string | null },
  );

  return (
    <form
      action={formAction}
      className="inline"
      onSubmit={(e) => {
        if (!window.confirm('Tem certeza que quer excluir esse livro?')) {
          e.preventDefault();
        }
      }}
    >
      <button type="submit" disabled={isPending} className={ui.buttonDanger}>
        {isPending ? 'Excluindo...' : 'Excluir'}
      </button>
      {state.error && <span className={`ml-2 ${ui.error}`}>{state.error}</span>}
    </form>
  );
}
