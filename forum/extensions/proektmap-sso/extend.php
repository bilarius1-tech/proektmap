<?php

use Flarum\Extend;
use Flarum\Mentions\Notification\PostMentionedBlueprint;
use Flarum\Mentions\Notification\UserMentionedBlueprint;
use Flarum\Post\Event\Saving;
use ProektMap\Sso\Antispam\HoldNewcomerLinks;
use ProektMap\Sso\Antispam\NewcomerThrottler;
use FoF\OAuth\Events\OAuthLoginSuccessful;
use FoF\OAuth\Extend\RegisterProvider;
use ProektMap\Sso\AutoLoginScript;
use ProektMap\Sso\Formatter\LinkPolicy;
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

    // Умолчания для тех, кто не менял настройки: подписка на свои темы и ответы,
    // письмо при упоминании. Перекрывают значения subscriptions/mentions (грузятся раньше).
    (new Extend\User())
        ->registerPreference('followAfterCreate', 'boolval', true)
        ->registerPreference('followAfterReply', 'boolval', true),

    (new Extend\Notification())
        ->type(PostMentionedBlueprint::class, ['alert', 'email'])
        ->type(UserMentionedBlueprint::class, ['alert', 'email']),

    (new Extend\Link())
        ->setTarget(fn ($uri, $siteUrl, $attributes) => LinkPolicy::target((string) ($attributes['url'] ?? ''), (string) $siteUrl))
        ->setRel(fn ($uri, $siteUrl, $attributes) => LinkPolicy::rel((string) ($attributes['url'] ?? ''), (string) $siteUrl)),

    (new Extend\ThrottleApi())
        ->set('proektmapNewcomer', NewcomerThrottler::class),

    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->content(AutoLoginScript::class)
        ->content(DiscussionMeta::class, -100),

    (new Extend\Routes('forum'))
        ->get('/sitemap.xml', 'proektmap.sitemap', SitemapController::class),
];
