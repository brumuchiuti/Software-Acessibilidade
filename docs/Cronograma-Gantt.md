# Cronograma Inicial – Plataforma Educacional Acessível

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0 | 24/02/2025 | Versão inicial |

---

## Marcos do Projeto

| ID | Marco | Data Prevista | Entregável |
|----|-------|---------------|------------|
| M1 | Início do Projeto | Semana 1 | TAP e cronograma aprovados |
| M2 | Escopo Definido | Semana 1 | Declaração de escopo + EAP aprovados |
| M3 | MVP Funcional | Semana 8 | Landing, auth, dashboard básico |
| M4 | Ciclo de aprendizagem | Semana 12 | Níveis e tarefas operacionais |
| M5 | Acessibilidade (VLibras + Modo Neurodivergente) | Semana 14 | Integrações testadas |
| M6 | Homologação | Semana 16 | QA completo |
| M7 | Lançamento em Produção | Semana 18 | Go-live |

---

## Diagrama de Gantt (Representação em Markdown)

```
Legenda: ████ = Atividade   ▓▓▓▓ = Marco   ▼ = Marco

Semana    1    2    3    4    5    6    7    8    9   10   11   12   13   14   15   16   17   18
          |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |
M1/M2     ▼    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |
          |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |
1. Plan.  ████ |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |
2. Infra  ████ ████ |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |
3. Auth   |    ████ ████ ████ |    |    |    |    |    |    |    |    |    |    |    |    |    |
4. Land.  |    ████ ████ ████ ████ |    |    |    |    |    |    |    |    |    |    |    |    |
5. Dash.  |    |    ████ ████ ████ ████ ████ |    |    |    |    |    |    |    |    |    |    |
6. Rank.  |    |    |    |    ████ ████ ████ ████ |    |    |    |    |    |    |    |    |    |
7. Oport. |    |    |    |    |    ████ ████ ████ |    |    |    |    |    |    |    |    |    |
          |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |
M3        |    |    |    |    |    |    |    |    ▼    |    |    |    |    |    |    |    |    |    |
          |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |
8. Ciclo  |    |    |    |    |    |    ████ ████ ████ ████ ████ ████ |    |    |    |    |    |    |
9. Admin  |    |    |    |    |    |    ████ ████ ████ ████ ████ |    |    |    |    |    |    |    |
          |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |
M4        |    |    |    |    |    |    |    |    |    |    |    |    |    ▼    |    |    |    |    |    |
          |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |
10.VLibras|    |    |    |    |    |    |    |    |    |    |    |    |    ████ ████ |    |    |    |    |
11.ModoNeuro|   |    |    |    |    |    |    |    |    |    |    |    |    ████ ████ |    |    |    |    |
          |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |
M5        |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    ▼    |    |    |
          |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |
12. QA    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    ████ ████ |    |    |
          |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |
M6        |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    ▼    |    |
          |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |
13. Deploy|    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    ████ ████ |
          |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |
M7        |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    ▼    |
```

---

## Detalhamento das Atividades

### Fase 1 – Planejamento e Infraestrutura (Semanas 1–2)
| Atividade | Duração | Dependência | Responsável |
|-----------|---------|-------------|-------------|
| 1. Planejamento | 1 sem | — | GP |
| 2. Infraestrutura (Supabase, Vercel, env) | 2 sem | — | Dev |
| 3. Configuração inicial Next.js/Supabase | (incluído) | — | Dev |

### Fase 2 – MVP (Semanas 2–8)
| Atividade | Duração | Dependência | Responsável |
|-----------|---------|-------------|-------------|
| 4. Autenticação (login, cadastro, aprovação) | 3 sem | Infra | Dev |
| 5. Landing page (seções institucionais) | 4 sem | Infra | Dev |
| 6. Dashboard base e sidebar | 4 sem | Auth | Dev |
| 7. Eventos (listagem, detalhe, inscrição) | 3 sem | Dashboard | Dev |
| 8. Ranking e atividades | 3 sem | Dashboard | Dev |
| 9. Oportunidades | 2 sem | Dashboard | Dev |

### Fase 3 – Ciclo de Formação e Admin (Semanas 6–12)
| Atividade | Duração | Dependência | Responsável |
|-----------|---------|-------------|-------------|
| 10. Ciclo de Formação (níveis, tarefas, progresso) | 6 sem | Dashboard | Dev |
| 11. Painel administrativo completo | 5 sem | MVP | Dev |

### Fase 4 – Acessibilidade (Semanas 12–14)
| Atividade | Duração | Dependência | Responsável |
|-----------|---------|-------------|-------------|
| 12. Integração VLibras Widget | 2 sem | M4 | Dev |
| 13. Modo visual para autistas/dautônicos | 2 sem | M4 | Dev |

### Fase 5 – Homologação e Deploy (Semanas 14–18)
| Atividade | Duração | Dependência | Responsável |
|-----------|---------|-------------|-------------|
| 14. QA e testes de acessibilidade | 2 sem | M5 | QA |
| 15. Correções pós-QA | (buffer) | QA | Dev |
| 16. Deploy em produção | 2 sem | M6 | DevOps/Dev |

---

## Caminho Crítico (resumido)

```
Infra → Auth → Dashboard → Ranking/Eventos → Ciclo → Admin
                                                        ↓
                                           VLibras + Modo Neuro → QA → Deploy
```

