<?php

namespace ProektMap\Sso\Formatter;

/**
 * Куда открывать ссылку из поста. Ссылки внутри форума оставляем Flarum
 * (их ведёт роутер SPA), всё остальное — в новой вкладке.
 */
final class LinkPolicy
{
    private const SITE_HOSTS = ['proektmap.ru', 'www.proektmap.ru'];

    public static function kind(string $url, string $forumUrl): string
    {
        if (preg_match('~^[a-z][a-z0-9+.-]*:~i', $url) && ! preg_match('~^https?://~i', $url)) {
            return 'other';
        }

        $forumPath = rtrim((string) parse_url($forumUrl, PHP_URL_PATH), '/');

        if (str_starts_with($url, '//')) {
            $url = 'https:'.$url;
        }

        $host = parse_url($url, PHP_URL_HOST);

        if (is_string($host) && $host !== '') {
            if (! in_array(strtolower($host), self::SITE_HOSTS, true)) {
                return 'external';
            }
        } elseif (! str_starts_with($url, '/')) {
            return 'other';
        }

        $path = (string) (parse_url($url, PHP_URL_PATH) ?: '/');

        if ($forumPath === '' || $path === $forumPath || str_starts_with($path, $forumPath.'/')) {
            return 'forum';
        }

        return 'site';
    }

    public static function target(string $url, string $forumUrl): ?string
    {
        return in_array(self::kind($url, $forumUrl), ['site', 'external'], true) ? '_blank' : null;
    }

    public static function rel(string $url, string $forumUrl): ?string
    {
        return match (self::kind($url, $forumUrl)) {
            'site' => 'noopener',
            'external' => 'ugc nofollow noopener',
            default => null,
        };
    }
}
