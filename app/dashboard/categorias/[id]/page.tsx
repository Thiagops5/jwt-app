// ===================================================================================================
// TODO: app/dashboard/categorias/[id]/page.tsx - tela de EDITAR categoria
// ===================================================================================================
// os colchetes na pasta [id] fazem o Next criar uma rota dinâmica: /dashboard/categorias/3 cai aqui com params.id = "3"
// no Next 16 o params é uma Promise, então tem que dar await: const { id } = await params
//
// o que precisa ter:
// 1. buscar a categoria: GET /v1/categories/:id (com o token no header, igual no page.tsx da listagem)
//    se a API responder 404 chamar notFound() do next/navigation
// 2. mostrar o mesmo CategoryForm da tela de cadastro, mas já preenchido (mandar a categoria como prop, ex: <CategoryForm category={category} />)
//    então o CategoryForm precisa aceitar uma prop opcional: se vier categoria é edição, se não vier é cadastro
// 3. criar a action updateCategory(id, formData) no actions/category.ts -> PUT /v1/categories/:id com { name, description }
//    (a rota exige admin, atendente recebe 403, e a action tem que mostrar essa mensagem de erro)
// 4. depois de salvar: revalidatePath('/dashboard/categorias') e redirect('/dashboard/categorias')

export default async function EditarCategoriaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Editar categoria {id}</h1>
    </main>
  );
}
