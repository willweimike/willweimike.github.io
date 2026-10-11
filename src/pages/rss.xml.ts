import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { profileData } from '../data/profile';
import { withBase } from '../utils/url';

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

  return rss({
    title: `${profileData.name} — Writing & Technical Notes`,
    description: profileData.tagline,
    site: context.site ?? 'https://willweimike.github.io',
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: withBase(`/writing/${post.id}/`),
    })),
  });
}
