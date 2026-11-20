// tela de editar livro
// o back já devolve o livro com a categoria e os autores junto (book.service.js, findById com include)
// busca o livro, as categorias e os autores ao mesmo tempo e abre o formulário já preenchido, com os autores do livro marcados

import { apiGet } from '@/lib/data';
import { Author, Book, Category } from '@/lib/types';
import { ui } from '@/lib/ui';
import Link from 'next/link';
import BookForm from '../BookForm';

export default async function EditarLivroPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [book, categories, authors] = await Promise.all([
    apiGet<Book>(`/books/${id}`),
    apiGet<Category[]>('/categories'),
    apiGet<Author[]>('/authors'),
  ]);

  return (
    <main className={ui.page}>
      <h1 className={ui.title}>Editar livro</h1>

      <div className={ui.card}>
        <BookForm book={book} categories={categories} authors={authors} />
      </div>

      <Link href="/dashboard/livros" className={ui.link}>
        Voltar para a lista
      </Link>
    </main>
  );
}
