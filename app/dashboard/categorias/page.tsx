// essa página NÃO tem "use client", então ela é um Server Component: o código dela roda no servidor do Next, e não no navegador e tambem não precisa escrever "use server" porque o Next já entende que é server por padrão
// por isso a gente pode fazer o axios direto aqui dentro e até usar async/await no próprio componente (nada de useEffect)
// o navegador só recebe o HTML já pronto com a lista de categorias
// a pasta app/dashboard/categorias/page.tsx vira a URL http://localhost:3000/dashboard/categorias (o Next cria a rota pelo nome das pastas)
// e como ela está dentro de /dashboard, o proxy.ts já protege ela: sem sessão válida o usuário é mandado de volta pro login

import { apiGet } from '@/lib/data'; // faz o GET na API mandando o token do cookie (ver lib/data.ts)
import { Category } from '@/lib/types';
import { ui } from '@/lib/ui';
import Link from 'next/link';
import CategoryForm from './CategoryForm';
import DeleteCategoryButton from './DeleteCategoryButton';

export default async function CategoriasPage() {

  // chama a API: GET http://localhost:3001/v1/categories
  // cai no category.router.js -> verifyToken -> categoryController.findAll -> categoryService.findAll -> Category.findAll() no banco
  // o apiGet já cuida do token e, se a API responder 401, manda o usuário pro login
  const categories = await apiGet<Category[]>('/categories');

  // monta a tela. o map percorre o array que veio da API e cria uma linha pra cada categoria
  // o key é obrigatório do React pra ele saber qual item é qual (usamos o id que veio do banco)
  return (
    <main className={ui.page}>
      <h1 className={ui.title}>Categorias</h1>

      {/* o formulário de cadastro é um Client Component separado porque precisa do useActionState */}
      <div className={ui.card}>
        <CategoryForm />
      </div>

      <table className={ui.table}>
        <thead>
          <tr>
            <th className={ui.th}>Nome</th>
            <th className={ui.th}>Descrição</th>
            <th className={ui.th}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td className={ui.td}>{category.name}</td>
              <td className={ui.td}>{category.description}</td>
              <td className={ui.td}>
                <div className="flex items-center gap-3">
                  <Link href={`/dashboard/categorias/${category.id}`} className={ui.link}>
                    Editar
                  </Link>
                  <DeleteCategoryButton id={category.id} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
