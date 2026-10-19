<?php

namespace ProektMap\Sso\Listener;

use Flarum\Extension\ExtensionManager;
use Flarum\User\LoginProvider;
use FoF\OAuth\Events\OAuthLoginSuccessful;
use ProektMap\Sso\ProektMapProvider;

/** Имя на ProektMap — источник правды: при каждом входе переносим его в nickname форума. */
class SyncNickname
{
    public function __construct(
        protected ExtensionManager $extensions,
    ) {
    }

    public function handle(OAuthLoginSuccessful $event): void
    {
        if ($event->providerName !== ProektMapProvider::NAME || !$this->extensions->isEnabled('flarum-nicknames')) {
            return;
        }

        $name = trim((string) ($event->userResource->toArray()['name'] ?? ''));
        if ($name === '') {
            return;
        }

        $user = LoginProvider::query()
            ->where('provider', ProektMapProvider::NAME)
            ->where('identifier', $event->identifier)
            ->first()?->user;

        if ($user && $user->getAttribute('nickname') !== $name) {
            $user->setAttribute('nickname', mb_substr($name, 0, 150));
            $user->save();
        }
    }
}
