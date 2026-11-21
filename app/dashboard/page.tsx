// tela inicial do dashboard com os cards de totais (GET /reports/dashboard)
// essa rota é só pra admin (verifyAdmin no back), então se um atendente entrar a API responde 403
// nesse caso a gente não derruba a página, só mostra uma mensagem e os atalhos pras telas do atendente
// os números já vêm calculados do back: livros, exemplares, empréstimos ativos, atrasados e multas

import { apiGet } from '@/lib/data';
import { DashboardData } from '@/lib/types';
import { ui } from '@/lib/ui';
import { isAxiosError } from 'axios';
import Link from 'next/link';

function Card({
  titulo,
  valor,
  destaque,
}: {
  titulo: string;
  valor: string | number;
  destaque?: boolean;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{titulo}</p>
      <p className={`mt-2 text-3xl font-bold ${destaque ? 'text-[#C22820]' : 'text-[#5C2034]'}`}>
        {valor}
      </p>
    </div>
  );
}

export default async function Dashboard() {
  let data: DashboardData | null = null;

  try {
    data = await apiGet<DashboardData>('/reports/dashboard');
  } catch (error) {
    if (!(isAxiosError(error) && error.response?.status === 403)) {
      throw error;
    }
  }

  return (
    <main className={ui.page}>
      <h1 className={ui.title}>Resumo da Biblioteca</h1>

      {!data && (
        <div className={ui.card}>
          <p className="text-sm text-gray-700">
            Bem-vindo! Use os atalhos abaixo ou o menu superior para consultar o acervo, cadastrar
            leitores e registrar empréstimos e devoluções.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/dashboard/emprestimos/novo" className={ui.button}>
              Novo empréstimo
            </Link>
            <Link href="/dashboard/leitores" className={ui.buttonLight}>
              Cadastrar leitor
            </Link>
            <Link href="/dashboard/livros" className={ui.buttonLight}>
              Consultar acervo
            </Link>
          </div>
        </div>
      )}

      {data && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card titulo="Títulos cadastrados" valor={data.totalBooks} />
          <Card
            titulo="Exemplares disponíveis"
            valor={`${data.availableCopies} de ${data.totalCopies}`}
          />
          <Card titulo="Empréstimos ativos" valor={data.activeLoans} />
          <Card
            titulo="Empréstimos em atraso"
            valor={data.overdueLoans}
            destaque={data.overdueLoans > 0}
          />
          <Card
            titulo="Total em multas"
            valor={`R$ ${data.totalFines.toFixed(2)}`}
            destaque={data.totalFines > 0}
          />
        </div>
      )}
    </main>
  );
}
