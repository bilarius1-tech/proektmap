<?php

namespace ProektMap\Sso\Antispam;

use Carbon\Carbon;
use Flarum\User\User;

final class NewcomerPolicy
{
    public const NEWCOMER_HOURS = 24;
    public const MAX_DISCUSSIONS_PER_HOUR = 3;
    public const MAX_POSTS_PER_HOUR = 20;

    private const TRUSTED_HOSTS = ['proektmap.ru'];

    public static function isNewcomer(User $actor): bool
    {
        if ($actor->isGuest() || $actor->isAdmin()) {
            return false;
        }

        if ($actor->hasPermission('discussion.approvePosts') || $actor->can('postWithoutThrottle')) {
            return false;
        }

        $joined = $actor->joined_at;

        return $joined === null || Carbon::parse($joined)->gt(Carbon::now()->subHours(self::NEWCOMER_HOURS));
    }

    public static function containsExternalLink(string $content): bool
    {
        if (! preg_match_all('~(?:https?://|www\.)([a-z0-9.\-]+)~iu', $content, $m)) {
            return false;
        }

        foreach ($m[1] as $host) {
            $host = preg_replace('~^www\.~', '', strtolower(rtrim($host, '.')));
            if (! in_array($host, self::TRUSTED_HOSTS, true)) {
                return true;
            }
        }

        return false;
    }
}
