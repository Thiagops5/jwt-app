// listagem de autores, é a mesma ideia da página de categorias trocando a rota
// Server Component (sem 'use client'), então o GET na API acontece no servidor
// rota da API: GET /v1/authors (precisa do token, a escrita é só admin)

import { apiGet } from '@/lib/data';
import { Author } from '@/lib/types';
import { ui } from '@/lib/ui';
import Link from 'next/link';
import AuthorForm from './AuthorForm';
import DeleteAuthorButton from './DeleteAuthorButton';

export default async function AutoresPage() {
  const authors = await apiGet<Author[]>('/authors');

  return (
    <main className={ui.page}>
      <h1 className={ui.title}>Autores</h1>

      <div className={ui.card}>
        <AuthorForm />
      </div>

      <table className={ui.table}>
        <thead>
          <tr>
            <th className={ui.th}>Nome</th>
            <th className={ui.th}>Nacionalidade</th>
            <th className={ui.th}>Nascimento</th>
            <th className={ui.th}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {authors.map((author) => (
            <tr key={author.id}>
              <td className={ui.td}>{author.name}</td>
              <td className={ui.td}>{author.nationality}</td>
              {/* a data vem como 2000-12-31, aqui a gente só inverte pra mostrar no formato brasileiro */}
              <td className={ui.td}>{author.birthDate.split('-').reverse().join('/')}</td>
              <td className={ui.td}>
                <div className="flex items-center gap-3">
                  <Link href={`/dashboard/autores/${author.id}`} className={ui.link}>
                    Editar
                  </Link>
                  <DeleteAuthorButton id={author.id} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
