'use client';
// botão de devolução. chama a action returnBook(id), que faz PATCH /loans/:id/return
// o cálculo da multa (R$ 1,00 por dia de atraso) é feito no back, aqui a gente só mostra o valor que ele devolveu em fine
// depois da devolução a lista é recarregada e esse botão some da linha (porque o empréstimo já tem returnDate),
// por isso o valor da multa aparece num alert na hora e continua na coluna Multa da tabela

import { returnBook } from '@/actions/loan';
import { ui } from '@/lib/ui';
import { useActionState } from 'react';

type Resultado = { error: string | null; fine: number | null };

export default function ReturnButton({ id }: { id: number }) {
  const [state, formAction, isPending] = useActionState(
    async (): Promise<Resultado> => {
      const result = await returnBook(id);

      if (!result.error) {
        const multa = result.fine ?? 0;
        window.alert(multa > 0 ? `Livro devolvido! Multa por atraso: R$ ${multa.toFixed(2)}` : 'Livro devolvido sem multa!');
      }
      return result;
    },
    { error: null, fine: null } as Resultado,
  );

  return (
    <form action={formAction} className="inline">
      <button type="submit" disabled={isPending} className={ui.buttonLight}>
        {isPending ? 'Devolvendo...' : 'Devolver'}
      </button>
      {state.error && <span className={`ml-2 ${ui.error}`}>{state.error}</span>}
    </form>
  );
}
