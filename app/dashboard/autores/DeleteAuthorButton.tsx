'use client';
// botão de excluir autor, igual ao DeleteCategoryButton
// o back responde 409 (possui livros vinculados) quando o autor tem livro e a mensagem aparece do lado do botão

import { deleteAuthor } from '@/actions/author';
import { ui } from '@/lib/ui';
import { useActionState } from 'react';

export default function DeleteAuthorButton({ id }: { id: number }) {
  const [state, formAction, isPending] = useActionState(
    () => deleteAuthor(id),
    { error: null as string | null },
  );

  return (
    <form
      action={formAction}
      className="inline"
      onSubmit={(e) => {
        if (!window.confirm('Tem certeza que quer excluir esse autor?')) {
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
