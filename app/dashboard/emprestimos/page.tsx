// lista de empréstimos com filtro de status
// o filtro vem pela URL (?status=ATRASADO) e a gente repassa pra API (GET /loans?status=...)
// o back já devolve cada empréstimo com o livro, o leitor e o atendente (User) incluídos
// e já marca como ATRASADO os que passaram do prazo antes de devolver a lista (loan.service.js)
// o botão de devolver só aparece nos que ainda não foram devolvidos (returnDate nulo)

import { apiGet } from '@/lib/data';
import { Loan } from '@/lib/types';
import { ui } from '@/lib/ui';
import Link from 'next/link';
import ReturnButton from './ReturnButton';

const filtros = [
  { nome: 'Todos', status: undefined },
  { nome: 'Ativos', status: 'ATIVO' },
  { nome: 'Atrasados', status: 'ATRASADO' },
  { nome: 'Devolvidos', status: 'DEVOLVIDO' },
];

const corDoStatus = {
  ATIVO: 'bg-blue-100 text-blue-800',
  DEVOLVIDO: 'bg-green-100 text-green-800',
  ATRASADO: 'bg-red-100 text-red-800',
};

function formatarData(data: string | null) {
  if (!data) {
    return '-';
  }
  return new Date(data).toLocaleDateString('pt-BR');
}

export default async function EmprestimosPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { status } = await searchParams;

  const loans = await apiGet<Loan[]>('/loans', { status: status || undefined });

  return (
    <main className={ui.page}>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#5C2034]">Empréstimos</h1>
        <Link href="/dashboard/emprestimos/novo" className={ui.button}>
          Novo empréstimo
        </Link>
      </div>

      {/* os links de filtro só trocam o ?status= da URL, o filtro selecionado fica destacado */}
      <div className="mb-4 flex gap-2">
        {filtros.map((filtro) => (
          <Link
            key={filtro.nome}
            href={filtro.status ? `/dashboard/emprestimos?status=${filtro.status}` : '/dashboard/emprestimos'}
            className={status === filtro.status || (!status && !filtro.status) ? `${ui.button} !bg-[#5C2034]` : ui.buttonLight}
          >
            {filtro.nome}
          </Link>
        ))}
      </div>

      <table className={ui.table}>
        <thead>
          <tr>
            <th className={ui.th}>Livro</th>
            <th className={ui.th}>Leitor</th>
            <th className={ui.th}>Empréstimo</th>
            <th className={ui.th}>Prazo</th>
            <th className={ui.th}>Devolução</th>
            <th className={ui.th}>Status</th>
            <th className={ui.th}>Multa</th>
            <th className={ui.th}>Atendente</th>
            <th className={ui.th}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {loans.length === 0 && (
            <tr>
              <td className={ui.td} colSpan={9}>
                Nenhum empréstimo encontrado.
              </td>
            </tr>
          )}
          {loans.map((loan) => (
            <tr key={loan.id}>
              <td className={ui.td}>{loan.Book?.title}</td>
              <td className={ui.td}>{loan.Reader?.name}</td>
              <td className={ui.td}>{formatarData(loan.loanDate)}</td>
              <td className={ui.td}>{formatarData(loan.dueDate)}</td>
              <td className={ui.td}>{formatarData(loan.returnDate)}</td>
              <td className={ui.td}>
                <span className={`rounded px-2 py-1 text-xs font-semibold ${corDoStatus[loan.status]}`}>{loan.status}</span>
              </td>
              <td className={ui.td}>R$ {loan.fine.toFixed(2)}</td>
              <td className={ui.td}>{loan.User?.name}</td>
              <td className={ui.td}>{!loan.returnDate && <ReturnButton id={loan.id} />}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
