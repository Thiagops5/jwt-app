// tela de novo empréstimo
// busca os leitores (GET /readers) e só os livros que ainda têm exemplar (GET /books?available=true) pra montar os selects do formulário

import { apiGet } from '@/lib/data';
import { Book, Reader } from '@/lib/types';
import { ui } from '@/lib/ui';
import Link from 'next/link';
import LoanForm from '../LoanForm';

export default async function NovoEmprestimoPage() {
  const [readers, books] = await Promise.all([
    apiGet<Reader[]>('/readers'),
    apiGet<Book[]>('/books', { available: 'true' }),
  ]);

  return (
    <main className={ui.page}>
      <h1 className={ui.title}>Novo empréstimo</h1>

      <div className={ui.card}>
        <LoanForm readers={readers} books={books} />
      </div>

      <Link href="/dashboard/emprestimos" className={ui.link}>
        Voltar para a lista
      </Link>
    </main>
  );
}
