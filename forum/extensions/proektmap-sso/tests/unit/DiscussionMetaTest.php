<?php

namespace ProektMap\Sso\Tests\Unit;

use PHPUnit\Framework\TestCase;
use ProektMap\Sso\Seo\DiscussionMeta;

class DiscussionMetaTest extends TestCase
{
    public function test_strips_html_and_entities(): void
    {
        $this->assertSame('Как подключить Prisma & Next.js?', DiscussionMeta::excerpt('<p>Как <b>подключить</b>   Prisma &amp; Next.js?</p>'));
    }

    public function test_long_text_is_cut_on_word_boundary(): void
    {
        $out = DiscussionMeta::excerpt(str_repeat('слово ', 60));
        $this->assertLessThanOrEqual(160, mb_strlen($out));
        $this->assertStringEndsWith('слово…', $out);
    }
}
