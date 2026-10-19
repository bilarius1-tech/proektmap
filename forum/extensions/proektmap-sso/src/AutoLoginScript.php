<?php

namespace ProektMap\Sso;

use Flarum\Frontend\Document;
use Flarum\Http\RequestUtil;
use Flarum\Http\UrlGenerator;
use Psr\Http\Message\ServerRequestInterface;

/**
 * Гость на форуме, но уже вошёл на ProektMap → тихо проводим через SSO.
 * Проверяем сессию через /api/auth/session (тот же домен), а не по наличию cookie:
 * просроченная cookie не должна уводить гостя на страницу входа.
 * Повтор не чаще раза в 10 минут на вкладку — защита от циклов редиректа.
 */
class AutoLoginScript
{
    public function __construct(
        protected ProektMapProvider $provider,
        protected UrlGenerator $url,
    ) {
    }

    public function __invoke(Document $document, ServerRequestInterface $request): void
    {
        if (!RequestUtil::getActor($request)->isGuest() || !$this->provider->enabled()) {
            return;
        }

        $authUrl = json_encode(
            $this->url->to('forum')->route('fof-oauth', ['provider' => ProektMapProvider::NAME]),
            JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT
        );

        $document->head[] = <<<HTML
<script>
(function () {
  try {
    var key = 'pmSsoTriedAt';
    var last = Number(sessionStorage.getItem(key) || 0);
    if (Date.now() - last < 600000) return;
    if (/[?&](_flarum_auth|_fof_oauth_unverified|error)=/.test(location.search)) return;
    fetch('/api/auth/session', { credentials: 'same-origin' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (s) {
        if (!s || !s.user) return;
        sessionStorage.setItem(key, String(Date.now()));
        location.replace({$authUrl} + '?returnTo=' + encodeURIComponent(location.pathname + location.search));
      })
      .catch(function () {});
  } catch (e) {}
})();
</script>
HTML;
    }
}
