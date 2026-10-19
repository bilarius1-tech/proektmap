<?php

namespace ProektMap\Sso\Antispam;

use Carbon\Carbon;
use Flarum\Discussion\Discussion;
use Flarum\Http\RequestUtil;
use Flarum\Post\Post;
use Psr\Http\Message\ServerRequestInterface;

class NewcomerThrottler
{
    public function __invoke(ServerRequestInterface $request): ?bool
    {
        $route = $request->getAttribute('routeName');

        if (! in_array($route, ['discussions.create', 'posts.create'], true)) {
            return null;
        }

        $actor = RequestUtil::getActor($request);

        if (! NewcomerPolicy::isNewcomer($actor)) {
            return null;
        }

        $since = Carbon::now()->subHour();

        if ($route === 'discussions.create') {
            $count = Discussion::where('user_id', $actor->id)->where('created_at', '>=', $since)->count();

            return $count >= NewcomerPolicy::MAX_DISCUSSIONS_PER_HOUR ? true : null;
        }

        $count = Post::where('user_id', $actor->id)->where('created_at', '>=', $since)->count();

        return $count >= NewcomerPolicy::MAX_POSTS_PER_HOUR ? true : null;
    }
}
