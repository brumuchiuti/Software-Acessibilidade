# Declaração de Escopo
## Plataforma Educacional Acessível (White-Label)

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0 | 24/02/2025 | Versão inicial |

---

## 1. Objetivos do Projeto

- **Garantir acessibilidade inclusiva** para surdos (LIBRAS) e neurodivergentes (autistas/dautônicos)
- Oferecer plataforma white-label customizável (logo, cores, textos)
- Centralizar gestão de membros, eventos e formação
- Automatizar ranking e ciclo de aprendizagem
- Publicar oportunidades (estágios, mentorias, cursos)

---

## 2. Escopo do Produto

### 2.1 Acessibilidade (prioridade central)

| Recurso | Descrição |
|---------|-----------|
| **VLibras** | Integração do VLibras Widget (gov.br) para tradução de textos em LIBRAS em todo o site |
| **Modo autista/dautônico** | Toggle global que reduz animações, simplifica layout, mantém previsibilidade e evita estímulos excessivos |
| **WCAG 2.1 AA** | Conformidade mínima com diretrizes de acessibilidade web |
| **Preferência persistente** | Modo acessível salvo em localStorage para retornos ao site |

### 2.2 Funcionalidades Incluídas

#### Área Pública
| Funcionalidade | Descrição |
|----------------|-----------|
| Landing page | Hero, Sobre, Valores, Equipe, Depoimentos, Ciclo de aprendizagem, CTA, Footer (customizável) |
| Páginas de eventos públicos | Visualização e compartilhamento de eventos (`/public/events/[id]`) |
| **VLibras** | Widget para tradução automática português → LIBRAS em todo o site |
| **Modo visual acessível** | Toggle para pessoas autistas e dautônicas (layout simplificado, previsível, reduzido de estímulos) |

#### Autenticação e Cadastro
| Funcionalidade | Descrição |
|----------------|-----------|
| Login / Logout | Autenticação via Supabase Auth |
| Cadastro | Formulário com bio, telefone, LinkedIn, Instagram, avatar |
| Aprovação pendente | Fluxo para novos membros aguardando aprovação da diretoria |
| Recuperação de senha | Esqueci senha e redefinição |

#### Área de Membros (Dashboard)
| Funcionalidade | Descrição |
|----------------|-----------|
| Dashboard home | Pontos, eventos participados, próximos eventos, top membros |
| Eventos | Listagem, detalhe, inscrição, integração com Google Calendar |
| Ranking | Leaderboard, atividades, submissão de atividades |
| Ciclo de aprendizagem | Níveis e tarefas configuráveis, progresso por membro |
| Oportunidades | Listagem de estágios, mentorias, cursos |
| Membros | Diretório de membros aprovados |
| Perfil | Visualização e edição |
| Configurações | Preferências do usuário |

#### Painel Administrativo
| Funcionalidade | Descrição |
|----------------|-----------|
| Métricas | Eventos, membros, presenças |
| CRUD de eventos | Criação, edição, exclusão |
| CRUD de membros | Aprovação, edição, exclusão |
| Presenças | Registro de presença em eventos |
| CRUD de atividades | Criação, edição, aprovação de submissões |
| Ciclo de aprendizagem (admin) | Criação e gestão de níveis e tarefas |
| CRUD de oportunidades | Criação, edição, exclusão |

---

### 2.3 Funcionalidades Excluídas

| Item | Motivo |
|------|--------|
| Aplicativo mobile nativo | Escopo inicial focado em web responsiva |
| Sistema de pagamentos | Não requerido no escopo atual |
| Integração profunda com redes sociais | Apenas links externos |
| CRM ou ERP externo | Gestão interna suficiente |
| Chat em tempo real | Fora do escopo |

---

## 3. Critérios de Aceitação (Resumidos)

### Acessibilidade (prioridade)
- [ ] VLibras Widget disponível e funcional em todo o site
- [ ] Modo acessível ativável e aplicado em todas as páginas
- [ ] Preferência persistente (localStorage)
- [ ] Lighthouse Acessibilidade ≥ 90
- [ ] WCAG 2.1 AA em nível mínimo

### Área Pública
- [ ] Landing carrega em < 3s (LCP)
- [ ] Eventos públicos acessíveis sem login

### Autenticação
- [ ] Cadastro completo com validação
- [ ] Fluxo de aprovação funcional
- [ ] Recuperação de senha operacional

### Dashboard
- [ ] Todas as rotas protegidas exigem login e aprovação
- [ ] Ciclo de aprendizagem com níveis e tarefas
- [ ] Ranking calculado corretamente

### Admin
- [ ] Acesso restrito a papéis administrativos
- [ ] CRUD completo para eventos, membros, atividades, oportunidades

---

## 4. Entregáveis

| # | Entregável | Critério de Conclusão |
|---|------------|------------------------|
| 1 | Plataforma em produção | URL pública e estável |
| 2 | Documentação técnica | README, variáveis de ambiente |
| 3 | Integração VLibras | Widget visível e funcional |
| 4 | Modo acessível | Toggle e estilos aplicados |
| 5 | Base de dados Supabase | Migrações versionadas |

---

## 5. Glossário

| Termo | Definição |
|-------|-----------|
| **VLibras** | Suite de ferramentas de tradução automática português → LIBRAS (Língua Brasileira de Sinais) |
| **Modo autista/dautônico** | Modo de visualização que prioriza previsibilidade, redução de estímulos e layout simplificado |
| **Ciclo de aprendizagem** | Programa de progressão com níveis e tarefas configuráveis |
| **White-label** | Plataforma customizável (logo, cores, textos) para qualquer instituição |

---

## 6. Controle de Mudanças

Alterações nesta declaração de escopo devem ser:
1. Documentadas com justificativa
2. Avaliadas quanto a impacto em prazo e custo
3. Aprovadas pelo patrocinador
4. Versão incrementada neste documento

---

*Documento de referência para o planejamento e execução do projeto.*
