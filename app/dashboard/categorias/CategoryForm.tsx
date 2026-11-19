'use client'; // roda no navegador, não no servidor
// o "use client" e o "user service" mostra em que lugar ele roda: no navegador (client) ou no servidor (server). o client é o que o usuário vê, e o server é o que ele não vê. a gente só usa server quando precisa do token do cookie, que é secreto e não pode ir pro navegador
// e a gente precisa disso aqui porque o useActionState é um hook do React (hooks só funcionam em componente client)
// é o mesmo esquema da tela de login do app/page.tsx ()

import { createCategory } from '@/actions/category';
import { useActionState } from 'react';

export default function CategoryForm() {

  // o useActionState devolve 3 coisas:
  // state = o que a server action retornou da última vez (aqui é o { error: ... })
  // formAction = a função que a gente coloca no action do <form> (ela chama o createCategory lá no servidor)
  // isPending = true enquanto o servidor ainda está processando (serve pra desabilitar o botão e não clicar 2 vezes)
  // o segundo parâmetro { error: null } é o estado inicial, antes de enviar qualquer coisa
  const [state, formAction, isPending] = useActionState(createCategory, {
    error: null,
  });

  return (
    // no action a gente não usa fetch nem axios: o React pega os campos do formulário (pelo atributo name),
    // monta o FormData sozinho e manda pro createCategory. por isso os inputs precisam do name="name" e name="description"
    <form action={formAction}>
      <label htmlFor="name">Nome</label>
      <input id="name" name="name" type="text" required />

      <label htmlFor="description">Descrição</label>
      <input id="description" name="description" type="text" />

      <button disabled={isPending} type="submit">
        {isPending ? 'Salvando...' : 'Cadastrar'}
      </button>

      {/* se a server action devolveu um erro (ex: nome repetido ou atendente tentando criar), aparece aqui */}
      {state.error && <p style={{ color: 'red' }}>{state.error}</p>}
    </form>
  );
}
