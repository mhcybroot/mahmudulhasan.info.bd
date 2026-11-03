import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async (context) => {
  const projects = await getCollection('projects');
  const siteUrl = context.site?.toString().replace(/\/$/, '') || 'https://mahmudulhasan.info.bd';

  const items = projects
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime())
    .map((project) => `
    <item>
      <title><![CDATA[${project.data.title}]]></title>
      <link>${siteUrl}/systems/${project.data.slug}</link>
      <guid isPermaLink="true">${siteUrl}/systems/${project.data.slug}</guid>
      <description><![CDATA[${project.data.seo?.focusKeyword || project.data.title} — Stack: ${project.data.stack?.join(', ') || project.data.primaryLanguage} | Latency: ${project.data.metrics?.latency || 'Sub-second'} | Throughput: ${project.data.metrics?.throughput || 'High-Throughput'}]]></description>
      <author>info@mahmudulhasan.info.bd (Mahmudul Hasan)</author>
      <category>${project.data.primaryLanguage}</category>
      <pubDate>${new Date(project.data.date).toUTCString()}</pubDate>
    </item>`).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Mahmudul Hasan (@mhcybroot) — Engineered Systems</title>
    <link>${siteUrl}/</link>
    <description>Production-hardened concurrent backends, edge daemons, bare-metal hardware protocols and reactive systems portfolio.</description>
    <language>en-us</language>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(rss.trim(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
