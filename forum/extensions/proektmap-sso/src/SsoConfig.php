<?php

namespace ProektMap\Sso;

use Flarum\Foundation\Config;

/**
 * Настройки SSO берутся из окружения (PROEKTMAP_SSO_*) или из блока `proektmap_sso` в config.php.
 * В БД форума и в Git секрет не хранится.
 */
class SsoConfig
{
    private const KEYS = ['client_id', 'client_secret', 'authorize_url', 'token_url', 'userinfo_url', 'site_url'];

    /** @var array<string, string> */
    private array $values = [];

    public function __construct(Config $config)
    {
        $block = (array) ($config['proektmap_sso'] ?? []);

        foreach (self::KEYS as $key) {
            $env = getenv('PROEKTMAP_SSO_'.strtoupper($key));
            $this->values[$key] = is_string($env) && $env !== '' ? $env : (string) ($block[$key] ?? '');
        }
    }

    public function get(string $key): string
    {
        return $this->values[$key] ?? '';
    }

    public function isComplete(): bool
    {
        foreach (['client_id', 'client_secret', 'authorize_url', 'token_url', 'userinfo_url'] as $key) {
            if ($this->values[$key] === '') {
                return false;
            }
        }

        return strlen($this->values['client_secret']) >= 32;
    }

    public function siteUrl(): string
    {
        return rtrim($this->values['site_url'] ?: 'https://proektmap.ru', '/');
    }
}
