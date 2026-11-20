'use client';
// formulário de cadastro e edição de livro, com uma categoria e vários autores (relação N:N)
// recebe a lista de categorias e de autores por prop (a page.tsx busca na API), e o livro quando for edição
//
// o select dos autores é multiple, então o usuário segura Ctrl pra marcar mais de um
// na action a gente lê com formData.getAll('authors'), que devolve a lista inteira (o get devolveria só o primeiro)
// o back (book.service.js) espera body.authors = [1, 2] (array de ids) e faz o setAuthors, por isso os autores têm que estar cadastrados antes do livro

import { createBook, updateBook } from '@/actions/book';
import { Author, Book, Category } from '@/lib/types';
import { ui } from '@/lib/ui';
import { useActionState } from 'react';

export default function BookForm({
  categories,
  authors,
  book,
}: {
  categories: Category[];
  authors: Author[];
  book?: Book;
}) {
  const action = book ? updateBook.bind(null, book.id) : createBook;

  const [state, formAction, isPending] = useActionState(action, {
    error: null,
  });

  // ids dos autores que o livro já tem, pra já vir marcados na edição
  const autoresDoLivro = book?.Authors?.map((author) => String(author.id)) ?? [];

  return (
    <form action={formAction} className={ui.form}>
      <label htmlFor="title" className={ui.label}>
        Título
        <input id="title" name="title" type="text" required defaultValue={book?.title} className={ui.input} />
      </label>

      <label htmlFor="isbn" className={ui.label}>
        ISBN
        <input id="isbn" name="isbn" type="text" required defaultValue={book?.isbn} className={ui.input} />
      </label>

      <label htmlFor="year" className={ui.label}>
        Ano
        <input id="year" name="year" type="number" required defaultValue={book?.year} className={ui.input} />
      </label>

      <label htmlFor="totalCopies" className={ui.label}>
        Total de exemplares
        <input id="totalCopies" name="totalCopies" type="number" min={1} required defaultValue={book?.totalCopies} className={ui.input} />
      </label>

      {/* no cadastro não tem esse campo e a action usa availableCopies = totalCopies (todo livro novo começa todo disponível) */}
      {/* na edição ele aparece porque o back faz update direto, e sem mandar o valor atual a gente zerava o estoque disponível */}
      {book && (
        <label htmlFor="availableCopies" className={ui.label}>
          Exemplares disponíveis
          <input id="availableCopies" name="availableCopies" type="number" min={0} required defaultValue={book.availableCopies} className={ui.input} />
        </label>
      )}

      <label htmlFor="categoryId" className={ui.label}>
        Categoria
        <select id="categoryId" name="categoryId" required defaultValue={book?.categoryId ?? ''} className={ui.input}>
          <option value="" disabled>
            Selecione...
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <label htmlFor="authors" className={ui.label}>
        Autores (segure Ctrl pra marcar mais de um)
        <select id="authors" name="authors" multiple required defaultValue={autoresDoLivro} className={`${ui.input} h-28`}>
          {authors.map((author) => (
            <option key={author.id} value={author.id}>
              {author.name}
            </option>
          ))}
        </select>
      </label>

      <label htmlFor="description" className={`${ui.label} sm:col-span-2`}>
        Descrição
        <textarea id="description" name="description" rows={2} defaultValue={book?.description ?? ''} className={ui.input} />
      </label>

      <div className="flex items-center gap-3 sm:col-span-2">
        <button disabled={isPending} type="submit" className={ui.button}>
          {isPending ? 'Salvando...' : book ? 'Salvar alterações' : 'Cadastrar'}
        </button>
        {/* se o isbn já existe o back responde 400 com a mensagem e ela aparece aqui */}
        {state.error && <p className={ui.error}>{state.error}</p>}
      </div>
    </form>
  );
}
