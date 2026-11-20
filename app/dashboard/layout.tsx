import Menu from '@/components/Menu';
import { Suspense } from 'react';

// esse layout vale pra todas as telas dentro de /dashboard, então o menu aparece em todas elas
// o Menu lê o cookie do usuário (pra buscar o /auth/me), e com o cacheComponents ligado no next.config.ts
// qualquer coisa que lê cookie precisa estar dentro de um Suspense, senão o Next reclama no build
// o fallback é só a barra vazia que aparece enquanto o menu carrega
export default function DashboardLayout({children}: {children: React.ReactNode}) {
  return (
    <>
      <Suspense fallback={<div className="h-14 bg-[#C22820]" />}>
        <Menu />
      </Suspense>
      {/* as páginas também leem cookie, por isso o conteúdo também fica num Suspense */}
      <Suspense fallback={<p className="p-6">Carregando...</p>}>{children}</Suspense>
    </>
  );
}
