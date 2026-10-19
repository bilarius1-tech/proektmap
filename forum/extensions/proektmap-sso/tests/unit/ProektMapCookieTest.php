<?php

namespace ProektMap\Sso\Tests\unit;

use PHPUnit\Framework\TestCase;
use ProektMap\Sso\ProektMapCookie;

class ProektMapCookieTest extends TestCase
{
    public function test_finds_secure_and_chunked_session_cookies(): void
    {
        $header = 'flarum_session=abc; __Secure-next-auth.session-token.0=x; __Secure-next-auth.session-token.1=y; other=z';

        $this->assertSame(
            ['__Secure-next-auth.session-token.0', '__Secure-next-auth.session-token.1'],
            ProektMapCookie::sessionCookieNames($header)
        );
        $this->assertTrue(ProektMapCookie::hasSession($header));
    }

    public function test_ignores_lookalike_and_csrf_cookies(): void
    {
        $header = '__Host-next-auth.csrf-token=a; __Secure-next-auth.callback-url=b; fake__Secure-next-auth.session-token=c';

        $this->assertFalse(ProektMapCookie::hasSession($header));
        $this->assertSame([], ProektMapCookie::expireHeaders($header));
    }

    public function test_expire_headers_keep_secure_flag_and_root_path(): void
    {
        $headers = ProektMapCookie::expireHeaders('__Secure-next-auth.session-token=v');

        $this->assertCount(1, $headers);
        $this->assertStringStartsWith('__Secure-next-auth.session-token=;', $headers[0]);
        $this->assertStringContainsString('Path=/;', $headers[0]);
        $this->assertStringContainsString('Max-Age=0', $headers[0]);
        $this->assertStringContainsString('Secure', $headers[0]);
    }
}
