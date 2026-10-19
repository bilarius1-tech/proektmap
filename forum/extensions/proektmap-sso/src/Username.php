<?php

namespace ProektMap\Sso;

use Flarum\User\User;

class Username
{
    /** Приводит к правилам Flarum (a-z0-9_-, 3–30 символов). */
    public static function normalize(string $raw): string
    {
        $value = strtolower(preg_replace('/[^A-Za-z0-9_-]+/', '_', $raw) ?? '');
        $value = trim($value, '_-');

        if (strlen($value) < 3) {
            $value = 'user'.($value !== '' ? '_'.$value : '');
        }

        return substr($value, 0, 24);
    }

    /**
     * @param callable(string): bool|null $exists
     */
    public static function unique(string $raw, ?callable $exists = null): string
    {
        $exists ??= static fn (string $name): bool => User::query()->where('username', $name)->exists();
        $base = self::normalize($raw);

        if (!$exists($base)) {
            return $base;
        }

        for ($i = 2; $i < 1000; $i++) {
            $candidate = $base.$i;
            if (!$exists($candidate)) {
                return $candidate;
            }
        }

        return $base.'_'.bin2hex(random_bytes(3));
    }
}
