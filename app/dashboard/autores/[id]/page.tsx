// tela de editar autor, igual a de categorias: pega o id da URL, busca o autor (GET /authors/:id) e abre o formulário preenchido

import { apiGet } from '@/lib/data';
import { Author } from '@/lib/types';
import { ui } from '@/lib/ui';
import Link from 'next/link';
import AuthorForm from '../AuthorForm';

export default async function EditarAutorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const author = await apiGet<Author>(`/authors/${id}`);

  return (
    <main className={ui.page}>
      <h1 className={ui.title}>Editar autor</h1>

      <div className={ui.card}>
        <AuthorForm author={author} />
      </div>

      <Link href="/dashboard/autores" className={ui.link}>
        Voltar para a lista
      </Link>
    </main>
  );
}
