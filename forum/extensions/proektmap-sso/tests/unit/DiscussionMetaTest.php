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

    public function test_bare_urls_are_removed(): void
    {
        $this->assertSame(
            'Google опубликовала подробный гайд по UI.',
            DiscussionMeta::excerpt('<p>Google опубликовала подробный гайд (<a href="https://x.dev/a">https://x.dev/a</a>) по UI.</p>')
        );
        $this->assertSame('Смотри: демо', DiscussionMeta::excerpt('Смотри: https://demo.example/x демо'));
    }

    public function test_json_ld_cannot_close_script_tag(): void
    {
        $out = DiscussionMeta::jsonLd(['headline' => '</script><script>alert(1)</script>', 'url' => null]);
        $this->assertStringNotContainsString('</script><script>', $out);
        $this->assertStringNotContainsString('"url"', $out);
        $this->assertStringEndsWith('</script>', $out);
    }

    public function test_long_text_is_cut_on_word_boundary(): void
    {
        $out = DiscussionMeta::excerpt(str_repeat('слово ', 60));
        $this->assertLessThanOrEqual(160, mb_strlen($out));
        $this->assertStringEndsWith('слово…', $out);
    }
}
