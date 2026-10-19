<?php

namespace ProektMap\Sso\Seo;

use Flarum\Discussion\Discussion;
use Flarum\Extension\ExtensionManager;
use Flarum\Http\SlugManager;
use Flarum\Http\UrlGenerator;
use Flarum\User\Guest;
use Laminas\Diactoros\Response\XmlResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

/**
 * /community/sitemap.xml — только то, что видит гость (без скрытого, неодобренного, приватного).
 */
class SitemapController implements RequestHandlerInterface
{
    private const LIMIT = 5000;

    public function __construct(
        private UrlGenerator $url,
        private SlugManager $slugs,
        private ExtensionManager $extensions,
    ) {
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $guest = new Guest();
        $forum = $this->url->to('forum');
        $entries = [[$forum->base().'/', null, 'daily', '0.8']];

        if ($this->extensions->isEnabled('flarum-tags')) {
            foreach (\Flarum\Tags\Tag::whereVisibleTo($guest)->orderBy('position')->get() as $tag) {
                $entries[] = [$forum->route('tag', ['slug' => $tag->slug]), $tag->last_posted_at, 'daily', '0.6'];
            }
        }

        $slugDriver = $this->slugs->forResource(Discussion::class);
        $discussions = Discussion::whereVisibleTo($guest)
            ->where('comment_count', '>', 0)
            ->orderByDesc('last_posted_at')
            ->limit(self::LIMIT)
            ->get();

        foreach ($discussions as $discussion) {
            $entries[] = [
                $forum->route('discussion', ['id' => $slugDriver->toSlug($discussion)]),
                $discussion->last_posted_at ?? $discussion->created_at,
                'weekly',
                '0.7',
            ];
        }

        $xml = '<?xml version="1.0" encoding="UTF-8"?>'."\n".'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'."\n";
        foreach ($entries as [$loc, $lastmod, $freq, $priority]) {
            $xml .= '  <url><loc>'.htmlspecialchars($loc, ENT_XML1).'</loc>'
                .($lastmod ? '<lastmod>'.$lastmod->toAtomString().'</lastmod>' : '')
                ."<changefreq>$freq</changefreq><priority>$priority</priority></url>\n";
        }
        $xml .= '</urlset>'."\n";

        return new XmlResponse($xml, 200, ['Cache-Control' => 'public, max-age=3600']);
    }
}
