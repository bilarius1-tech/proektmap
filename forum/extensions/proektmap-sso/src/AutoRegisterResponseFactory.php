<?php

namespace ProektMap\Sso;

use Flarum\Api\JsonApi;
use Flarum\Api\Resource\UserResource;
use Flarum\Forum\Auth\ResponseFactory;
use Flarum\Http\Rememberer;
use Flarum\User\Guest;
use Flarum\User\RegistrationToken;
use Flarum\User\User;
use Psr\Http\Message\ResponseInterface;
use Psr\Log\LoggerInterface;

/**
 * Для входа через ProektMap создаёт пользователя форума сразу, без окна регистрации:
 * человек уже зарегистрирован на ProektMap. Если создать не вышло (например, занят email),
 * откатываемся к стандартному окну регистрации Flarum.
 */
class AutoRegisterResponseFactory extends ResponseFactory
{
    public function __construct(
        Rememberer $rememberer,
        protected JsonApi $api,
        protected LoggerInterface $log,
    ) {
        parent::__construct($rememberer);
    }

    protected function makeRegistrationResponse(string $token, string $returnTo): ResponseInterface
    {
        $registration = RegistrationToken::query()->find($token);

        if ($registration && $registration->provider === ProektMapProvider::NAME) {
            try {
                $user = $this->register($registration);

                if ($user instanceof User) {
                    return $this->makeLoggedInResponse($user, $returnTo);
                }
            } catch (\Throwable $e) {
                $this->log->warning('[proektmap-sso] auto-registration failed: '.$e::class.': '.$e->getMessage());
            }
        }

        return parent::makeRegistrationResponse($token, $returnTo);
    }

    private function register(RegistrationToken $registration): ?object
    {
        $suggested = (array) ($registration->payload['suggested'] ?? []);
        $provided = (array) $registration->user_attributes;

        $attributes = array_filter([
            'token'    => $registration->token,
            'username' => $suggested['username'] ?? null,
            'email'    => $provided['email'] ?? ($suggested['email'] ?? null),
        ]);

        return $this->api
            ->forResource(UserResource::class)
            ->forEndpoint('create')
            ->process(['data' => ['attributes' => $attributes]], [], ['actor' => new Guest()]);
    }
}
