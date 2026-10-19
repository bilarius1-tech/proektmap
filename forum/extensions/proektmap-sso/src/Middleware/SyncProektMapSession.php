<?php

namespace ProektMap\Sso\Middleware;

use Flarum\Http\RequestUtil;
use Flarum\Http\Rememberer;
use Flarum\Http\SessionAuthenticator;
use Flarum\Http\UrlGenerator;
use Flarum\User\Guest;
use Flarum\User\User;
use ProektMap\Sso\ProektMapCookie;
use ProektMap\Sso\ProektMapProvider;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

/**
 * Держит сессию форума в паре с сессией ProektMap:
 * — вышел на ProektMap → при следующем заходе на форум сессия форума гасится;
 * — вышел на форуме → гасим и cookie ProektMap, иначе авто-вход сразу вернёт пользователя.
 * Администраторы не трогаются: у них есть вход по паролю в /community/admin.
 */
class SyncProektMapSession implements MiddlewareInterface
{
    public function __construct(
        protected SessionAuthenticator $authenticator,
        protected Rememberer $rememberer,
        protected UrlGenerator $url,
    ) {
    }

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $path = $this->forumPath($request);
        $cookieHeader = $request->getHeaderLine('Cookie');
        $actor = RequestUtil::getActor($request);
        $wasLoggedIn = !$actor->isGuest();

        if (
            $wasLoggedIn
            && !$actor->isAdmin()
            && $path !== '/logout'
            && !str_starts_with($path, '/auth/')
            && !ProektMapCookie::hasSession($cookieHeader)
            && $this->linkedToProektMap($actor)
        ) {
            if ($session = $request->getAttribute('session')) {
                $this->authenticator->logOut($session);
            }

            $response = $handler->handle(RequestUtil::withActor($request, new Guest()));

            return $this->rememberer->forget($response);
        }

        $response = $handler->handle($request);

        if ($path === '/logout' && $wasLoggedIn && in_array($response->getStatusCode(), [301, 302, 303], true)) {
            foreach (ProektMapCookie::expireHeaders($cookieHeader) as $header) {
                $response = $response->withAddedHeader('Set-Cookie', $header);
            }
        }

        return $response;
    }

    private function linkedToProektMap(User $user): bool
    {
        return $user->loginProviders()->where('provider', ProektMapProvider::NAME)->exists();
    }

    private function forumPath(ServerRequestInterface $request): string
    {
        $base = rtrim((string) parse_url($this->url->to('forum')->base(), PHP_URL_PATH), '/');
        $path = $request->getUri()->getPath();

        if ($base !== '' && str_starts_with($path, $base)) {
            $path = substr($path, strlen($base));
        }

        return '/'.ltrim(rtrim($path, '/'), '/');
    }
}
