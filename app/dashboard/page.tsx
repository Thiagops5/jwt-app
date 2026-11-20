// tela inicial do dashboard com os cards de totais (GET /reports/dashboard)
// essa rota é só pra admin (verifyAdmin no back), então se um atendente entrar a API responde 403
// nesse caso a gente não derruba a página, só mostra uma mensagem no lugar dos cards
// os números já vêm calculados do back: livros, exemplares, empréstimos ativos, atrasados e multas

import { apiGet } from '@/lib/data';
import { DashboardData } from '@/lib/types';
import { ui } from '@/lib/ui';
import { isAxiosError } from 'axios';

function Card({ titulo, valor }: { titulo: string; valor: string | number }) {
  return (
    <div className="rounded border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">{titulo}</p>
      <p className="mt-1 text-3xl font-bold text-[#5C2034]">{valor}</p>
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
      <h1 className={ui.title}>Dashboard</h1>

      {!data && <p>Apenas administradores podem ver os totais do sistema. Use o menu do topo pra cadastrar leitores e registrar empréstimos.</p>}

      {data && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card titulo="Total de livros" valor={data.totalBooks} />
          <Card titulo="Exemplares disponíveis" valor={`${data.availableCopies} de ${data.totalCopies}`} />
          <Card titulo="Empréstimos ativos" valor={data.activeLoans} />
          <Card titulo="Empréstimos atrasados" valor={data.overdueLoans} />
          <Card titulo="Total de multas" valor={`R$ ${data.totalFines.toFixed(2)}`} />
        </div>
      )}
    </main>
  );
}
