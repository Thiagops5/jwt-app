// tela de editar atendente (só admin)
// GET /user/:id traz o atendente e o formulário abre preenchido, a edição manda PUT /user/:id com nome, username e e-mail
// se quem acessou não for admin a API responde 403 e a pessoa volta pro dashboard

import { apiGet } from '@/lib/data';
import { User } from '@/lib/types';
import { ui } from '@/lib/ui';
import { isAxiosError } from 'axios';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import UserForm from '../UserForm';

export default async function EditarAtendentePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let user: User;

  try {
    user = await apiGet<User>(`/user/${id}`);
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 403) {
      redirect('/dashboard');
    }
    throw error;
  }

  return (
    <main className={ui.page}>
      <h1 className={ui.title}>Editar atendente</h1>

      <div className={ui.card}>
        <UserForm user={user} />
      </div>

      <Link href="/dashboard/atendentes" className={ui.link}>
        Voltar para a lista
      </Link>
    </main>
  );
}
