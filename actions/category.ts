'use server'; //somente no servidor

// o "use server" lá em cima avisa o Next que esse arquivo roda SÓ no servidor do Next (node), nunca no navegador
// ou seja, o axios, o cookie e o token que aparecem aqui o usuário nunca vê na aba Network do navegador
// o navegador só manda o formulário pro Next, e o Next é quem chama a nossa API (jwt-api) por trás dos panos
//
// o caminho completo de uma requisição fica assim:
// navegador (formulário) -> server action (esse arquivo, porta 3000) -> axios -> jwt-api (porta 3001) -> banco SQLite
// e a resposta volta pelo mesmo caminho ao contrário

import publicApi from '@/lib/api'; // essa parte é o axios que puxa a URL da API do back-end  e devolve o que a gente quer
import { isAxiosError } from 'axios'; 
import { cookies } from 'next/headers'; // é como a gente lê o cookie "token" que o login.ts gravou
import { revalidatePath } from 'next/cache'; // manda o Next jogar fora a página antiga e buscar os dados de novo
import { redirect } from 'next/navigation';

// o useActionState (lá no CategoryForm) manda 2 coisas pra essa função: o estado anterior e o formulário preenchido
// o _prevState tem o underline porque a gente não usa ele, mas ele PRECISA estar ali na frente senão o formData vira o primeiro parâmetro e quebra tudo
export async function createCategory(_prevState: { error: null | string }, formData: FormData) {

  // 1. pega o que o usuário digitou. o "name" e "description" são os atributos name="" dos inputs do formulário
  // (é o mesmo esquema do email e password lá no login.ts)
  const name = formData.get('name');
  const description = formData.get('description');

  // 2. pega o token que ficou guardado no cookie quando o usuário fez login
  // o cookie foi criado no login.ts com cookieStore.set('token', ...) e o navegador manda ele automaticamente pro Next a cada requisição
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  try {
    // 3. aqui é a "conexão" de verdade: o axios faz um POST pra http://localhost:3001/v1/categories
    // o segundo parâmetro é o body (o JSON que o categoryController.create recebe no req.body lá no back-end)
    // o terceiro parâmetro são as configurações, e é aqui que vai o header Authorization
    // atravez do authMiddleware.verifyToken do backend, ele lê exatamente esse "Authorization: Bearer <token>" pra saber quem é o usuário
    // como a rota de criar categoria também tem o verifyAdmin, se um atendente tentar a API responde 403
    await publicApi.post(
      '/categories',
      { name, description },
      { headers: { Authorization: `Bearer ${token}` } },
    );
  } catch (error) {
    // 4. se a API respondeu com erro (400, 401, 403...) o axios joga cai aqui no catch
    // lá no back a gente sempre responde res.status(...).json({ error: error.message }), por isso o erro está em response.data.error
    // (e não em response.data.message, que é o que o login.ts usa e por isso a mensagem de erro do login nunca aparece kkkkk)
    if (isAxiosError(error)) {
      return { error: error.response?.data?.error || 'Erro ao cadastrar categoria' };
    }
    return { error: 'Erro ao cadastrar categoria' };
  }


  // quando tudo dá certo, o revalidatePath fala pro Next "essa página ficou velha, busca tudo de novo na API" e a lista já atualiza com a categoria nova
  revalidatePath('/dashboard/categorias');

  // devolve o estado novo pro useActionState (sem erro). é isso que o formulário recebe de volta
  return { error: null };
}


export async function updateCategory( id: number, _prevState:{ error: null | string}, formData: FormData) {
  const name = formData.get('name');
  const description = formData.get('description');

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  
  try {
    await publicApi.put(
      `/categories/${id}`,
      {name, description},
      { headers: { Authorization: `Bearer ${token}` } },
    );
  } catch (error) {
    if (isAxiosError(error)) {
      return { error: error.response?.data?.error || 'Erro ao alterar a categoria' };
    }
    return { error: 'Erro ao alterar a categoria' };

  }
  revalidatePath('/dashboard/categorias');
  redirect('/dashboard/categorias');
}

 export async function deleteCategory(id: number) {

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  try {
    await publicApi.delete(
      `/categories/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
    );
  } catch (error) {
    if (isAxiosError(error)) {
      return { error: error.response?.data?.error || 'Erro ao deletar a categoria' };
    }
    return { error: 'Erro ao deletar a categoria' };

  }
  revalidatePath('/dashboard/categorias');
  return { error: null };
}