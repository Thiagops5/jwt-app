// formulário de busca e filtros dos livros
// aqui não tem server action porque filtrar é só leitura (GET), então o formulário só troca a URL
// o Form do next/form faz isso: monta ?title=...&categoryId=... e navega sem recarregar a página toda
// a page.tsx lê esses valores do searchParams e repassa pra API (GET /books?title=&categoryId=&authorId=&available=true)
// os name dos campos têm que ser iguais aos filtros que o book.service.js do back espera
import { Author, Category } from '@/lib/types';
import { ui } from '@/lib/ui';
import Form from 'next/form';
import Link from 'next/link';

type Filtros = {
  title?: string;
  categoryId?: string;
  authorId?: string;
  available?: string;
};

export default function BookFilters({
  categories,
  authors,
  filters,
}: {
  categories: Category[];
  authors: Author[];
  filters: Filtros;
}) {
  return (
    <Form action="/dashboard/livros" className="grid gap-3 sm:grid-cols-4">
      <label htmlFor="title" className={ui.label}>
        Título
        <input id="title" name="title" type="text" defaultValue={filters.title} className={ui.input} />
      </label>

      <label htmlFor="categoryId" className={ui.label}>
        Categoria
        <select id="categoryId" name="categoryId" defaultValue={filters.categoryId ?? ''} className={ui.input}>
          <option value="">Todas</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <label htmlFor="authorId" className={ui.label}>
        Autor
        <select id="authorId" name="authorId" defaultValue={filters.authorId ?? ''} className={ui.input}>
          <option value="">Todos</option>
          {authors.map((author) => (
            <option key={author.id} value={author.id}>
              {author.name}
            </option>
          ))}
        </select>
      </label>

      <label htmlFor="available" className="flex items-center gap-2 pt-6 text-sm font-medium">
        <input id="available" name="available" type="checkbox" value="true" defaultChecked={filters.available === 'true'} />
        Só disponíveis
      </label>

      <div className="flex items-center gap-3 sm:col-span-4">
        <button type="submit" className={ui.button}>
          Buscar
        </button>
        <Link href="/dashboard/livros" className={ui.link}>
          Limpar filtros
        </Link>
      </div>
    </Form>
  );
}
