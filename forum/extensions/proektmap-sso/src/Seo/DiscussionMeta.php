<?php

namespace ProektMap\Sso\Seo;

use Flarum\Discussion\Discussion;
use Flarum\Frontend\Document;
use Flarum\Http\RequestUtil;
use Flarum\Http\SlugManager;
use Flarum\Http\UrlGenerator;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\Tags\Tag;
use Flarum\User\User;
use Illuminate\Support\Arr;
use ProektMap\Sso\SsoConfig;
use Psr\Http\Message\ServerRequestInterface;

/**
 * Описание, Open Graph, canonical и schema.org для страниц форума. Картинка — генератор /api/og сайта.
 */
class DiscussionMeta
{
    public function __construct(
        private SettingsRepositoryInterface $settings,
        private SsoConfig $config,
        private UrlGenerator $url,
        private SlugManager $slugs,
    ) {
    }

    public function __invoke(Document $document, ServerRequestInterface $request): void
    {
        $siteName = (string) $this->settings->get('forum_title', 'ИИ Форум ProektMap');
        $title = $siteName;
        $description = (string) ($document->meta['description'] ?? '');
        $type = 'website';
        $tags = [];
        $actor = RequestUtil::getActor($request);
        $params = $request->getQueryParams();

        switch ($request->getAttribute('routeName')) {
            case 'discussion':
                $discussion = Discussion::whereVisibleTo($actor)
                    ->with(['firstPost.user', 'tags'])
                    ->find((int) Arr::get($params, 'id'));

                if ($discussion) {
                    $title = (string) $discussion->title;
                    $type = 'article';
                    $html = $discussion->firstPost ? $discussion->firstPost->formatContent($request) : '';
                    $excerpt = self::excerpt($html);
                    if ($excerpt !== '') {
                        $description = $excerpt;
                        $document->meta['description'] = $excerpt;
                    }
                    if ($discussion->relationLoaded('tags')) {
                        $tags = $discussion->tags->pluck('name')->take(3)->all();
                    }
                    $this->addDiscussionSchema($document, $discussion, $html);
                }
                break;

            case 'tag':
                if (class_exists(Tag::class)) {
                    $tag = Tag::whereVisibleTo($actor)->where('slug', (string) Arr::get($params, 'slug'))->first();
                    if ($tag) {
                        $title = (string) $tag->name;
                        $tags = [$title];
                        $document->canonicalUrl = $this->url->to('forum')->route('tag', ['slug' => $tag->slug]);
                    }
                }
                break;

            case 'user':
                // Профили почти без текста: не индексируем, но ссылки с них учитываются.
                $document->head['robots'] = '<meta name="robots" content="noindex, follow">';
                break;
        }

        $image = $this->config->siteUrl().'/api/og?'.http_build_query([
            'title' => $title,
            'category' => 'ИИ Форум',
            'tags' => implode(',', $tags),
        ]);

        $og = [
            'og:site_name' => $siteName,
            'og:locale' => 'ru_RU',
            'og:type' => $type,
            'og:title' => $title,
            'og:description' => $description,
            'og:image' => $image,
            'og:image:width' => '1200',
            'og:image:height' => '630',
        ];
        if ($document->canonicalUrl) {
            $og['og:url'] = $document->canonicalUrl;
        }

        foreach ($og as $property => $content) {
            if ($content !== '') {
                $document->head[$property] = '<meta property="'.e($property).'" content="'.e($content).'">';
            }
        }
        $document->head['twitter:card'] = '<meta name="twitter:card" content="summary_large_image">';
    }

    private function addDiscussionSchema(Document $document, Discussion $discussion, string $html): void
    {
        $forum = $this->url->to('forum');
        $url = $document->canonicalUrl ?: $forum->route('discussion', ['id' => (string) $discussion->id]);
        $author = $discussion->firstPost?->user;
        $tag = $discussion->relationLoaded('tags') ? $discussion->tags->first() : null;

        $posting = [
            '@context' => 'https://schema.org',
            '@type' => 'DiscussionForumPosting',
            'headline' => (string) $discussion->title,
            'text' => self::excerpt($html, 2000),
            'url' => $url,
            'datePublished' => $discussion->created_at?->toAtomString(),
            'dateModified' => ($discussion->last_posted_at ?? $discussion->created_at)?->toAtomString(),
            'author' => $author
                ? ['@type' => 'Person', 'name' => $author->display_name, 'url' => $forum->route('user', ['username' => $this->slugs->forResource(User::class)->toSlug($author)])]
                : ['@type' => 'Person', 'name' => 'Участник'],
            'interactionStatistic' => [
                '@type' => 'InteractionCounter',
                'interactionType' => 'https://schema.org/CommentAction',
                'userInteractionCount' => max(0, (int) $discussion->comment_count - 1),
            ],
        ];

        $crumbs = [
            ['ProektMap', $this->config->siteUrl().'/'],
            [(string) $this->settings->get('forum_title', 'ИИ Форум'), $forum->base()],
        ];
        if ($tag) {
            $crumbs[] = [(string) $tag->name, $forum->route('tag', ['slug' => $tag->slug])];
        }
        $crumbs[] = [(string) $discussion->title, $url];

        $breadcrumbs = [
            '@context' => 'https://schema.org',
            '@type' => 'BreadcrumbList',
            'itemListElement' => array_map(
                fn (array $c, int $i) => ['@type' => 'ListItem', 'position' => $i + 1, 'name' => $c[0], 'item' => $c[1]],
                $crumbs,
                array_keys($crumbs),
            ),
        ];

        $document->head['ld-posting'] = self::jsonLd($posting);
        $document->head['ld-breadcrumbs'] = self::jsonLd($breadcrumbs);
    }

    public static function jsonLd(array $data): string
    {
        $json = json_encode(array_filter($data, fn ($v) => $v !== null), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP);

        return '<script type="application/ld+json">'.$json.'</script>';
    }

    public static function excerpt(string $html, int $limit = 160): string
    {
        $text = html_entity_decode(strip_tags($html), ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $text = preg_replace('~\(\s*https?://[^\s)]+\s*\)|https?://\S+~u', '', $text);
        $text = trim(preg_replace('/\s+/u', ' ', $text));
        $text = preg_replace('/\s+([,.;:!?])/u', '$1', $text);

        if (mb_strlen($text) <= $limit) {
            return $text;
        }

        $cut = mb_substr($text, 0, $limit - 1);
        $space = mb_strrpos($cut, ' ');

        return rtrim($space > $limit * 0.6 ? mb_substr($cut, 0, $space) : $cut, " ,.;:-").'…';
    }
}
