<?php

namespace ProektMap\Sso\Tests\Unit;

use PHPUnit\Framework\TestCase;
use ProektMap\Sso\Antispam\NewcomerPolicy;

class NewcomerPolicyTest extends TestCase
{
    public function test_plain_text_has_no_link(): void
    {
        $this->assertFalse(NewcomerPolicy::containsExternalLink('Как подключить Prisma к Next.js?'));
    }

    public function test_own_site_links_are_trusted(): void
    {
        $this->assertFalse(NewcomerPolicy::containsExternalLink('см. https://proektmap.ru/resheniya и www.proektmap.ru/blog'));
    }

    public function test_external_link_is_detected(): void
    {
        $this->assertTrue(NewcomerPolicy::containsExternalLink('дёшево тут: https://spam.example/x'));
        $this->assertTrue(NewcomerPolicy::containsExternalLink('[клик](http://proektmap.ru.evil.io)'));
        $this->assertTrue(NewcomerPolicy::containsExternalLink('www.casino.top'));
    }
}
