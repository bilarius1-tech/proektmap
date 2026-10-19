<?php

use Flarum\Extend;
use Flarum\Post\Event\Saving;
use ProektMap\Sso\Antispam\HoldNewcomerLinks;
use ProektMap\Sso\Antispam\NewcomerThrottler;
use FoF\OAuth\Events\OAuthLoginSuccessful;
use FoF\OAuth\Extend\RegisterProvider;
use ProektMap\Sso\AutoLoginScript;
use ProektMap\Sso\Listener\SyncNickname;
use ProektMap\Sso\Middleware\SyncProektMapSession;
use ProektMap\Sso\ProektMapProvider;
use ProektMap\Sso\Seo\DiscussionMeta;
use ProektMap\Sso\Seo\SitemapController;
use ProektMap\Sso\SsoServiceProvider;

return [
    new RegisterProvider(ProektMapProvider::class),

    new Extend\Locales(__DIR__.'/locale'),

    (new Extend\ServiceProvider())
        ->register(SsoServiceProvider::class),

    (new Extend\Middleware('forum'))
        ->add(SyncProektMapSession::class),

    (new Extend\Event())
        ->listen(OAuthLoginSuccessful::class, SyncNickname::class)
        ->listen(Saving::class, HoldNewcomerLinks::class),

    (new Extend\ThrottleApi())
        ->set('proektmapNewcomer', NewcomerThrottler::class),

    (new Extend\Frontend('forum'))
        ->content(AutoLoginScript::class)
        ->content(DiscussionMeta::class, -100),

    (new Extend\Routes('forum'))
        ->get('/sitemap.xml', 'proektmap.sitemap', SitemapController::class),
];
