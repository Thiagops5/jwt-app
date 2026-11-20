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
    <header className="bg-[#C22820] text-white shadow">
      <nav className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-3">
        <div className="flex flex-wrap items-center gap-5 text-sm font-medium">
          <Link href="/dashboard" className="text-base font-bold hover:underline">
            Biblioteca
          </Link>
          <Link href="/dashboard/categorias" className="hover:underline">
            Categorias
          </Link>
          <Link href="/dashboard/autores" className="hover:underline">
            Autores
          </Link>
          <Link href="/dashboard/livros" className="hover:underline">
            Livros
          </Link>
          <Link href="/dashboard/leitores" className="hover:underline">
            Leitores
          </Link>
          <Link href="/dashboard/emprestimos" className="hover:underline">
            Empréstimos
          </Link>
          {user.isAdmin && (
            <Link href="/dashboard/atendentes" className="hover:underline">
              Atendentes
            </Link>
          )}
        </div>

        {/* nome de quem está logado e o botão de sair */}
        <div className="flex items-center gap-4">
          <span className="text-sm">
            {user.name} ({user.isAdmin ? 'administrador' : 'atendente'})
          </span>
          <LogoutButton />
        </div>
      </nav>
    </header>
  );
}
