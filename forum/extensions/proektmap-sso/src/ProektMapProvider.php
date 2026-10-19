<?php

namespace ProektMap\Sso;

use Flarum\Extension\ExtensionManager;
use Flarum\Forum\Auth\Registration;
use Flarum\Settings\SettingsRepositoryInterface;
use FoF\OAuth\Provider;
use League\OAuth2\Client\Provider\AbstractProvider;
use League\OAuth2\Client\Provider\GenericProvider;

class ProektMapProvider extends Provider
{
    public const NAME = 'proektmap';

    public function __construct(
        SettingsRepositoryInterface $settings,
        protected SsoConfig $config,
        protected ExtensionManager $extensions,
    ) {
        parent::__construct($settings);
    }

    public function name(): string
    {
        return self::NAME;
    }

    public function link(): string
    {
        return $this->config->siteUrl();
    }

    /** Ключи живут в config.php / окружении, поэтому в админке полей нет. */
    public function fields(): array
    {
        return [];
    }

    public function icon(): string
    {
        return 'fab fa-yandex';
    }

    public function priority(): int
    {
        return 100;
    }

    public function enabled(): bool
    {
        return parent::enabled() && $this->config->isComplete();
    }

    public function provider(string $redirectUri): ?AbstractProvider
    {
        return new GenericProvider([
            'clientId'                => $this->config->get('client_id'),
            'clientSecret'            => $this->config->get('client_secret'),
            'redirectUri'             => $redirectUri,
            'urlAuthorize'            => $this->config->get('authorize_url'),
            'urlAccessToken'          => $this->config->get('token_url'),
            'urlResourceOwnerDetails' => $this->config->get('userinfo_url'),
            'responseResourceOwnerId' => 'sub',
            'scopes'                  => ['profile', 'email'],
            'scopeSeparator'          => ' ',
        ]);
    }

    public function pkceEnabled(): bool
    {
        return true;
    }

    public function suggestions(Registration $registration, mixed $user, string $token): void
    {
        $data = $user->toArray();
        $email = isset($data['email']) ? (string) $data['email'] : null;

        $this->verifyEmail($email);

        if ($this->getProviderVerifiedEmail($user, $token) !== null) {
            $registration->provideTrustedEmail($email);
        } else {
            $registration->suggestEmail($email);
        }

        $registration->suggestUsername(Username::unique((string) ($data['preferred_username'] ?? '')));

        $name = trim((string) ($data['name'] ?? ''));
        if ($name !== '' && $this->extensions->isEnabled('flarum-nicknames')) {
            $registration->provide('nickname', mb_substr($name, 0, 150));
        }

        $registration->setPayload([
            'sub'  => (string) ($data['sub'] ?? ''),
            'name' => $name,
        ]);

        $this->provideAvatar($registration, $data['picture'] ?? null);
    }

    public function getProviderVerifiedEmail(mixed $user, string $token): ?string
    {
        $data = $user->toArray();

        return !empty($data['email_verified']) && !empty($data['email']) ? (string) $data['email'] : null;
    }
}
