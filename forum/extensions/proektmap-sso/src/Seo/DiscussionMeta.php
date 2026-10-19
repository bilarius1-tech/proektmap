<?php

namespace ProektMap\Sso\Seo;

use Flarum\Discussion\Discussion;
use Flarum\Frontend\Document;
use Flarum\Http\RequestUtil;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Support\Arr;
use ProektMap\Sso\SsoConfig;
use Psr\Http\Message\ServerRequestInterface;

/**
 * Описание и Open Graph для страниц форума. Картинка — генератор /api/og сайта.
 */
class DiscussionMeta
{
    public function __construct(
        private SettingsRepositoryInterface $settings,
        private SsoConfig $config,
    ) {
    }

    public function __invoke(Document $document, ServerRequestInterface $request): void
    {
        $siteName = (string) $this->settings->get('forum_title', 'ИИ Форум ProektMap');
        $title = $siteName;
        $description = (string) ($document->meta['description'] ?? '');
        $type = 'website';
        $tags = [];

        if ($request->getAttribute('routeName') === 'discussion') {
            $discussion = Discussion::whereVisibleTo(RequestUtil::getActor($request))
                ->with(['firstPost', 'tags'])
                ->find((int) Arr::get($request->getQueryParams(), 'id'));

            if ($discussion) {
                $title = (string) $discussion->title;
                $type = 'article';
                $excerpt = $discussion->firstPost ? self::excerpt($discussion->firstPost->formatContent($request)) : '';
                if ($excerpt !== '') {
                    $description = $excerpt;
                    $document->meta['description'] = $excerpt;
                }
                if ($discussion->relationLoaded('tags')) {
                    $tags = $discussion->tags->pluck('name')->take(3)->all();
                }
            }
        }

        $image = rtrim($this->config->siteUrl(), '/').'/api/og?'.http_build_query([
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

    public static function excerpt(string $html, int $limit = 160): string
    {
        $text = trim(preg_replace('/\s+/u', ' ', html_entity_decode(strip_tags($html), ENT_QUOTES | ENT_HTML5, 'UTF-8')));

        if (mb_strlen($text) <= $limit) {
            return $text;
        }

        $cut = mb_substr($text, 0, $limit - 1);
        $space = mb_strrpos($cut, ' ');

        return rtrim($space > $limit * 0.6 ? mb_substr($cut, 0, $space) : $cut, " ,.;:-").'…';
    }
}
