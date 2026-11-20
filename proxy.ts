import { refreshTokens, tokenVencido } from '@/lib/refresh';
import { REFRESH_COOKIE, REFRESH_MAX_AGE, TOKEN_COOKIE, TOKEN_MAX_AGE, cookieOptions } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';

// o proxy roda antes de qualquer página de /dashboard (ver o matcher lá embaixo)
// ele faz duas coisas: barra quem não está logado e renova o token quando ele está perto de vencer
// é aqui que a renovação acontece porque uma page.tsx não consegue gravar cookie, mas o proxy consegue
export async function proxy(req: NextRequest) {
  const token = req.cookies.get(TOKEN_COOKIE)?.value;
  const refreshToken = req.cookies.get(REFRESH_COOKIE)?.value;

  // token ainda válido, deixa a página abrir normal
  if (token && !tokenVencido(token)) {
    return NextResponse.next();
  }

  // sem refresh token não tem como renovar, então volta pro login
  if (!refreshToken) {
    return voltarParaLogin(req);
  }

  // o token venceu (ou o cookie dele expirou), tenta renovar o par de tokens com o refresh token
  const tokens = await refreshTokens(refreshToken);
  if (!tokens) {
    // refresh inválido, expirado ou revogado, limpa a sessão e manda pro login
    return voltarParaLogin(req);
  }

  // coloca o token novo na requisição que está em andamento, assim a página já enxerga o token novo no cookie
  req.cookies.set(TOKEN_COOKIE, tokens.accessToken);
  req.cookies.set(REFRESH_COOKIE, tokens.refreshToken);
  const response = NextResponse.next({ request: { headers: new Headers(req.headers) } });

  // e grava os cookies novos no navegador pras próximas requisições
  response.cookies.set(TOKEN_COOKIE, tokens.accessToken, cookieOptions(TOKEN_MAX_AGE));
  response.cookies.set(REFRESH_COOKIE, tokens.refreshToken, cookieOptions(REFRESH_MAX_AGE));
  return response;
}

function voltarParaLogin(req: NextRequest) {
  const response = NextResponse.redirect(new URL('/', req.url));
  response.cookies.delete(TOKEN_COOKIE);
  response.cookies.delete(REFRESH_COOKIE);
  return response;
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
