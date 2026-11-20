'use client'; // roda no navegador, não no servidor
// o "use client" e o "user service" mostra em que lugar ele roda: no navegador (client) ou no servidor (server). o client é o que o usuário vê, e o server é o que ele não vê. a gente só usa server quando precisa do token do cookie, que é secreto e não pode ir pro navegador
// e a gente precisa disso aqui porque o useActionState é um hook do React (hooks só funcionam em componente client)
// é o mesmo esquema da tela de login do app/page.tsx ()
// esse mesmo formulário serve pra cadastrar e pra editar: se vier a prop category é edição, se não vier é cadastro

import { createCategory, updateCategory } from '@/actions/category';
import { Category } from '@/lib/types';
import { ui } from '@/lib/ui';
import { useActionState } from 'react';

export default function CategoryForm({ category }: { category?: Category }) {

  // na edição a gente usa o bind pra já mandar o id da categoria como primeiro parâmetro da action
  // por isso a updateCategory(id, _prevState, formData) vira (_prevState, formData) igual a createCategory
  const action = category ? updateCategory.bind(null, category.id) : createCategory;

  // o useActionState devolve 3 coisas:
  // state = o que a server action retornou da última vez (aqui é o { error: ... })
  // formAction = a função que a gente coloca no action do <form> (ela chama a action lá no servidor)
  // isPending = true enquanto o servidor ainda está processando (serve pra desabilitar o botão e não clicar 2 vezes)
  // o segundo parâmetro { error: null } é o estado inicial, antes de enviar qualquer coisa
  const [state, formAction, isPending] = useActionState(action, {
    error: null,
  });

  return (
    // no action a gente não usa fetch nem axios: o React pega os campos do formulário (pelo atributo name),
    // monta o FormData sozinho e manda pra action. por isso os inputs precisam do name="name" e name="description"
    <form action={formAction} className={ui.form}>
      <label htmlFor="name" className={ui.label}>
        Nome
        <input id="name" name="name" type="text" required defaultValue={category?.name} className={ui.input} />
      </label>

      <label htmlFor="description" className={ui.label}>
        Descrição
        <input id="description" name="description" type="text" defaultValue={category?.description ?? ''} className={ui.input} />
      </label>

      <div className="flex items-center gap-3 sm:col-span-2">
        <button disabled={isPending} type="submit" className={ui.button}>
          {isPending ? 'Salvando...' : category ? 'Salvar alterações' : 'Cadastrar'}
        </button>

        {/* se a server action devolveu um erro (ex: nome repetido ou atendente tentando criar), aparece aqui */}
        {state.error && <p className={ui.error}>{state.error}</p>}
      </div>
    </form>
  );
}
