// tela do leitor: edita os dados e mostra o histórico de empréstimos dele
// GET /readers/:id traz o leitor e GET /readers/:id/loans traz os empréstimos, já com o livro incluído
// o back também atualiza pra ATRASADO os empréstimos vencidos antes de devolver a lista
// as duas buscas rodam juntas com o Promise.all

import { apiGet } from '@/lib/data';
import { Loan, Reader } from '@/lib/types';
import { ui } from '@/lib/ui';
import Link from 'next/link';
import ReaderForm from '../ReaderForm';

// cor do status pra bater o olho e saber a situação do empréstimo
const corDoStatus = {
  ATIVO: 'bg-blue-100 text-blue-800',
  DEVOLVIDO: 'bg-green-100 text-green-800',
  ATRASADO: 'bg-red-100 text-red-800',
};

// as datas chegam no formato do banco (2026-11-23T19:21:35.927Z), aqui viram dd/mm/aaaa
function formatarData(data: string | null) {
  if (!data) {
    return '-';
  }
  return new Date(data).toLocaleDateString('pt-BR');
}

export default async function LeitorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [reader, loans] = await Promise.all([
    apiGet<Reader>(`/readers/${id}`),
    apiGet<Loan[]>(`/readers/${id}/loans`),
  ]);

  return (
    <main className={ui.page}>
      <h1 className={ui.title}>Leitor: {reader.name}</h1>

      <div className={ui.card}>
        <ReaderForm reader={reader} />
      </div>

      <h2 className="mb-3 text-xl font-semibold text-[#5C2034]">Histórico de empréstimos</h2>

      <table className={ui.table}>
        <thead>
          <tr>
            <th className={ui.th}>Livro</th>
            <th className={ui.th}>Empréstimo</th>
            <th className={ui.th}>Prazo</th>
            <th className={ui.th}>Devolução</th>
            <th className={ui.th}>Status</th>
            <th className={ui.th}>Multa</th>
          </tr>
        </thead>
        <tbody>
          {loans.length === 0 && (
            <tr>
              <td className={ui.td} colSpan={6}>
                Esse leitor ainda não tem empréstimos.
              </td>
            </tr>
          )}
          {loans.map((loan) => (
            <tr key={loan.id}>
              <td className={ui.td}>{loan.Book?.title}</td>
              <td className={ui.td}>{formatarData(loan.loanDate)}</td>
              <td className={ui.td}>{formatarData(loan.dueDate)}</td>
              <td className={ui.td}>{formatarData(loan.returnDate)}</td>
              <td className={ui.td}>
                <span className={`rounded px-2 py-1 text-xs font-semibold ${corDoStatus[loan.status]}`}>{loan.status}</span>
              </td>
              <td className={ui.td}>R$ {loan.fine.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4">
        <Link href="/dashboard/leitores" className={ui.link}>
          Voltar para a lista
        </Link>
      </div>
    </main>
  );
}
