/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { data as navigationData } from '@/navigation/const-data';
import { useAuth } from "@/hooks/auth/use-auth";
import { UserRole } from "@/types/database/users";
import {
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarSearch,
} from 'kbar';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { RenderResults } from './render-result';

export function KBar({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user } = useAuth();

  // 1. Identifica a Role do usuário (padrão colaborador)
  const userRole: UserRole = user?.role ?? "colaborador";

  const navigateTo = (url: string) => {
    router.push(url);
  };

  // 2. Filtra as ações baseado nas permissões (Roles e hideFromRoles)
  const actions = useMemo(() => {
    return navigationData.flatMap((navItem) => {
      // Verifica se o grupo pai é permitido
      const groupHasAccess = navItem.roles?.includes(userRole);
      const groupIsHidden = navItem.hideFromRoles?.includes(userRole);

      // Se o grupo pai for escondido ou não tiver acesso, ignoramos ele e os filhos
      if (groupIsHidden || !groupHasAccess) return [];

      // Filtra os itens internos (filhos)
      const filteredChildren = navItem.items?.filter((child) => {
        const hasAccess = child.roles?.includes(userRole);
        const isHidden = child.hideFromRoles?.includes(userRole);
        return hasAccess && !isHidden;
      }) ?? [];

      // Cria a ação do item pai (se ele tiver uma URL válida e não for apenas container)
      const baseAction = navItem.url !== '#' ? [{
        id: `${navItem.title.toLowerCase()}Action`,
        name: navItem.title,
        keywords: navItem.title.toLowerCase(),
        section: 'Navegação Principal',
        subtitle: `Ir para ${navItem.title}`,
        perform: () => navigateTo(navItem.url),
      }] : [];

      // Mapeia os filhos permitidos para o formato da KBar
      const childActions = filteredChildren.map((childItem) => ({
        id: `${childItem.title.toLowerCase()}Action`,
        name: childItem.title,
        keywords: childItem.title.toLowerCase(),
        section: navItem.title, // Agrupa pela seção do Pai
        subtitle: `Ir para ${childItem.title}`,
        perform: () => navigateTo(childItem.url),
      }));

      return [...baseAction, ...childActions];
    });
  }, [userRole, navigationData]);

  return (
    <KBarProvider actions={actions}>
      <KBarComponent>{children}</KBarComponent>
    </KBarProvider>
  );
}

const KBarComponent = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <KBarPortal>
        <KBarPositioner className="scrollbar-hide z-9999 bg-black/40 p-0 backdrop-blur-sm">
          <KBarAnimator className="relative mt-[5vh] w-full max-w-150 -translate-y-12 overflow-hidden rounded-xl border bg-background text-foreground shadow-2xl">
            <div className="bg-background">
              <div className="border-b">
                <KBarSearch 
                  placeholder="Pesquisar rotas e ferramentas..."
                  className="w-full border-none bg-background px-6 py-4 text-lg outline-none focus:ring-0" 
                />
              </div>
              <RenderResults />
            </div>
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </>
  );
};