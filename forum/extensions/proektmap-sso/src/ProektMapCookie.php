<?php

namespace ProektMap\Sso;

/**
 * Cookie сессии ProektMap (NextAuth). Форум живёт на том же домене, поэтому видит её наличие,
 * но содержимое не читает: оно зашифровано секретом ProektMap.
 *
 * Имена разбираем из сырого заголовка Cookie: PHP заменяет точки в именах на "_".
 */
class ProektMapCookie
{
    private const NAMES = ['__Secure-next-auth.session-token', 'next-auth.session-token'];

    /** @return string[] имена cookie сессии ProektMap, включая куски .0/.1 */
    public static function sessionCookieNames(string $cookieHeader): array
    {
        $found = [];

        foreach (explode(';', $cookieHeader) as $pair) {
            $name = trim(explode('=', $pair, 2)[0]);
            foreach (self::NAMES as $base) {
                if ($name === $base || preg_match('/^'.preg_quote($base, '/').'\.\d+$/', $name)) {
                    $found[] = $name;
                }
            }
        }

        return array_values(array_unique($found));
    }

    public static function hasSession(string $cookieHeader): bool
    {
        return self::sessionCookieNames($cookieHeader) !== [];
    }

    /** @return string[] значения Set-Cookie, которые удаляют сессию ProektMap */
    public static function expireHeaders(string $cookieHeader): array
    {
        return array_map(
            static fn (string $name): string => $name.'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; HttpOnly; SameSite=Lax'
                .(str_starts_with($name, '__Secure-') ? '; Secure' : ''),
            self::sessionCookieNames($cookieHeader)
        );
    }
}
