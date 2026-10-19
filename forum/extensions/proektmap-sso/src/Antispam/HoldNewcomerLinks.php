<?php

namespace ProektMap\Sso\Antispam;

use Carbon\Carbon;
use Flarum\Extension\ExtensionManager;
use Flarum\Flags\Flag;
use Flarum\Post\CommentPost;
use Flarum\Post\Event\Saving;

/**
 * Пост новичка с внешней ссылкой уходит в очередь одобрения (как в flarum/approval).
 */
class HoldNewcomerLinks
{
    public function __construct(private ExtensionManager $extensions)
    {
    }

    public function handle(Saving $event): void
    {
        $post = $event->post;

        if ($post->exists || ! $post instanceof CommentPost || $post->is_approved === false) {
            return;
        }

        if (! $this->extensions->isEnabled('flarum-approval') || ! $this->extensions->isEnabled('flarum-flags')) {
            return;
        }

        $actor = $event->actor;

        if (! NewcomerPolicy::isNewcomer($actor) || ! NewcomerPolicy::containsExternalLink((string) $post->content)) {
            return;
        }

        // Если approval сам не пропустит пост, он же создаст флаг — не дублируем.
        $ability = $post->discussion->first_post_id === null ? 'startWithoutApproval' : 'replyWithoutApproval';
        if (! $actor->can($ability, $post->discussion)) {
            return;
        }

        $post->is_approved = false;

        $post->afterSave(function (CommentPost $post) {
            if ($post->number == 1) {
                $post->discussion->is_approved = false;
                $post->discussion->save();
            }

            $flag = new Flag;
            $flag->post_id = $post->id;
            $flag->type = 'approval';
            $flag->reason_detail = 'Новый участник, внешняя ссылка';
            $flag->created_at = Carbon::now();
            $flag->save();
        });
    }
}
