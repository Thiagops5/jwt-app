// tela de editar categoria. a pasta [id] com colchetes cria uma rota dinâmica: /dashboard/categorias/3 cai aqui com id = "3"
// no Next 16 o params é uma Promise, por isso o await
// busca só uma categoria (GET /categories/:id) e abre o mesmo formulário do cadastro, já preenchido
// se a categoria não existir o apiGet abre a página de não encontrado (404)

import { apiGet } from '@/lib/data';
import { Category } from '@/lib/types';
import { ui } from '@/lib/ui';
import Link from 'next/link';
import CategoryForm from '../CategoryForm';

export default async function EditarCategoriaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await apiGet<Category>(`/categories/${id}`);

  return (
    <main className={ui.page}>
      <h1 className={ui.title}>Editar categoria</h1>

      <div className={ui.card}>
        <CategoryForm category={category} />
      </div>

      <Link href="/dashboard/categorias" className={ui.link}>
        Voltar para a lista
      </Link>
    </main>
  );
}
