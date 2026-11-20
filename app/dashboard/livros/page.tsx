// listagem de livros com busca e filtros
// os filtros vêm pela URL (ex: /dashboard/livros?title=fund&available=true) e chegam aqui no searchParams
// no Next 16 o searchParams é uma Promise, por isso o await
// a gente repassa os filtros pra API (GET /books?title=&categoryId=&authorId=&available=) e o book.service.js do back faz a busca
// o apiGet ignora os filtros que estiverem vazios
// também busca as categorias e os autores porque os selects do filtro e do cadastro precisam deles
// o Promise.all faz as 3 buscas ao mesmo tempo em vez de esperar uma terminar pra começar a outra

import { apiGet } from '@/lib/data';
import { Author, Book, Category } from '@/lib/types';
import { ui } from '@/lib/ui';
import Link from 'next/link';
import BookFilters from './BookFilters';
import BookForm from './BookForm';
import DeleteBookButton from './DeleteBookButton';

export default async function LivrosPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const filters = await searchParams;

  const [books, categories, authors] = await Promise.all([
    apiGet<Book[]>('/books', {
      title: filters.title || undefined,
      categoryId: filters.categoryId || undefined,
      authorId: filters.authorId || undefined,
      available: filters.available || undefined,
    }),
    apiGet<Category[]>('/categories'),
    apiGet<Author[]>('/authors'),
  ]);

  return (
    <main className={ui.page}>
      <h1 className={ui.title}>Livros</h1>

      <div className={ui.card}>
        <h2 className="mb-3 font-semibold">Buscar</h2>
        <BookFilters categories={categories} authors={authors} filters={filters} />
      </div>

      <div className={ui.card}>
        <h2 className="mb-3 font-semibold">Cadastrar livro</h2>
        <BookForm categories={categories} authors={authors} />
      </div>

      <table className={ui.table}>
        <thead>
          <tr>
            <th className={ui.th}>Título</th>
            <th className={ui.th}>Autores</th>
            <th className={ui.th}>Categoria</th>
            <th className={ui.th}>Disponíveis</th>
            <th className={ui.th}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td className={ui.td}>{book.title}</td>
              <td className={ui.td}>{book.Authors?.map((author) => author.name).join(', ')}</td>
              <td className={ui.td}>{book.Category?.name}</td>
              <td className={ui.td}>
                {/* quando não tem nenhum exemplar na estante fica em vermelho pra deixar claro que está indisponível */}
                {book.availableCopies > 0 ? (
                  <span>
                    {book.availableCopies} de {book.totalCopies}
                  </span>
                ) : (
                  <span className="font-semibold text-red-600">Indisponível (0 de {book.totalCopies})</span>
                )}
              </td>
              <td className={ui.td}>
                <div className="flex items-center gap-3">
                  <Link href={`/dashboard/livros/${book.id}`} className={ui.link}>
                    Editar
                  </Link>
                  <DeleteBookButton id={book.id} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
