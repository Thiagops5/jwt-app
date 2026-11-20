'use client';
// formulário de cadastro e edição de leitor
// o atendente também pode cadastrar leitor (no back só tem o verifyToken, sem o verifyAdmin)
// o cpf é único no banco, então se já existir o back responde 400 e a mensagem aparece aqui embaixo

import { createReader, updateReader } from '@/actions/reader';
import { Reader } from '@/lib/types';
import { ui } from '@/lib/ui';
import { useActionState } from 'react';

export default function ReaderForm({ reader }: { reader?: Reader }) {
  const action = reader ? updateReader.bind(null, reader.id) : createReader;

  const [state, formAction, isPending] = useActionState(action, {
    error: null,
  });

  return (
    <form action={formAction} className={ui.form}>
      <label htmlFor="name" className={ui.label}>
        Nome
        <input id="name" name="name" type="text" required defaultValue={reader?.name} className={ui.input} />
      </label>

      {/* o cpf vai só com números porque no model ele é um número, por isso o pattern barra ponto e traço */}
      <label htmlFor="cpf" className={ui.label}>
        CPF (só números)
        <input id="cpf" name="cpf" type="text" inputMode="numeric" pattern="[0-9]{11}" title="Digite os 11 números do CPF, sem ponto nem traço" required defaultValue={reader?.cpf} className={ui.input} />
      </label>

      <label htmlFor="email" className={ui.label}>
        E-mail
        <input id="email" name="email" type="email" required defaultValue={reader?.email} className={ui.input} />
      </label>

      <label htmlFor="phone" className={ui.label}>
        Telefone
        <input id="phone" name="phone" type="text" defaultValue={reader?.phone ?? ''} className={ui.input} />
      </label>

      <div className="flex items-center gap-3 sm:col-span-2">
        <button disabled={isPending} type="submit" className={ui.button}>
          {isPending ? 'Salvando...' : reader ? 'Salvar alterações' : 'Cadastrar'}
        </button>
        {state.error && <p className={ui.error}>{state.error}</p>}
      </div>
    </form>
  );
}
