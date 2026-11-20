'use client';
// formulário de cadastro e edição de autor, igual ao CategoryForm mudando só os campos
// se vier a prop author é edição (o bind já manda o id pra updateAuthor), se não vier é cadastro

import { createAuthor, updateAuthor } from '@/actions/author';
import { Author } from '@/lib/types';
import { ui } from '@/lib/ui';
import { useActionState } from 'react';

export default function AuthorForm({ author }: { author?: Author }) {
  const action = author ? updateAuthor.bind(null, author.id) : createAuthor;

  const [state, formAction, isPending] = useActionState(action, {
    error: null,
  });

  return (
    <form action={formAction} className={ui.form}>
      <label htmlFor="name" className={ui.label}>
        Nome
        <input id="name" name="name" type="text" required defaultValue={author?.name} className={ui.input} />
      </label>

      <label htmlFor="nationality" className={ui.label}>
        Nacionalidade
        <input id="nationality" name="nationality" type="text" defaultValue={author?.nationality ?? ''} className={ui.input} />
      </label>

      {/* o input type="date" já manda o valor como texto no formato 2000-12-31, que é o que o banco guarda (TEXT), então não precisa converter nada */}
      <label htmlFor="birthDate" className={ui.label}>
        Data de nascimento
        <input id="birthDate" name="birthDate" type="date" required defaultValue={author?.birthDate} className={ui.input} />
      </label>

      <div className="flex items-center gap-3 sm:col-span-2">
        <button disabled={isPending} type="submit" className={ui.button}>
          {isPending ? 'Salvando...' : author ? 'Salvar alterações' : 'Cadastrar'}
        </button>
        {state.error && <p className={ui.error}>{state.error}</p>}
      </div>
    </form>
  );
}
