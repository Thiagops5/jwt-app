// barra do topo que aparece em todas as telas do dashboard (o layout.tsx é quem coloca ela lá)
// Server Component, então já busca o usuário logado aqui mesmo: GET /auth/me devolve { id, name, email, isAdmin }
// o link de Atendentes só aparece pra admin. isso é só visual, quem bloqueia de verdade é a API (o verifyAdmin devolve 403)
import { apiGet } from '@/lib/data';
import Link from 'next/link';
import LogoutButton from './LogoutButton';

type UsuarioLogado = {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
};

export default async function Menu() {
  const user = await apiGet<UsuarioLogado>('/auth/me');

  return (
    <header className="bg-gradient-to-r from-[#C22820] to-[#5C2034] text-white shadow">
      <nav className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-3.5">
        <div className="flex flex-wrap items-center gap-1 text-sm font-medium">
          <Link
            href="/dashboard"
            className="mr-3 rounded px-2 py-1 text-base font-bold tracking-tight hover:bg-white/10"
          >
            Biblioteca
          </Link>
          <Link href="/dashboard/categorias" className="rounded px-2.5 py-1.5 hover:bg-white/15">
            Categorias
          </Link>
          <Link href="/dashboard/autores" className="rounded px-2.5 py-1.5 hover:bg-white/15">
            Autores
          </Link>
          <Link href="/dashboard/livros" className="rounded px-2.5 py-1.5 hover:bg-white/15">
            Livros
          </Link>
          <Link href="/dashboard/leitores" className="rounded px-2.5 py-1.5 hover:bg-white/15">
            Leitores
          </Link>
          <Link href="/dashboard/emprestimos" className="rounded px-2.5 py-1.5 hover:bg-white/15">
            Empréstimos
          </Link>
          {user.isAdmin && (
            <Link href="/dashboard/atendentes" className="rounded px-2.5 py-1.5 hover:bg-white/15">
              Atendentes
            </Link>
          )}
        </div>

        {/* nome de quem está logado e o botão de sair */}
        <div className="flex items-center gap-3">
          <span className="rounded bg-black/20 px-2.5 py-1 text-xs font-medium">
            {user.name} · {user.isAdmin ? 'Admin' : 'Atendente'}
          </span>
          <LogoutButton />
        </div>
      </nav>
    </header>
  );
}
