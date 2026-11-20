'use client';

// botão de excluir da lista. recebe o id da categoria por prop e chama a action deleteCategory(id)
// o back só deixa excluir se a categoria não tiver livros (regra 6 do README) e responde 409 com a mensagem
// por isso a gente guarda o { error } no state e mostra do lado do botão, senão parece que nada aconteceu
// o window.confirm só funciona no navegador, por isso esse componente é client

import { deleteCategory } from '@/actions/category';
import { ui } from '@/lib/ui';
import { useActionState } from 'react';

export default function DeleteCategoryButton({ id }: { id: number }) {
  // o () => deleteCategory(id) passa o id da categoria pra action e guarda o { error } no state
  const [state, formAction, isPending] = useActionState(
    () => deleteCategory(id),
    { error: null as string | null },
  );

  return (
    <form
      action={formAction}
      className="inline"
      onSubmit={(e) => {
        // se a pessoa cancelar o confirm, o preventDefault impede a action de rodar
        if (!window.confirm('Tem certeza que quer excluir essa categoria?')) {
          e.preventDefault();
        }
      }}
    >
      <button type="submit" disabled={isPending} className={ui.buttonDanger}>
        {isPending ? 'Excluindo...' : 'Excluir'}
      </button>

      {/* se a categoria tiver livros (erro 409), mostra a mensagem aqui do lado */}
      {state.error && <span className={`ml-2 ${ui.error}`}>{state.error}</span>}
    </form>
  );
}
