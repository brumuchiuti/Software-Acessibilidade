# EAP / WBS – Estrutura Analítica do Projeto
## Plataforma Educacional Acessível (White-Label)

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0 | 24/02/2025 | Versão inicial |

---

## Legenda

- **1.x** = Pacote de trabalho / Fase
- **1.1.1** = Atividade / tarefa
- **[M]** = Marco
- **(Opc)** = Opcional ou condicional

---

## EAP Completa

```
1.0 IFL Jovem SP – Plataforma Web
│
├── 1.1 Planejamento e Inicialização
│   ├── 1.1.1 Elaborar TAP (Termo de Abertura)
│   ├── 1.1.2 Definir declaração de escopo
│   ├── 1.1.3 Elaborar EAP/WBS
│   ├── 1.1.4 Definir cronograma e marcos
│   └── 1.1.5 [M] Aprovação do plano
│
├── 1.2 Infraestrutura e Configuração
│   ├── 1.2.1 Configurar projeto Next.js e TypeScript
│   ├── 1.2.2 Configurar Supabase (Auth, DB)
│   ├── 1.2.3 Configurar variáveis de ambiente
│   ├── 1.2.4 Configurar deploy (Vercel)
│   └── 1.2.5 Executar migrações iniciais
│
├── 1.3 Autenticação e Autorização
│   ├── 1.3.1 Implementar login/logout
│   ├── 1.3.2 Implementar cadastro com perfil completo
│   ├── 1.3.3 Implementar fluxo de aprovação de membros
│   ├── 1.3.4 Implementar recuperação de senha
│   ├── 1.3.5 Implementar middleware de proteção de rotas
│   └── 1.3.6 Implementar controle de roles (board_role)
│
├── 1.4 Landing Page e Área Pública
│   ├── 1.4.1 Desenvolver layout e header/footer
│   ├── 1.4.2 Desenvolver seção Hero
│   ├── 1.4.3 Desenvolver seção Sobre
│   ├── 1.4.4 Desenvolver seção Valores
│   ├── 1.4.5 Desenvolver seção Diretoria
│   ├── 1.4.6 Desenvolver seção Depoimentos
│   ├── 1.4.7 Desenvolver seção Ciclo de aprendizagem
│   ├── 1.4.8 Desenvolver seção CTA
│   ├── 1.4.9 Desenvolver páginas públicas de eventos
│   └── 1.4.10 Integrar VLibras Widget na landing
│
├── 1.5 Dashboard – Área de Membros
│   ├── 1.5.1 Desenvolver layout do dashboard (sidebar, nav)
│   ├── 1.5.2 Desenvolver página home (resumo, pontos, próximos eventos)
│   ├── 1.5.3 Desenvolver listagem e detalhe de eventos
│   ├── 1.5.4 Implementar inscrição em eventos
│   ├── 1.5.5 Implementar integração Google Calendar
│   ├── 1.5.6 Desenvolver ranking e leaderboard
│   ├── 1.5.7 Implementar submissão de atividades
│   ├── 1.5.8 Desenvolver Ciclo de aprendizagem (níveis, tarefas, progresso)
│   ├── 1.5.9 Desenvolver páginas de oportunidades
│   ├── 1.5.10 Desenvolver diretório de membros
│   ├── 1.5.11 Desenvolver perfil e edição
│   └── 1.5.12 Desenvolver configurações
│
├── 1.6 Painel Administrativo
│   ├── 1.6.1 Desenvolver home admin (métricas)
│   ├── 1.6.2 CRUD de eventos
│   ├── 1.6.3 CRUD de membros e aprovação
│   ├── 1.6.4 Registro de presenças
│   ├── 1.6.5 CRUD de atividades e aprovação de submissões
│   ├── 1.6.6 CRUD de níveis e tarefas do Ciclo de aprendizagem
│   └── 1.6.7 CRUD de oportunidades
│
├── 1.7 Acessibilidade Inclusiva
│   ├── 1.7.1 Integrar VLibras Widget (todo o site)
│   │   ├── 1.7.1.1 Adicionar script do widget
│   │   ├── 1.7.1.2 Configurar inicialização
│   │   └── 1.7.1.3 Validar tradução em páginas principais
│   │
│   └── 1.7.2 Implementar modo visual para autistas/dautônicos
│       ├── 1.7.2.1 Definir especificação do modo (previsibilidade, redução de estímulos)
│       ├── 1.7.2.2 Criar toggle de ativação (global)
│       ├── 1.7.2.3 Reduzir/desabilitar animações
│       ├── 1.7.2.4 Simplificar layout e cores
│       ├── 1.7.2.5 Garantir navegação previsível
│       └── 1.7.2.6 Persistir preferência (localStorage/contexto)
│
├── 1.8 Qualidade e Homologação
│   ├── 1.8.1 Testes funcionais (fluxos principais)
│   ├── 1.8.2 Testes de acessibilidade (Lighthouse, axe)
│   ├── 1.8.3 Testes com VLibras e modo neurodivergente
│   ├── 1.8.4 Correção de bugs
│   └── 1.8.5 [M] Homologação aprovada
│
└── 1.9 Implantação e Encerramento
    ├── 1.9.1 Deploy em produção
    ├── 1.9.2 Validação pós-deploy
    ├── 1.9.3 Documentação final (README, env)
    └── 1.9.4 [M] Go-live
```

---

## Tabela Resumida da EAP

| ID | Nome | Tipo | Responsável |
|----|------|------|-------------|
| 1.0 | Plataforma Educacional Acessível | Projeto | GP |
| 1.1 | Planejamento e Inicialização | Pacote | GP |
| 1.2 | Infraestrutura e Configuração | Pacote | Dev |
| 1.3 | Autenticação e Autorização | Pacote | Dev |
| 1.4 | Landing Page e Área Pública | Pacote | Dev |
| 1.5 | Dashboard – Área de Membros | Pacote | Dev |
| 1.6 | Painel Administrativo | Pacote | Dev |
| 1.7 | Acessibilidade Inclusiva | Pacote | Dev |
| 1.8 | Qualidade e Homologação | Pacote | QA |
| 1.9 | Implantação e Encerramento | Pacote | DevOps/Dev |

---

## Detalhamento 1.7 – Acessibilidade Inclusiva

### 1.7.1 VLibras
- **Objetivo:** Permitir que pessoas surdas acessem o conteúdo em LIBRAS
- **Fonte:** [VLibras Widget](https://vlibras.gov.br/doc/widget/) – gov.br
- **Forma de integração:** Inclusão do script oficial e inicialização no layout raiz
- **Cobertura:** Todas as páginas (públicas e autenticadas)

### 1.7.2 Modo Visual para Autistas e Dautônicos
- **Objetivo:** Reduzir sobrecarga sensorial e cognitiva
- **Referências:** Guia GAIA, diretrizes de previsibilidade
- **Funcionalidades planejadas:**
  - Botão/toggle global para ativar/desativar
  - Redução ou desativação de animações (CSS, JS)
  - Layout mais limpo (menos elementos por tela)
  - Cores neutras e contraste adequado
  - Navegação consistente (mesmo padrão em todas as telas)
  - Sem sons automáticos ou elementos intermitentes
- **Persistência:** Preferência salva em `localStorage` ou contexto da aplicação

---

## Mapeamento EAP × Cronograma

| Pacote EAP | Corresponde ao Gantt |
|------------|----------------------|
| 1.1 | Atividade 1 (Planejamento) |
| 1.2 | Atividade 2 (Infraestrutura) |
| 1.3 | Atividade 4 (Auth) |
| 1.4 | Atividades 5 + 10 (Landing + VLibras na landing) |
| 1.5 | Atividades 6, 7, 9 (Dashboard, Ranking, Oportunidades) |
| 1.6 | Atividade 11 (Admin) |
| 1.7 | Atividades 12 e 13 (VLibras completo + Modo Neuro) |
| 1.8 | Atividade 14 (QA) |
| 1.9 | Atividade 16 (Deploy) |

---

*EAP utilizada para planejamento detalhado e controle do projeto.*
