# Requisitos, Modelagem e Arquitetura
## Plataforma Educacional Acessível (White-Label) – IFL Jovem SP

| Versão | Data | Grupo ABE |
|--------|------|-----------|
| 1.0 | 03/03/2025 | Arthur Silva Santana, Bruna Aguiar Muchiuti, Enzo Ribeiro, Thomas Pinheiro Grandin |

---

## 1. Requisitos Funcionais e Não Funcionais

### 1.1 Requisitos Funcionais

| ID | Título | Descrição | Prioridade |
|----|--------|-----------|------------|
| RF01 | Integração VLibras | Widget VLibras (gov.br) para tradução de textos em LIBRAS em todo o site | Alta |
| RF02 | Modo visual acessível | Toggle global para autistas/dautônicos: menos animações, layout previsível | Alta |
| RF03 | Cadastro de membros | Cadastro com bio, telefone, LinkedIn, Instagram e avatar | Alta |
| RF04 | Login / Logout | Autenticação e encerramento de sessão | Alta |
| RF05 | Fluxo de aprovação | Novos membros aguardam aprovação antes de acessar o dashboard | Alta |
| RF06 | Recuperação de senha | Solicitar e redefinir senha | Média |
| RF07 | Dashboard de membros | Home, eventos, ranking, ciclo de formação, oportunidades, perfil, configurações | Alta |
| RF08 | Eventos | Listar, ver detalhes, inscrever-se, integrar com Google Calendar | Alta |
| RF09 | Ranking e atividades | Leaderboard e submissão de atividades para pontuação | Alta |
| RF10 | Ciclo de aprendizagem | Níveis, tarefas e progresso por membro | Alta |
| RF11 | Oportunidades | Listagem de estágios, mentorias e cursos | Alta |
| RF12 | Painel administrativo | Gestão de membros, eventos, presenças, atividades, ciclo e oportunidades | Alta |
| RF13 | White-label | Customização de logo, cores e textos | Média |

### 1.2 Requisitos Não Funcionais

| ID | Título | Descrição |
|----|--------|-----------|
| RNF01 | Desempenho | Carregamento rápido das páginas |
| RNF02 | Persistência de preferência | Modo acessível salvo entre sessões |
| RNF03 | Segurança | Autenticação segura e confiável |
| RNF04 | Proteção de acesso | Áreas restritas exigem login e aprovação |
| RNF05 | Controle de dados | Cada usuário acessa apenas o que lhe cabe |
| RNF06 | Responsividade | Interface adaptável a celular, tablet e computador |

---

## 2. Modelagem (DCU + DCL + Arquitetura)

### 2.1 DCU – Design Centrado no Usuário

**Personas:** Maria (Surda – usa LIBRAS), João (Neurodivergente – precisa de menos estímulos), Ana (Membro), Carlos (Admin).

**Jornada do membro:** Cadastro → Aguarda aprovação → Acessa dashboard → Eventos e atividades → Ranking → Oportunidades.

**Fluxo de autenticação:**

```
[Cadastro] → [Conta criada] → [Aguardando aprovação] → (admin aprova) → [Acesso liberado]
```

---

### 2.2 DCL – Diagramas

#### Casos de Uso (resumido)

- **Visitante:** Cadastrar-se, Login, Recuperar senha, Usar VLibras, Ativar modo acessível
- **Membro:** Gerenciar perfil, Eventos, Ranking, Atividades, Ciclo de formação, Oportunidades
- **Admin:** Gestão completa (eventos, membros, presenças, atividades, ciclo, oportunidades)

#### Diagrama de Classes (principais entidades)

| Entidade | Atributos principais |
|----------|----------------------|
| Perfil | nome, bio, telefone, foto, cargo, aprovado |
| Evento | título, descrição, data/hora, local |
| Presença em evento | usuário, evento, compareceu |
| Atividade | título, descrição, pontos |
| Participação em atividade | usuário, atividade, concluído, conteúdo enviado |
| Oportunidade | título, descrição, link, tipo |
| Nível do ciclo | nome, descrição |
| Tarefa do ciclo | nível, título, tipo, link |
| Progresso do membro | membro, tarefa, data de conclusão |

---

### 2.3 Arquitetura

**Visão geral:** Aplicação web com banco de dados na nuvem e hospedagem online.

**Integrações:** VLibras (tradução LIBRAS), Google Calendar (adicionar eventos).

---

## 3. Justificativa da Arquitetura

| Critério | Decisão |
|----------|---------|
| Prazo e experiência | Tecnologias já conhecidas pela equipe |
| Custo | Solução adequada ao projeto inicial |
| Manutenção | Uso de serviços prontos reduz complexidade |
| Acessibilidade | Componentes pensados para uso por todos |

---

## 4. Extras

### Matriz de Rastreabilidade (resumida)

| Requisito | EAP | Local |
|-----------|-----|-------|
| RF01–RF02 | 1.7 | A implementar |
| RF03–RF06 | 1.3 | Módulo de autenticação |
| RF07–RF11 | 1.5 | Área de membros |
| RF12 | 1.6 | Painel administrativo |
| RNF04–RNF05 | 1.2, 1.3 | Controle de acesso |

### Glossário

| Termo | Definição |
|-------|-----------|
| VLibras | Tradução automática português → LIBRAS (gov.br) |
| Modo autista/dautônico | Visualização com menos estímulos e layout previsível |
| Ciclo de aprendizagem | Níveis e tarefas configuráveis |
| White-label | Customizável (logo, cores, textos) |

### Riscos

| Risco | Mitigação |
|-------|-----------|
| VLibras instável | Testes com documentação oficial |
| Dependência de serviços externos | Manter documentação atualizada |

---

*Documento Requisitos, Modelagem e Arquitetura – Plataforma Educacional Acessível.*
