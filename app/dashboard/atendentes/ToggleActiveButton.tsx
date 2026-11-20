'use client';
// botão de ativar ou desativar o atendente (PATCH /user/:id/active)
// recebe o id e o estado atual, e manda o contrário: se está ativo vira false, se está desativado vira true
// atendente desativado não consegue mais logar, o login responde "User is deactivated"

import { toggleUserActive } from '@/actions/user';
import { ui } from '@/lib/ui';
import { useActionState } from 'react';

export default function ToggleActiveButton({ id, active }: { id: number; active: boolean }) {
  const [state, formAction, isPending] = useActionState(
    () => toggleUserActive(id, !active),
    { error: null as string | null },
  );

  return (
    <form action={formAction} className="inline">
      <button type="submit" disabled={isPending} className={active ? ui.buttonDanger : ui.buttonLight}>
        {isPending ? 'Salvando...' : active ? 'Desativar' : 'Ativar'}
      </button>
      {state.error && <span className={`ml-2 ${ui.error}`}>{state.error}</span>}
    </form>
  );
}
