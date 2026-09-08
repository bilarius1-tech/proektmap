# SSL — reverans.online (metadata only)

- Domains: `reverans.online`, `www.reverans.online`
- Issuer: Let's Encrypt (ISPmanager-managed certs under `/var/www/httpd-cert/www-root/`)
- Public cert path (prod): `…/reverans.online_le1.crtca`
- Private key: **NOT included** in this package
- Renew: via ISPmanager / host panel LE renewal (do not copy private keys into Vault)
- Extra: Russian Trusted CA bundle used for some outbound TLS (`certs/russian-trusted-ca-bundle.pem` on VPS) — see SECRETS/DEPLOY notes
