'use client';
// formulário de cadastro e edição de atendente, só o admin acessa essa tela
// no cadastro precisa de senha e do checkbox isAdmin, na edição só nome, username e e-mail
// (o back também só atualiza esses 3 campos no update, pra ninguém mandar um isAdmin: true escondido no body)
// se o e-mail ou o username já existem o back responde 400 e a mensagem aparece aqui embaixo

import { createUser, updateUser } from '@/actions/user';
import { User } from '@/lib/types';
import { ui } from '@/lib/ui';
import { useActionState } from 'react';

export default function UserForm({ user }: { user?: User }) {
  const action = user ? updateUser.bind(null, user.id) : createUser;

  const [state, formAction, isPending] = useActionState(action, {
    error: null,
  });

  return (
    <form action={formAction} className={ui.form}>
      <label htmlFor="name" className={ui.label}>
        Nome
        <input id="name" name="name" type="text" required defaultValue={user?.name} className={ui.input} />
      </label>

      <label htmlFor="username" className={ui.label}>
        Usuário
        <input id="username" name="username" type="text" required defaultValue={user?.username} className={ui.input} />
      </label>

      <label htmlFor="email" className={ui.label}>
        E-mail
        <input id="email" name="email" type="email" required defaultValue={user?.email} className={ui.input} />
      </label>

      {/* senha e admin só aparecem no cadastro, porque a edição não mexe nisso */}
      {!user && (
        <>
          <label htmlFor="password" className={ui.label}>
            Senha
            <input id="password" name="password" type="password" minLength={6} required className={ui.input} />
          </label>

          <label htmlFor="isAdmin" className="flex items-center gap-2 text-sm font-medium">
            <input id="isAdmin" name="isAdmin" type="checkbox" />
            Administrador
          </label>
        </>
      )}

      <div className="flex items-center gap-3 sm:col-span-2">
        <button disabled={isPending} type="submit" className={ui.button}>
          {isPending ? 'Salvando...' : user ? 'Salvar alterações' : 'Cadastrar'}
        </button>
        {state.error && <p className={ui.error}>{state.error}</p>}
      </div>
    </form>
  );
}
