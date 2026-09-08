# Reverans Loop

## Infra Loop (active)

Interval: **15 minutes**

On each tick:

1. `cd /root/projects/reverans && ./harness/check-service.sh --quiet`
2. Report `SUMMARY` + FAIL/WARN only
3. Exit 0 → one-line OK; exit 1 → WARNs; exit 2 → FAILs + propose fix (no destructive remediations without confirm)

Also verify (when FAIL/WARN relevant):
- https://reverans.online/api/health
- https://reverans.online/tz/outputs/TZ_reverance.md reachable

## Dev Loop (manual / on request)

After finishing a Graph day (D1–D10):

1. Run harness
2. Check DoD in `.cursor/rules/dev-graph.mdc`
3. Smoke the screens for that day against wireframes / landing HTML
4. `pm2 restart reverans` only after successful `npm run build`
5. Mark day done in the Dev Graph canvas

## Stop

User says «останови loop» → kill infra loop PID, do not re-arm.
