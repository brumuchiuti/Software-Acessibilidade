# Supabase Schema – IFL Jovem SP

## Overview

Single consolidated migration defining the full database schema for the Plataforma Educacional Acessível.

## Schema Structure

| Table | Purpose |
|-------|---------|
| `profiles` | Member profiles extending `auth.users` (bio, role, board_role, development_level, etc.) |
| `member_institute_areas` | Institute areas each member participates in |
| `events` | Institute events with dates, location, points |
| `event_attendance` | Event registration and presence tracking |
| `activities` | Engagement activities for points |
| `activity_participation` | Submissions and approval of activities |
| `opportunities` | Stages, mentorship, courses |
| `training_cycle_levels` | Ciclo de Formação levels |
| `training_cycle_tasks` | Tasks per level |
| `member_training_progress` | Member progress on cycle tasks |

## Applying the Schema

### Fresh install (resets all data)

```bash
supabase db reset
```

### Push to existing remote

```bash
supabase db push
```

### Local development

```bash
supabase start
supabase db reset  # applies migrations
```

## RLS & Admin Access

- **Admins**: users with `board_role IS NOT NULL` in `profiles`
- The `is_board_member()` function (SECURITY DEFINER) checks admin status and is used in RLS policies
- Admins can update any profile, manage events, activities, attendance, opportunities, and the Ciclo de Formação

## Triggers

- `on_auth_user_created`: creates a row in `profiles` when a user signs up (with `approved: false`)
