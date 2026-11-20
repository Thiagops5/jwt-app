// cadastro e lista de atendentes, só o admin acessa
// rota da API: GET /v1/user (o verifyAdmin do back responde 403 pra atendente comum)
// se vier 403 a pessoa volta pro dashboard, se vier 401 o apiGet já manda pro login
// o back nunca devolve a senha (o toJSON do user.model.js corta), então não tem hash pra mostrar

import { apiGet } from '@/lib/data';
import { User } from '@/lib/types';
import { ui } from '@/lib/ui';
import { isAxiosError } from 'axios';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import ToggleActiveButton from './ToggleActiveButton';
import UserForm from './UserForm';

export default async function AtendentesPage() {
  let users: User[] = [];

  try {
    users = await apiGet<User[]>('/user');
  } catch (error) {
    // quem não é admin cai aqui e volta pro dashboard. qualquer outro erro (inclusive o redirect do 401) segue pra frente
    if (isAxiosError(error) && error.response?.status === 403) {
      redirect('/dashboard');
    }
    throw error;
  }

  return (
    <main className={ui.page}>
      <h1 className={ui.title}>Atendentes</h1>

      <div className={ui.card}>
        <UserForm />
      </div>

      <table className={ui.table}>
        <thead>
          <tr>
            <th className={ui.th}>Nome</th>
            <th className={ui.th}>Usuário</th>
            <th className={ui.th}>E-mail</th>
            <th className={ui.th}>Perfil</th>
            <th className={ui.th}>Situação</th>
            <th className={ui.th}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className={ui.td}>{user.name}</td>
              <td className={ui.td}>{user.username}</td>
              <td className={ui.td}>{user.email}</td>
              <td className={ui.td}>{user.isAdmin ? 'Administrador' : 'Atendente'}</td>
              <td className={ui.td}>{user.active ? 'Ativo' : 'Desativado'}</td>
              <td className={ui.td}>
                <div className="flex items-center gap-3">
                  <Link href={`/dashboard/atendentes/${user.id}`} className={ui.link}>
                    Editar
                  </Link>
                  <ToggleActiveButton id={user.id} active={user.active} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
