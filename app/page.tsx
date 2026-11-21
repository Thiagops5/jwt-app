'use client';

import { login } from '@/actions/login';
import { ui } from '@/lib/ui';
import { useActionState } from 'react';

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, {
    error: null,
  });

  const { error } = state;

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-6 border-b border-gray-100 pb-4">
          <h1 className="text-2xl font-bold text-[#5C2034]">Sistema de Biblioteca</h1>
          <p className="mt-1 text-sm text-gray-500">Entre com seu e-mail e senha para acessar</p>
        </div>

        <form action={formAction} className="flex flex-col gap-4">
          <label htmlFor="email" className={ui.label}>
            E-mail
            <input
              id="email"
              name="email"
              type="email"
              placeholder="admin@biblioteca.com"
              required
              className={ui.input}
            />
          </label>

          <label htmlFor="password" className={ui.label}>
            Senha
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••"
              required
              className={ui.input}
            />
          </label>

          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
              {error}
            </p>
          )}

          <button disabled={isPending} type="submit" className={`${ui.button} mt-1 py-2.5`}>
            {isPending ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </main>
  );
}
