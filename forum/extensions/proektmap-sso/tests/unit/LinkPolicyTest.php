<?php

namespace ProektMap\Sso\Tests\Unit;

use PHPUnit\Framework\TestCase;
use ProektMap\Sso\Formatter\LinkPolicy;

class LinkPolicyTest extends TestCase
{
    private const FORUM = 'https://proektmap.ru/community';

    public function test_forum_links_stay_in_tab(): void
    {
        $this->assertNull(LinkPolicy::target('https://proektmap.ru/community/d/6-test', self::FORUM));
        $this->assertNull(LinkPolicy::target('/community/t/novosti', self::FORUM));
        $this->assertNull(LinkPolicy::rel('https://proektmap.ru/community', self::FORUM));
    }

    public function test_site_links_open_in_new_tab_without_nofollow(): void
    {
        $this->assertSame('_blank', LinkPolicy::target('https://proektmap.ru/resheniya', self::FORUM));
        $this->assertSame('_blank', LinkPolicy::target('/communityx', self::FORUM));
        $this->assertSame('noopener', LinkPolicy::rel('https://www.proektmap.ru/blog', self::FORUM));
    }

    public function test_external_links_open_in_new_tab_with_nofollow(): void
    {
        $this->assertSame('_blank', LinkPolicy::target('https://github.com/flarum', self::FORUM));
        $this->assertSame('_blank', LinkPolicy::target('//proektmap.ru.evil.io/x', self::FORUM));
        $this->assertSame('ugc nofollow noopener', LinkPolicy::rel('http://example.com', self::FORUM));
    }

    public function test_mailto_and_relative_are_untouched(): void
    {
        $this->assertNull(LinkPolicy::target('mailto:bilariuss@yandex.ru', self::FORUM));
        $this->assertNull(LinkPolicy::rel('d/6', self::FORUM));
    }
}
