// aqui é a renovação do token (POST /auth/refresh) sem deixar sair duas chamadas ao mesmo tempo
// o motivo: lá no back o refresh token é rotativo, cada refresh revoga o token antigo
// se duas requisições mandassem o mesmo refresh token, a segunda ia parecer um token roubado sendo reutilizado
// e o back revogaria TODOS os tokens do usuário (auth.service.js), deslogando a pessoa
//
// pra resolver, guardamos num Map a promise do refresh que está em andamento (a chave é o próprio refresh token)
// quem chega depois com o mesmo refresh token não chama a API de novo, só espera a mesma promise (essa é a fila)
// quando termina a gente tira do Map pra próxima renovação funcionar normal
import publicApi from '@/lib/api';

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

const refreshing = new Map<string, Promise<Tokens | null>>();

async function callRefresh(refreshToken: string): Promise<Tokens | null> {
  try {
    const res = await publicApi.post('/auth/refresh', { refreshToken });
    return {
      accessToken: res.data.accessToken,
      refreshToken: res.data.refreshToken,
    };
  } catch {
    // refresh inválido, expirado ou revogado (401), aí a sessão acabou e o usuário tem que logar de novo
    return null;
  }
}

export function refreshTokens(refreshToken: string): Promise<Tokens | null> {
  const emAndamento = refreshing.get(refreshToken);
  if (emAndamento) {
    return emAndamento;
  }

  // o resultado fica guardado por 30 segundos e só depois sai do Map
  // isso porque o navegador pode mandar mais uma requisição ainda com o cookie antigo logo depois da renovação,
  // e sem isso ela chamaria o refresh com um token já revogado e o back ia achar que é roubo de token
  const promise = callRefresh(refreshToken).finally(() => {
    setTimeout(() => refreshing.delete(refreshToken), 30_000);
  });
  refreshing.set(refreshToken, promise);
  return promise;
}

// lê o campo exp (em segundos) do payload do JWT sem precisar da chave secreta
// aqui a gente não valida o token, só quer saber se está perto de vencer, quem valida de verdade é o back-end
export function tokenExpiraEm(token: string): number | null {
  try {
    const payload = token.split('.')[1];
    const json = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
    return typeof json.exp === 'number' ? json.exp : null;
  } catch {
    return null;
  }
}

// considera vencido se faltam menos de 10 segundos, pra não correr o risco de o token vencer no meio da requisição
export function tokenVencido(token: string): boolean {
  const exp = tokenExpiraEm(token);
  if (exp === null) {
    return true;
  }
  return exp * 1000 - Date.now() < 10_000;
}
