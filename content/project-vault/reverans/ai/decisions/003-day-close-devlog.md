# ADR 003 — Day-close via DEVLOG + journal + commit

## Decision
Every work day ends with: update `docs/DEVLOG.md` (Сейчас), append `docs/DAILY_JOURNAL.md`, commit, push when asked. Cursor rule `day-close.mdc` encodes the ritual.

## Why
Agents lose context across chats; DEVLOG «Сейчас» is the single priority signal.
