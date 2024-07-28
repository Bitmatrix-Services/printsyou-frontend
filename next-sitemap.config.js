/** @type {import('next-sitemap').IConfig} */
module.exports = {
  sitemapBaseFileName: 'sitemap_pages',
  generateIndexSitemap: false,
  siteUrl: process.env.FE_URL,
  changefreq: 'monthly',
  generateRobotsTxt: false,
  exclude: ['/sitemap.xml', '/sitemap_*', '/robots.txt', '/api/*']
};
