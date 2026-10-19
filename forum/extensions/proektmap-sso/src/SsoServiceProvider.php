<?php

namespace ProektMap\Sso;

use Flarum\Foundation\AbstractServiceProvider;
use Flarum\Forum\Auth\ResponseFactory;

class SsoServiceProvider extends AbstractServiceProvider
{
    public function register(): void
    {
        $this->container->singleton(SsoConfig::class);
        $this->container->bind(ResponseFactory::class, AutoRegisterResponseFactory::class);
    }
}
