'use client';
// formulário de novo empréstimo, o atendente escolhe o leitor e o livro
// só mandamos bookId e readerId, o prazo de 7 dias e o atendente (userId do token) quem define é o back
// as regras (3 empréstimos ativos, leitor com atraso, sem exemplar) o back valida e devolve a mensagem de erro, e aparece aqui embaixo

import { createLoan } from '@/actions/loan';
import { Book, Reader } from '@/lib/types';
import { ui } from '@/lib/ui';
import { useActionState } from 'react';

export default function LoanForm({ readers, books }: { readers: Reader[]; books: Book[] }) {
  const [state, formAction, isPending] = useActionState(createLoan, {
    error: null,
  });

  return (
    <form action={formAction} className={ui.form}>
      <label htmlFor="readerId" className={ui.label}>
        Leitor
        <select id="readerId" name="readerId" required defaultValue="" className={ui.input}>
          <option value="" disabled>
            Selecione o leitor...
          </option>
          {readers.map((reader) => (
            <option key={reader.id} value={reader.id}>
              {reader.name} (CPF {reader.cpf})
            </option>
          ))}
        </select>
      </label>

      <label htmlFor="bookId" className={ui.label}>
        Livro
        <select id="bookId" name="bookId" required defaultValue="" className={ui.input}>
          <option value="" disabled>
            Selecione o livro...
          </option>
          {books.map((book) => (
            <option key={book.id} value={book.id}>
              {book.title} ({book.availableCopies} disponíveis)
            </option>
          ))}
        </select>
      </label>

      <div className="flex items-center gap-3 sm:col-span-2">
        <button disabled={isPending} type="submit" className={ui.button}>
          {isPending ? 'Registrando...' : 'Registrar empréstimo'}
        </button>
        {state.error && <p className={ui.error}>{state.error}</p>}
      </div>
    </form>
  );
}
