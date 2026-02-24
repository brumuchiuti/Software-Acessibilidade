# TAP – Termo de Abertura do Projeto / GDD1
## Plataforma Educacional Acessível (White-Label)

| Campo | Conteúdo |
|-------|----------|
| **Versão** | 1.0 |
| **Data** | 24/02/2025 |
| **Status** | Em aprovação |
| **Grupo** | ABE |
| **Preparado por** | Arthur Silva Santana, Bruna Aguiar Muchiuti, Enzo Ribeiro, Thomas Pinheiro Grandin |

---

## 1. Nome e Descrição do Projeto

| Item | Descrição |
|------|-----------|
| **Nome** | Plataforma Educacional Acessível |
| **Sigla / Código** | EDU-PLAT |
| **Descrição** | Plataforma web white-label para educação e formação, com gestão de membros, ciclo de aprendizagem, ranking e oportunidades. **Foco central em acessibilidade inclusiva** para pessoas surdas (LIBRAS) e neurodivergentes (autistas e dautônicos). |

---

## 2. Propósito e Justificativa

### Caso de negócios
Organizações educacionais necessitam de uma plataforma centralizada e **acessível** que permita:

- **Inclusão digital** para pessoas surdas (via LIBRAS) e neurodivergentes (via modo de visualização adaptado)
- Gestão de membros, eventos e atividades formativas
- Ciclo de aprendizagem com níveis e progressão
- Publicação de oportunidades (estágios, mentorias, cursos)
- Ranking e gamificação para engajamento

### Diferencial
A acessibilidade não é um recurso secundário — é o **núcleo** da plataforma. VLibras e modo visual para autistas/dautônicos são entregas prioritárias, garantindo que qualquer instituição possa oferecer formação inclusiva.

---

## 3. Objetivos do Projeto (SMART)

| # | Objetivo | Métrica de sucesso |
|---|----------|-------------------|
| 1 | **Acessibilidade para surdos** | VLibras integrado e funcional em todo o site |
| 2 | **Acessibilidade para neurodivergentes** | Modo visual (autistas/dautônicos) com previsibilidade e redução de estímulos |
| 3 | **Conformidade WCAG** | Lighthouse ≥ 90 em Acessibilidade |
| 4 | Gestão do ciclo de vida de membros | Cadastro, aprovação e participação automatizados |
| 5 | Ciclo de aprendizagem | Níveis, tarefas e progresso por membro |
| 6 | Ranking e oportunidades | Leaderboard e módulo de vagas em funcionamento |
| 7 | Implantação white-label | Plataforma customizável (logo, cores, textos) |

---

## 4. Escopo do Projeto

### Dentro do escopo
- Landing page customizável (Hero, Sobre, Valores, Depoimentos, CTA)
- Autenticação e cadastro (login, sign-up, aprovação, recuperação de senha)
- Área de membros (dashboard, perfil, eventos, ranking, oportunidades)
- Ciclo de aprendizagem (níveis, tarefas, progresso)
- Painel administrativo (CRUD de membros, eventos, atividades, presenças, oportunidades)
- Integração com Google Calendar
- **Integração VLibras** (tradução para LIBRAS em todo o site)
- **Modo de visualização acessível** (autistas e dautônicos)
- Implantação em produção (Vercel + Supabase)
- **White-label**: logo, cores e textos configuráveis

### Fora do escopo
- Aplicativo mobile nativo
- Sistema de pagamentos
- CRM ou ERP externo

---

## 5. Partes Interessadas (Stakeholders)

| Stakeholder | Papel |
|-------------|-------|
| **Professor da disciplina** | Avaliador |
| **Equipe de desenvolvimento** | Desenvolvimento, testes e deploy (Arthur Silva Santana, Bruna Aguiar Muchiuti, Enzo Ribeiro, Thomas Pinheiro Grandin) |
| **Usuários finais** | Estudantes com deficiência – uso da plataforma e validação de acessibilidade |
| **Instituições de ensino** | Cliente simulado |

---

## 6. Entregas do Projeto

| # | Entregável | Descrição |
|---|------------|-----------|
| 1 | **Integração VLibras** | Widget funcional em todo o site |
| 2 | **Modo acessível** | Toggle para autistas e dautônicos com persistência |
| 3 | Plataforma em produção | URL pública e estável |
| 4 | Landing page | Seções customizáveis |
| 5 | Dashboard de membros | Eventos, ranking, ciclo de aprendizagem, oportunidades |
| 6 | Painel administrativo | Gestão completa |
| 7 | Documentação técnica | README, variáveis de ambiente |
| 8 | Documentação de planejamento | TAP, cronograma, escopo, EAP |

---

## 7. Cronograma do Projeto

| Marco | Semana prevista | Entregável |
|-------|-----------------|------------|
| M1 | Semana 1 | TAP e cronograma aprovados |
| M2 | Semana 1 | Declaração de escopo + EAP aprovados |
| M3 | Semana 8 | MVP funcional |
| M4 | Semana 12 | Ciclo de aprendizagem operacional |
| M5 | Semana 14 | **Acessibilidade (VLibras + modo neurodivergente)** |
| M6 | Semana 16 | Homologação |
| M7 | Semana 18 | Lançamento em produção |

*Detalhamento completo em: [Cronograma (Gantt)](/docs/cronograma)*

---

## 8. Restrições

- Uso de tecnologias web (HTML/CSS/JS) para compatibilidade multiplataforma
- Prazo alvo: 18 semanas conforme cronograma

---

## 9. Riscos e Mitigação

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Falta de disponibilidade do professor/avaliador | Média | Alto | Definir pontos de contato formais |
| Mudanças de escopo durante o desenvolvimento | Média | Médio | Processo de gestão de mudanças |
| Problemas de integração VLibras | Baixa | Médio | Testes antecipados com documentação oficial |

---

## 10. Critérios de Sucesso

| Critério | Métrica |
|----------|---------|
| **Acessibilidade** | VLibras + modo neurodivergente implementados e testados |
| **Conformidade** | WCAG 2.1 AA em nível mínimo; Lighthouse Acessibilidade ≥ 90 |
| Funcionalidade core | 100% dos módulos planejados entregues |
| Disponibilidade | Uptime ≥ 99% em produção |

