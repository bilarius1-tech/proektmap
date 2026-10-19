<?php

use Flarum\Extend;
use FoF\OAuth\Events\OAuthLoginSuccessful;
use FoF\OAuth\Extend\RegisterProvider;
use ProektMap\Sso\AutoLoginScript;
use ProektMap\Sso\Listener\SyncNickname;
use ProektMap\Sso\Middleware\SyncProektMapSession;
use ProektMap\Sso\ProektMapProvider;
use ProektMap\Sso\SsoServiceProvider;

return [
    new RegisterProvider(ProektMapProvider::class),

    new Extend\Locales(__DIR__.'/locale'),

    (new Extend\ServiceProvider())
        ->register(SsoServiceProvider::class),

    (new Extend\Middleware('forum'))
        ->add(SyncProektMapSession::class),

    (new Extend\Event())
        ->listen(OAuthLoginSuccessful::class, SyncNickname::class),

    (new Extend\Frontend('forum'))
        ->content(AutoLoginScript::class),
];
