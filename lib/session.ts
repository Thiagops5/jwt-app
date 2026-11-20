// aqui fica tudo que mexe com os cookies da sessão (token e refreshToken) num lugar só, pra não repetir as mesmas opções em cada action
// os dois cookies são httpOnly, ou seja, o JavaScript do navegador não consegue ler (protege o token de um ataque XSS)
// e o sameSite lax ajuda a barrar CSRF, que seria outro site mandando requisição usando o nosso cookie
// já o localStorage seria lido por qualquer script malicioso, por isso a escolha pelo cookie (essa explicação vai pro README do front)
import { cookies } from 'next/headers';

export const TOKEN_COOKIE = 'token';
export const REFRESH_COOKIE = 'refreshToken';

// o maxAge do cookie é em segundos, e tem que bater com a validade que o back-end deu pro token
// access token dura 15 minutos e o refresh token dura 7 dias (auth.service.js)
export const TOKEN_MAX_AGE = 60 * 15;
export const REFRESH_MAX_AGE = 60 * 60 * 24 * 7;

// opções iguais pros dois cookies, só muda o tempo de vida
export function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: true,
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  };
}

// só funciona dentro de uma server action ou route handler, porque uma page.tsx só consegue ler cookie e não gravar
export async function saveSession(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_COOKIE, accessToken, cookieOptions(TOKEN_MAX_AGE));
  cookieStore.set(REFRESH_COOKIE, refreshToken, cookieOptions(REFRESH_MAX_AGE));
}

export async function getAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_COOKIE)?.value;
}

export async function getRefreshToken() {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_COOKIE)?.value;
}

// apaga os dois cookies, usado no logout
export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_COOKIE);
  cookieStore.delete(REFRESH_COOKIE);
}
