
// essa página NÃO tem "use client", então ela é um Server Component: o código dela roda no servidor do Next, e não no navegador e tambem não precisa escrever "use server" porque o Next já entende que é server por padrão
// por isso a gente pode fazer o axios direto aqui dentro e até usar async/await no próprio componente (nada de useEffect)
// o navegador só recebe o HTML já pronto com a lista de categorias
// a pasta app/dashboard/categorias/page.tsx vira a URL http://localhost:3000/dashboard/categorias (o Next cria a rota pelo nome das pastas)
// e como ela está dentro de /dashboard, o proxy.ts já protege ela: sem cookie "token" o usuário é mandado de volta pro login

import publicApi from '@/lib/api'; // o axios com o baseURL da API (http://localhost:3001/v1)
import { isAxiosError } from 'axios';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import CategoryForm from './CategoryForm';

// o formato de cada categoria que a API devolve (é o mesmo model Category do back: id, name e description)
type Category = {
  id: number;
  name: string;
  description: string | null;
};

export default async function CategoriasPage() {

  // Primeiro. pega o token do cookie (o mesmo que o login.ts gravou)
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  let categories: Category[] = [];
  let sessionExpired = false;

  try {
    // Segundo. chama a API: GET http://localhost:3001/v1/categories
    // cai no category.router.js -> verifyToken -> categoryController.findAll -> categoryService.findAll -> Category.findAll() no banco
    // o get não tem body, então o segundo parâmetro já são as configurações, onde mandamos o Authorization com o token
    // sem esse header o verifyToken do back responde 401 "Token não fornecido"
    const res = await publicApi.get('/categories', {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Terceiro. o axios coloca o JSON que a API devolveu dentro de res.data (aquele res.json(categories) do controller)
    categories = res.data;
  } catch (error) {
    // Quarto. se o access token expirou a API responde 401
    // por enquanto a gente só marca que a sessão acabou e manda o usuário pro login
    // (depois é aqui que entra o refresh token: em vez de mandar pro login, chama o /auth/refresh e tenta de novo)
    if (isAxiosError(error) && error.response?.status === 401) {
      sessionExpired = true;
    } else {
      throw error; // qualquer outro erro (API fora do ar, por exemplo) o Next mostra a tela de erro dele
    }
  }

  // o redirect fica FORA do try/catch porque ele funciona jogando um erro especial, e o catch ia engolir ele
  if (sessionExpired) {
    redirect('/');
  }

  // Quinto. monta a tela. o map percorre o array que veio da API e cria um <li> pra cada categoria
  // o key é obrigatório do React pra ele saber qual item é qual (usamos o id que veio do banco)
  return (
    <main style={{ maxWidth: 380, margin: '80px auto' }}>
      <h1>Categorias</h1>

      {/* o formulário de cadastro é um Client Component separado porque precisa do useActionState */}
      <CategoryForm />

      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            {category.name} - {category.description}
          </li>
        ))}
      </ul>
    </main>
  );
}
