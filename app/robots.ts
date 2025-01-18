import type {MetadataRoute} from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/more-info',
        '/order-now',
        'https://api.printsyou.com',
        'https://chatwoot.printsyou.com/',
        '/faq',
        "/products/apparel/apparel-men's/hanes® ecosmart® 50/50-cotton/poly-t-shirt",
        '/products/home-amp-auto/auto-accessories-amp-safety/auto-safety kit',
        '/products/plush-amp-novelties/plush-8-½"/8-½"-big-paw-bear',
        '/products/headwear-amp-accessories/caps-cotton/district® mesh-back-cap',
        '/products/coolers/cooler-lunch-bags/café-cooler-bag',
        '/products/apparel/apparel-mens/hanes ecosmart 50/50-cotton/poly-t-shirt',
        '/products/headwear-amp-accessories/caps-cotton/district mesh-back-cap',
        '/sitemap_products.xml'
      ]
    },
    sitemap: 'https://printsyou.com/api/sitemap.xml'
  };
}
