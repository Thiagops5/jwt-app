// listagem e cadastro de leitores
// rota da API: GET /v1/readers (admin e atendente podem)
// cada leitor tem link pra tela dele, onde dá pra editar e ver o histórico de empréstimos

import { apiGet } from '@/lib/data';
import { Reader } from '@/lib/types';
import { ui } from '@/lib/ui';
import Link from 'next/link';
import ReaderForm from './ReaderForm';

export default async function LeitoresPage() {
  const readers = await apiGet<Reader[]>('/readers');

  return (
    <main className={ui.page}>
      <h1 className={ui.title}>Leitores</h1>

      <div className={ui.card}>
        <ReaderForm />
      </div>

      <table className={ui.table}>
        <thead>
          <tr>
            <th className={ui.th}>Nome</th>
            <th className={ui.th}>CPF</th>
            <th className={ui.th}>E-mail</th>
            <th className={ui.th}>Telefone</th>
            <th className={ui.th}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {readers.map((reader) => (
            <tr key={reader.id}>
              <td className={ui.td}>{reader.name}</td>
              <td className={ui.td}>{reader.cpf}</td>
              <td className={ui.td}>{reader.email}</td>
              <td className={ui.td}>{reader.phone}</td>
              <td className={ui.td}>
                <Link href={`/dashboard/leitores/${reader.id}`} className={ui.link}>
                  Editar / Histórico
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
