<?php

namespace ProektMap\Sso\Tests\unit;

use PHPUnit\Framework\TestCase;
use ProektMap\Sso\Username;

class UsernameTest extends TestCase
{
    public function test_normalize_keeps_flarum_rules(): void
    {
        $this->assertSame('aleksey_ivanov', Username::normalize('aleksey_ivanov'));
        $this->assertSame('vibe_coder', Username::normalize('Vibe.Coder'));
        $this->assertSame('user', Username::normalize(''));
        $this->assertSame('user_ab', Username::normalize('ab'));
        $this->assertLessThanOrEqual(24, strlen(Username::normalize(str_repeat('a', 60))));
    }

    public function test_unique_appends_number_when_taken(): void
    {
        $taken = ['alex', 'alex2'];
        $exists = static fn (string $name): bool => in_array($name, $taken, true);

        $this->assertSame('alex3', Username::unique('alex', $exists));
        $this->assertSame('maria', Username::unique('maria', $exists));
    }
}
