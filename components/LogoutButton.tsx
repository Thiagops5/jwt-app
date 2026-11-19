'use client';

import { logout } from "@/actions/logout";

// ===================================================================================================
// TODO: components/LogoutButton.tsx - botão "Sair" do topo da tela
// ===================================================================================================
// fica dentro do components/Menu.tsx (README 6.8: botão de logout e nome do usuário logado no topo)

export default function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="cursor-pointer rounded bg-white/20 px-3 py-1 text-sm font-medium text-white hover:bg-white/30"
      >
        Sair
      </button>
    </form>
  );
}
