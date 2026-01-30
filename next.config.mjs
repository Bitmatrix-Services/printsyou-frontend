import responseHeaders from './headers.js';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: responseHeaders
      },
      // Cache static assets (JS, CSS, images) for 1 year
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      // Cache images
      {
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      // Cache fonts
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'printsyouassets.s3.amazonaws.com'
      }
    ],
    // Optimize image formats and quality
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // 1 year cache for optimized images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
  },
  // Enable compression
  compress: true,
  experimental: {
    optimizePackageImports: [
      '@mui/base',
      '@mui/joy',
      '@mui/x-date-pickers',
      'react-icons',
      'swiper',
      'aos',
      'lightgallery'
    ]
  },
  redirects: async () => [
    {
      source: '/sitemap.xml',
      destination: '/api/sitemap.xml',
      permanent: true
    },
    {
      source: '/home-amp-auto/food-containers/harvest-bento-box',
      destination: '/products/home-amp-auto/food-containers/harvest-bento-box',
      permanent: true
    },
    {
      source: '/categories/stress-relievers/slo-release',
      destination: '/categories/plush-amp-novelties/fidget-toys-amp-stress-relievers',
      permanent: true
    },
    {
      source: '/categories/technology/computer-accessories',
      destination: '/categories/desk-amp-office/computer-accessories',
      permanent: true
    },
    {
      source: '/leisure-amp-outdoor/beverage-coolers-amp-holders/neoprene-kan-cooler',
      destination: '/products/leisure-amp-outdoor/beverage-coolers-amp-holders/neoprene-kan-cooler',
      permanent: true
    },
    {
      source: '/products/plush-amp-novelties/plush-8-/8-big-paw-panda',
      destination: '/products/plush-amp-novelties/plush-8-8-big-paw-panda',
      permanent: true
    },
    {
      source: '/products/drinkware/mugs-stainless-steel-amp-copper/32-oz-brumate-toddy-xl',
      destination: '/products/drinkware/tumblers-stainless-steel/32-oz-brumate-toddy-xl',
      permanent: true
    },
    {
      source: '/products/leisure-amp-outdoor/beverage-coolers-amp-holders/12/16-oz.-brümate-hopsulator-trio',
      destination: '/products/leisure-amp-outdoor/beverage-coolers-amp-holders/12by16-oz-brumate-hopsulator-trio',
      permanent: true
    },
    {
      source: '/products/stress-relievers/construction/lightbulb-stress-reliever',
      destination: '/categories/plush-amp-novelties/fidget-toys-amp-stress-relievers',
      permanent: true
    },
    {
      source: '/drinkware/tumblers-single-amp-double-wall/tritan22',
      destination: '/products/drinkware/tumblers-single-amp-double-wall/tritan22',
      permanent: true
    },
    {
      source: '/categories/auto/air-fresheners',
      destination: '/categories/home-amp-auto/accessories-home-/-auto',
      permanent: true
    },
    {
      source: '/categories/tools/tape-measures',
      destination: '/categories/tools-lights-amp-key-tags/tape-measures',
      permanent: true
    },
    {
      source: '/categories/travel/personal-appearance',
      destination: '/categories/personal-care',
      permanent: true
    },
    {
      source: '/bags-duffels-amp-accessories/fanny-packs/matador-refraction-packable-sling',
      destination: '/products/bags-duffels-amp-accessories/fanny-packs/matador-refraction-packable-sling',
      permanent: true
    },
    {
      source: '/bags-duffels-amp-accessories/tote-bags-cotton-amp-canvas/camden-natural-jute-tote',
      destination: '/products/bags-duffels-amp-accessories/tote-bags-cotton-amp-canvas/camden-natural-jute-tote',
      permanent: true
    },
    {
      source: '/drinkware/mugs-glass/12-oz-tucson-glass-mug',
      destination: '/products/drinkware/mugs-glass/12-oz-tucson-glass-mug',
      permanent: true
    },
    {
      source: '/drinkware/tumblers-single-amp-double-wall/16-oz-travel-tumbler-with-straw',
      destination: '/products/drinkware/tumblers-single-amp-double-wall/16-oz-travel-tumbler-with-straw',
      permanent: true
    },
    {
      source: '/products/drinkware/tumblers-stainless-steel/26-oz.-brümate-multishaker',
      destination: '/products/drinkware/bottles-shaker/26-oz-brumate-multishaker',
      permanent: true
    },
    {
      source: '/products/leisure-amp-outdoor/beverage-coolers-amp-holders/12/16-oz.-brümate-hopsulator-trio',
      destination: '/products/leisure-amp-outdoor/beverage-coolers-amp-holders/12by16-oz-brumate-hopsulator-trio',
      permanent: true
    },
    {
      source: '/products/leisure-amp-outdoor/beverage-coolers-amp-holders/12/16-oz.-brümate-hopsulator-trio',
      destination: '/products/leisure-amp-outdoor/beverage-coolers-amp-holders/12by16-oz-brumate-hopsulator-trio',
      permanent: true
    },
    {
      source: '/products/leisure-amp-outdoor/beverage-coolers-amp-holders/12-oz.-brümate-hopsulator-slim',
      destination: '/products/drinkware/brumate/12-oz-brumate-hopsulator-slim',
      permanent: true
    },
    {
      source: '/products/plush-amp-novelties/pins/1-½""-full-color-pin-back-button',
      destination: '/products/plush-amp-novelties/pins/1-half-full-color-pin-back-button',
      permanent: true
    },
    {
      source: '/products/drinkware/mugs-stainless-steel-amp-copper/22-oz.-brümate-toddy',
      destination: '/products/drinkware/tumblers-stainless-steel/22-oz-brumate-toddy',
      permanent: true
    },
    {
      source: '/products/plush-amp-novelties/plush-8-/8-liberty-eagle',
      destination: '/products/plush-amp-novelties/plush-8-8-liberty-eagle',
      permanent: true
    },
    {
      source: '/products/plush-amp-novelties/plush-8-½"/8-½"-big-paw-panda',
      destination: '/products/plush-amp-novelties/plush-8-8-big-paw-panda',
      permanent: true
    },
    {
      source: '/products/drinkware/mugs-stainless-steel-amp-copper/32-oz.-brümate-toddy-xl',
      destination: '/products/drinkware/tumblers-stainless-steel/32-oz-brumate-toddy-xl',
      permanent: true
    },
    {
      source: '/products/drinkware/tumblers-stemless-wine/14-oz.-brümate-uncork’d-xl',
      destination: '/products/drinkware/tumblers-stainless-steel/14-oz-brumate-uncorkd-xl',
      permanent: true
    },
    {
      source: '/products/plush-amp-novelties/plush-8-/8-ole-time-rag-bear',
      destination: '/products/plush-amp-novelties/plush-8-8-ole-time-rag-bear',
      permanent: true
    },
    {
      source: '/products/drinkware/brumate/12/16-oz-brümate-hopsulator-trio',
      destination: '/products/leisure-amp-outdoor/beverage-coolers-amp-holders/12by16-oz-brumate-hopsulator-trio',
      permanent: true
    },
    {
      source: '/products/drinkware/tumblers-stemless-wine/14-oz-brümate-uncorkd-xl',
      destination: '/products/drinkware/tumblers-stainless-steel/14-oz-brumate-uncorkd-xl',
      permanent: true
    },
    {
      source: '/products/plush-amp-novelties/plush-8-½/8-½-big-paw-bear',
      destination: '/products/plush-amp-novelties/plush-8-8-big-paw-bear',
      permanent: true
    },
    {
      source: '/products/plush-amp-novelties/plush-8-/8-big-paw-bear',
      destination: '/products/plush-amp-novelties/plush-8-8-big-paw-bear',
      permanent: true
    },
    {
      source: '/products/leisure-amp-outdoor/beverage-coolers-amp-holders/12-oz-brumate-hopsulator-slim',
      destination: '/products/drinkware/brumate/12-oz-brumate-hopsulator-slim',
      permanent: true
    },
    {
      source: '/products/plush-amp-novelties/plush-8-½"/8-½"-ole\'-time-rag-bear',
      destination: '/products/plush-amp-novelties/plush-8-8-ole-time-rag-bear',
      permanent: true
    },
    {
      source: '/products/plush-amp-novelties/plush-8-/8-salty-shark',
      destination: '/products/plush-amp-novelties/plush-8-8-salty-shark',
      permanent: true
    },
    {
      source: '/products/plush-amp-novelties/plush-8-/8-big-paw-dog',
      destination: '/products/plush-amp-novelties/plush-8-8-big-paw-dog',
      permanent: true
    },
    {
      source: '/products/plush-amp-novelties/plush-8-/8-koko-koala',
      destination: '/products/plush-amp-novelties/plush-8-8-koko-koala',
      permanent: true
    },
    {
      source: '/products/leisure-amp-outdoor/beverage-coolers-amp-holders/12/16-oz-brümate-hopsulator-trio',
      destination: '/products/leisure-amp-outdoor/beverage-coolers-amp-holders/12by16-oz-brumate-hopsulator-trio',
      permanent: true
    },
    {
      source: '/products/drinkware/mugs-stainless-steel-amp-copper/32-oz-brümate-toddy-xl',
      destination: '/products/drinkware/tumblers-stainless-steel/32-oz-brumate-toddy-xl',
      permanent: true
    },
    {
      source: '/products/drinkware/mugs-stainless-steel-amp-copper/22-oz-brümate-toddy',
      destination: '/products/drinkware/tumblers-stainless-steel/22-oz-brumate-toddy',
      permanent: true
    },
    {
      source: '/products/drinkware/tumblers-stainless-steel/26-oz-brümate-multishaker',
      destination: '/products/drinkware/bottles-shaker/26-oz-brumate-multishaker',
      permanent: true
    },
    {
      source: '/products/drinkware/brumate/12/16-oz.-brümate-hopsulator-trio',
      destination: '/products/leisure-amp-outdoor/beverage-coolers-amp-holders/12by16-oz-brumate-hopsulator-trio',
      permanent: true
    },
    {
        source: '/products/apparel/jackets-hooded/outdoor-sports-windproof-and-waterproof-jacket',
        destination: '/products/apparel/promotional-jackets/outdoor-sports-windproof-and-waterproof-jacket',
        permanent: true
    },
    {
        source: '/products/apparel/jackets-hooded/windproof-fashionable-minimalist-hooded-outdoor-jacket',
        destination: '/products/apparel/promotional-jackets/windproof-fashionable-minimalist-hooded-outdoor-jacket',
        permanent: true
    },
    {
        source: '/products/apparel/jackets-hooded/mens-casual-and-versatile-outdoor-jacket',
        destination: '/products/apparel/promotional-jackets/mens-casual-and-versatile-outdoor-jacket',
        permanent: true
    },
    {
      source: '/products/worker-safety-products/high-visibility-safety-vest-with-pockets',
      destination: '/products/apparel/hi-vis-custom-safety-vests/high-visibility-safety-vest-with-pockets',
      permanent: true
    },
    // END OF COVERAGE 22-1-2024
    {
      destination: '/categories/amenities',
      source: '/categories/brands/flipstik®',
      permanent: true
    },
    {
      destination: '/categories/amenities',
      source: '/categories/brands/flipstik',
      permanent: true
    },
    {
      destination: '/categories/desk-amp-office/desk-accessories',
      source: '/categories/office/desk-accessories',
      permanent: true
    },
    {
      destination: '/categories/ceramic-mugs/mugs-8-oz-11-oz-',
      source: '/ceramic-mugs/mugs-8-oz-11-oz/11-oz-full-color-mug',
      permanent: true
    },
    {
      destination: '/categories/amenities/cases-amp-organizers',
      source: '/products/brands/aeroloft-travel/aeroloft-organizer-4-pocket-zip-organizer',
      permanent: true
    },
    {
      destination: '/categories/bags-duffels-amp-accessories/travel-amp-toiletry-bags',
      source: '/categories/bags/toiletry',
      permanent: true
    },
    {
      destination: '/categories/plush-amp-novelties/fidget-toys-amp-stress-relievers',
      source: '/categories/stress-relievers/construction',
      permanent: true
    },
    {
      destination: '/categories/kits/travel-kits',
      source: '/categories/travel/locks',
      permanent: true
    },
    {
      destination:
        '/blog/thoughtful-giving-heartfelt-moments-make-every-gift-special-with-printsyou-thoughtful-giving-heartfelt-moments-make-every-gift-special-with-printsyou-byjrmabjnko',
      source:
        '/blogs/thoughtful-giving-heartfelt-moments-make-every-gift-special-with-printsyou-thoughtful-giving-heartfelt-moments-make-every-gift-special-with-printsyou-byjrmabjnko.xml',
      permanent: true
    },
    {
      destination: '/products/blankets/weighted-blankets/sleep-tight-weighted-blanket',
      source: '/blankets/weighted-blankets/sleep-tight-weighted-blanket',
      permanent: true
    },
    {
      destination: '/products/bags-duffels-amp-accessories/tote-bags-non-woven/non-woven-economy-tote-bag',
      source: '/bags-duffels-amp-accessories/tote-bags-non-woven/non-woven-economy-tote-bag',
      permanent: true
    },
    {
      destination: '/products/drinkware/bottles-shaker/26-oz-brumate-multishaker',
      source: '/products/drinkware/tumblers-stainless-steel/26-oz.-brümate-multishaker',
      permanent: true
    },
    {
      destination: '/products/leisure-amp-outdoor/beverage-coolers-amp-holders/12by16-oz-brumate-hopsulator-trio',
      source: '/products/leisure-amp-outdoor/beverage-coolers-amp-holders/12/16-oz.-brümate-hopsulator-trio',
      permanent: true
    },
    {
      destination: '/products/leisure-amp-outdoor/beverage-coolers-amp-holders/12by16-oz-brumate-hopsulator-trio',
      source: '/products/leisure-amp-outdoor/beverage-coolers-amp-holders/12/16-oz.-brümate-hopsulator-trio',
      permanent: true
    },
    {
      destination: '/products/umbrellas/automatic-open-umbrellas/46-arc-umbrella',
      source: '/umbrellas/automatic-open-umbrellas/46-arc-umbrella',
      permanent: true
    },
    {
      destination: '/products/drinkware/tumblers-single-amp-double-wall/16-oz-double-wall-tumbler-with-candy',
      source: '/drinkware/tumblers-single-amp-double-wall/16-oz-double-wall-tumbler-with-candy',
      permanent: true
    },
    {
      destination: '/products/magnets-amp-stickers/magnet-stock-shapes-indoor-use/rectangle-magnet-605',
      source: '/magnets-amp-stickers/magnet-stock-shapes-indoor-use/rectangle-magnet-605',
      permanent: true
    },
    {
      destination: '/products/writing-instruments/stylus-pens-plastic/rexton-incline-stylus-pen',
      source: '/writing-instruments/stylus-pens-plastic/rexton-incline-stylus-pen',
      permanent: true
    },
    {
      destination: '/products/plush-amp-novelties/fans-amp-misters/mini-fan',
      source: '/plush-amp-novelties/fans-amp-misters/mini-fan',
      permanent: true
    },
    {
      destination: '/products/hitronics-amp-tech-accessories/speakers/rabs-amp-bamboo-speaker-amp-charger',
      source: '/hitronics-amp-tech-accessories/speakers/rabs-amp-bamboo-speaker-amp-charger',
      permanent: true
    },
    {
      destination: '/products/table-covers/6/flat-all-over-dye-sub-table-cover-3-sided-fits-6-table',
      source: '/table-covers/6/flat-all-over-dye-sub-table-cover-3-sided-fits-6-table',
      permanent: true
    },
    {
      destination: '/products/magnets-amp-stickers/magnet-stock-shapes-indoor-use/rectangle-magnet-606',
      source: '/magnets-amp-stickers/magnet-stock-shapes-indoor-use/rectangle-magnet-606',
      permanent: true
    },
    {
      destination: '/products/home-amp-auto/candles/bamboo-soy-candle-with-full-color-label',
      source: '/home-amp-auto/candles/bamboo-soy-candle-with-full-color-label',
      permanent: true
    },
    {
      destination: '/products/event-amp-trade-show-display/table-covers/table-runner-for-8-table',
      source: '/event-amp-trade-show-display/table-covers/table-runner-for-8-table',
      permanent: true
    },
    {
      destination: '/products/plush-amp-novelties/plush-8-8-excellent-elephant',
      source: '/products/plush-amp-novelties/plush-8-½"/8-½"-excellent-elephant',
      permanent: true
    },
    {
      destination: '/products/hitronics-amp-tech-accessories/cases-amp-cord-organizers/silicone-valley-earbuds-case',
      source: '/hitronics-amp-tech-accessories/cases-amp-cord-organizers/silicone-valley-earbuds-case',
      permanent: true
    },
    {
      destination: '/products/plush-amp-novelties/plush-8-8-salty-shark',
      source: '/products/plush-amp-novelties/plush-8-½"/8-½"-salty-shark',
      permanent: true
    },
    {
      destination: '/products/plush-amp-novelties/plush-8-8-big-paw-dog',
      source: '/products/plush-amp-novelties/plush-8-½"/8-½"-big-paw-dog',
      permanent: true
    },
    {
      destination: '/categories/leisure-amp-outdoor',
      source: '/categories/leisure-amp-outdoor/aws',
      permanent: true
    },
    {
      destination: '/categories/mugs',
      source: '/categories/ceramic-mugs/realtree®',
      permanent: true
    },
    {
      destination: '/categories/mugs',
      source: '/categories/ceramic-mugs/realtree',
      permanent: true
    },
    {
      destination: '/categories/personal-care',
      source: '/categories/wecare',
      permanent: true
    },
    {
      destination: '/products/drinkware/brumate/12-oz-brumate-hopsulator-slim',
      source: '/products/leisure-amp-outdoor/beverage-coolers-amp-holders/12-oz.-brümate-hopsulator-slim',
      permanent: true
    },
    {
      destination: '/categories',
      source: '/categories/virtual-reality',
      permanent: true
    },
    {
      destination: '/products/leisure-amp-outdoor/blankets/sweet-dreams-plush-blanket',
      source: '/leisure-amp-outdoor/blankets/sweet-dreams-plush-blanket',
      permanent: true
    },
    {
      destination: '/products/plush-amp-novelties/plush-8-8-koko-koala',
      source: '/products/plush-amp-novelties/plush-8-½"/8-½"-koko-koala',
      permanent: true
    },
    {
      destination: '/categories/headwear-amp-accessories/caps-sports-amp-hit-dry',
      source: '/categories/headwear-amp-accessories/caps---sports-amp-hit-dry',
      permanent: true
    },
    {
      destination: '/products/drinkware/barware-stainless-steel/25-oz-brumate-winesulator',
      source: '/products/drinkware/bottles-stainless-steel-amp-aluminum/25-oz.-brümate-winesulator™',
      permanent: true
    },
    {
      destination: '/categories',
      source: '/categories/individual-drop-shipping',
      permanent: true
    },
    {
      destination: '/categories/writing-instruments',
      source: '/categories/writing-instruments/aws',
      permanent: true
    },
    {
      destination: '/categories/apparel/hoodies-adult',
      source: '/apparel/hoodies-adult',
      permanent: true
    },
    {
      destination: '/products/plush-amp-novelties/pins/1-half-full-color-pin-back-button',
      source: '/products/plush-amp-novelties/pins/1-½"-full-color-pin-back-button',
      permanent: true
    },
    {
      destination: '/categories',
      source: '/categories/global-resource',
      permanent: true
    },
    {
      destination: '/products/plush-amp-novelties/plush-8-8-mystic-unicorn',
      source: '/products/plush-amp-novelties/plush-8-½"/8-½"-mystic-unicorn',
      permanent: true
    },
    {
      destination: '/products/plush-amp-novelties/plush-8-8-mystic-unicorn',
      source: '/products/plush-amp-novelties/plush-8-/8-mystic-unicorn',
      permanent: true
    },
    {
      destination: '/products/kits/happys/work-anniversary-happys',
      source: '/kits/happys/work-anniversary-happys',
      permanent: true
    },
    {
      destination: '/products/drinkware/tumblers-stainless-steel/22-oz-brumate-toddy',
      source: '/products/drinkware/mugs-stainless-steel-amp-copper/22-oz.-brümate-toddy',
      permanent: true
    },
    {
      destination: '/products/drinkware/tumblers-stainless-steel/22-oz-brumate-toddy',
      source: '/products/drinkware/mugs-stainless-steel-amp-copper/22-oz-brumate-toddy',
      permanent: true
    },
    {
      destination: '/categories/hitronics-amp-tech-accessories',
      source: '/categories/hitronics-amp-tech-accessories/smart-plugs-amp-sockets',
      permanent: true
    },
    {
      destination: '/categories/hitronics-amp-tech-accessories/usb-drives-amp-hubs',
      source: '/categories/usb-drives',
      permanent: true
    },
    {
      destination: '/products/plush-amp-novelties/plush-8-8-liberty-eagle',
      source: '/products/plush-amp-novelties/plush-8-½"/8-½"-liberty-eagle',
      permanent: true
    },
    {
      destination: '/products/personal-care/wet-wipes/single-use-alcohol-antibacterial-wipe',
      source: '/personal-care/wet-wipes/single-use-alcohol-antibacterial-wipe',
      permanent: true
    },
    {
      destination: '/products/drinkware/tumblers-stainless-steel/32-oz-brumate-toddy-xl',
      source: '/products/drinkware/mugs-stainless-steel-amp-copper/32-oz.-brümate-toddy-xl',
      permanent: true
    },
    {
      destination: '/products/drinkware/tumblers-stainless-steel/14-oz-brumate-uncorkd-xl',
      source: '/products/drinkware/tumblers-stemless-wine/14-oz.-brümate-uncork’d-xl',
      permanent: true
    },
    {
      destination: '/products/leisure-amp-outdoor/sports-amp-fitness-accessories/deluxe-multi-function-pedometer',
      source: '/leisure-amp-outdoor/sports-amp-fitness-accessories/deluxe-multi-function-pedometer',
      permanent: true
    },
    {
      destination: '/products/home-amp-auto/kitchen-accessories/round-shape-clip',
      source: '/home-amp-auto/kitchen-accessories/round-shape-clip',
      permanent: true
    },
    {
      destination: '/products/home-amp-auto/utensils-cooking-amp-baking-3-in-1-grip-flip-amp-scoop-kitchen-tool',
      source: '/products/home-amp-auto/utensils-cooking-amp-baking/3-in-1-grip,-flip-&-scoop-kitchen-tool',
      permanent: true
    },
    {
      destination: '/products/plush-amp-novelties/plush-8-8-liberty-eagle',
      source: '/plush-amp-novelties/plush-8-8-liberty-eagle',
      permanent: true
    },
    {
      destination: '/products/plush-amp-novelties/plush-8-8-ole-time-rag-bear',
      source: '/products/plush-amp-novelties/plush-8-½"/8-½"-ole\'-time-rag-bear',
      permanent: true
    },
    {
      destination: '/categories/sunglasses-amp-eyewear',
      source: '/categories/sunglasses-amp-eyewear/realtree®',
      permanent: true
    },
    {
      destination: '/products/gourmet-food-gifts/nuts-tins/candy-window-tin',
      source: '/gourmet-food-gifts/nuts-tins/candy-window-tin',
      permanent: true
    },
    {
      destination: '/products/drinkware/straws/3pack-park-avenue-stainless-straw-kit-with-cotton-pouch',
      source: '/drinkware/straws/3pack-park-avenue-stainless-straw-kit-with-cotton-pouch',
      permanent: true
    },
    {
      destination: '/products/amenities/combs-amp-brushes/brush-and-mirror-compact',
      source: '/amenities/combs-amp-brushes/brush-and-mirror-compact',
      permanent: true
    },
    {
      destination: '/products/leisure-amp-outdoor/camping-gear/northwoods-cooler-bag',
      source: '/leisure-amp-outdoor/camping-gear/northwoods-cooler-bag',
      permanent: true
    },
    {
      destination: '/products/leisure-amp-outdoor/camping-gear/the-party-cup',
      source: '/leisure-amp-outdoor/camping-gear/the-party-cup',
      permanent: true
    },
    {
      destination:
        '/products/special-packaging/food-/-snack-stuffer/large-chest-box-with-trail-mix-almonds-and-mixed-nuts',
      source: '/special-packaging/food-/-snack-stuffer/large-chest-box-with-trail-mix-almonds-and-mixed-nuts',
      permanent: true
    },
    {
      destination: '/categories/sunglasses-amp-eyewear',
      source: '/categories/sunglasses-amp-eyewear/aws',
      permanent: true
    },
    {
      destination: '/products/drinkware/tumblers-stemless-wine/12-oz-vinay-stemless-wine-glass',
      source: '/drinkware/tumblers-stemless-wine/12-oz-vinay-stemless-wine-glass',
      permanent: true
    },
    {
      destination: '/products/apparel/apparel-mens/hanes-ecosmart-50-50-cotton/poly-t-shirt',
      source: '/products/apparel/apparel-mens/hanesecosmart50/50-cotton/poly-t-shirt',
      permanent: true
    },
    {
      destination: '/products/leisure-amp-outdoor/beverage-coolers-amp-holders/12by16-oz-brumate-hopsulator-trio',
      source: '/products/drinkware/brumate/12/16-oz-brümate-hopsulator-trio',
      permanent: true
    },
    {
      destination: '/categories',
      source: '/promotional-products',
      permanent: true
    },
    {
      destination: '/products/drinkware/tumblers-stainless-steel/14-oz-brumate-uncorkd-xl',
      source: '/products/drinkware/tumblers-stemless-wine/14-oz-brümate-uncorkd-xl',
      permanent: true
    },
    {
      destination: '/products/plush-amp-novelties/plush-8-8-big-paw-panda',
      source: '/products/plush-amp-novelties/plush-8-½/8-½-big-paw-panda',
      permanent: true
    },
    {
      destination: '/products/drinkware/brumate/12-oz-brumate-hopsulator-slim',
      source: '/products/leisure-amp-outdoor/beverage-coolers-amp-holders/12-oz-brümate-hopsulator-slim',
      permanent: true
    },
    {
      destination: '/products/headwear-amp-accessories/caps-cotton/district-mesh-back-cap',
      source: '/products/headwear-amp-accessories/caps-cotton/districtmesh-back-cap',
      permanent: true
    },
    {
      destination: '/products/plush-amp-novelties/plush-8-8-ole-time-rag-bear',
      source: '/products/plush-amp-novelties/plush-8-½/8-½-ole-time-rag-bear',
      permanent: true
    },
    {
      destination: '/products/leisure-amp-outdoor/beverage-coolers-amp-holders/12by16-oz-brumate-hopsulator-trio',
      source: '/products/leisure-amp-outdoor/beverage-coolers-amp-holders/12/16-oz-brümate-hopsulator-trio',
      permanent: true
    },
    {
      destination: '/products/plush-amp-novelties/plush-8-8-liberty-eagle',
      source: '/products/plush-amp-novelties/plush-8-½/8-½-liberty-eagle',
      permanent: true
    },
    {
      destination: '/categories/bags-duffels-amp-accessories/tote-bags-non-woven',
      source: '/categories/bags-duffels-amp-accessories/tote-bagsnon-woven',
      permanent: true
    },
    {
      destination: '/products/drinkware/barware-stainless-steel/25-oz-brumate-winesulator',
      source: '/products/drinkware/bottles-stainless-steel-amp-aluminum/25-oz-brumate-winesulator',
      permanent: true
    },
    {
      destination: '/products/plush-amp-novelties/plush-8-8-salty-shark',
      source: '/products/plush-amp-novelties/plush-8-½/8-½-salty-shark',
      permanent: true
    },
    {
      destination: '/products/plush-amp-novelties/plush-8-8-big-paw-dog',
      source: '/products/plush-amp-novelties/plush-8-½/8-½-big-paw-dog',
      permanent: true
    },
    {
      destination: '/products/leisure-amp-outdoor/beverage-coolers-amp-holders/12by16-oz-brumate-hopsulator-trio',
      source: '/products/leisure-amp-outdoor/beverage-coolers-amp-holders-12by16-oz-brumate-hopsulator-trio',
      permanent: true
    },
    {
      destination: '/products/plush-amp-novelties/plush-8-8-koko-koala',
      source: '/products/plush-amp-novelties/plush-8-½/8-½-koko-koala',
      permanent: true
    },
    {
      destination: '/products/drinkware/tumblers-stainless-steel/32-oz-brumate-toddy-xl',
      source: '/products/drinkware/mugs-stainless-steel-amp-copper/32-oz-brümate-toddy-xl',
      permanent: true
    },
    {
      destination: '/categories/desk-amp-office/realtree',
      source: '/categories/sunglasses-amp-eyewear/realtree',
      permanent: true
    },
    {
      destination: '/categories/drinkware',
      source: '/categories/drinkware/realtree',
      permanent: true
    },
    {
      destination: '/products/plush-amp-novelties/plush-8-8-mystic-unicorn',
      source: '/products/plush-amp-novelties/plush-8-½/8-½-mystic-unicorn',
      permanent: true
    },
    {
      destination: '/categories/headwear-amp-accessories/caps-sports-amp-hit-dry',
      source: '/categories/headwear-amp-accessories/capssports-amp-hit-dry',
      permanent: true
    },
    {
      destination: '/products/drinkware/tumblers-stainless-steel/22-oz-brumate-toddy',
      source: '/products/drinkware/mugs-stainless-steel-amp-copper/22-oz-brümate-toddy',
      permanent: true
    },
    {
      destination: '/products/home-amp-auto/utensils-cooking-amp-baking-3-in-1-grip-flip-amp-scoop-kitchen-tool',
      source: '/products/home-amp-auto/utensils-cooking-amp-baking/3-in-1-grip,-flip-amp-scoop-kitchen-tool',
      permanent: true
    },
    {
      destination: '/products/drinkware/bottles-shaker/26-oz-brumate-multishaker',
      source: '/products/drinkware/tumblers-stainless-steel/26-oz-brümate-multishaker',
      permanent: true
    },
    {
      destination: '/products/drinkware/bottles-shaker/26-oz-brumate-multishaker',
      source: '/products/drinkware/tumblers-stainless-steel/26-oz-brumate-multishaker',
      permanent: true
    },
    {
      destination: '/products/plush-amp-novelties/pins/1-half-full-color-pin-back-button',
      source: '/products/plush-amp-novelties/pins/1-½-full-color-pin-back-button',
      permanent: true
    },
    {
      destination: '/products/plush-amp-novelties/pins/1-half-full-color-pin-back-button',
      source: '/products/plush-amp-novelties/pins/1-full-color-pin-back-button',
      permanent: true
    },
    {
      destination: '/categories/gourmet-food-gifts/chocolates-individually-wrapped',
      source: '/categories/gourmet-food-gifts/chocolatesindividually-wrapped',
      permanent: true
    },
    {
      destination: '/products/apparel/apparel-ladies/mountain-standard-alma-down-jacket',
      source: '/apparel/apparel-ladies/mountain-standard-alma-down-jacket',
      permanent: true
    },
    {
      destination: '/products/leisure-amp-outdoor/towels-sports-amp-fitness/15-x-18-microfiber-rally-towel',
      source: '/leisure-amp-outdoor/towels-sports-amp-fitness/15-x-18-microfiber-rally-towel',
      permanent: true
    },
    {
      destination: '/products/leisure-amp-outdoor/beverage-coolers-amp-holders/12by16-oz-brumate-hopsulator-trio',
      source: '/products/drinkware/brumate/12/16-oz.-brümate-hopsulator-trio',
      permanent: true
    },
    {
      destination: '/products/leisure-amp-outdoor/beverage-coolers-amp-holders/12by16-oz-brumate-hopsulator-trio',
      source: '/products/drinkware/brumate/12/16-oz.-br\u00fcmate-hopsulator-trio',
      permanent: true
    },
    {
      destination: '/products/plush-amp-novelties/plush-8-8-excellent-elephant',
      source: '/products/plush-amp-novelties/plush-8-½/8-½-excellent-elephant',
      permanent: true
    },
    {
      destination: '/products/plush-amp-novelties/plush-8-8-excellent-elephant',
      source: '/products/plush-amp-novelties/plush-8-/8-excellent-elephant',
      permanent: true
    },
    {
      destination: '/products/full-color-retail-boxes/custom-retail-box',
      source: '/products/full-color-retail-boxes/custom-box-stock-designs/custom-retail-box',
      permanent: true
    },
    {
      destination: '/products/full-color-retail-boxes/custom-box-stock-designs/custom-full-color-box',
      source: '/products/leisure-amp-outdoor/beach-balls-mats-amp-accessories/12"-beach-ball',
      permanent: true
    },
    {
      destination: '/categories/portfolios-amp-notebooks/pen-included',
      source: '/categories/journals-&amp;-notepads/journal-with-pen',
      permanent: true
    },
    {
      destination: '/categories/amenities',
      source: '/categories/amenities/aws',
      permanent: true
    },
    {
      destination: '/categories/amenities/hot-amp-cold-packs',
      source: '/categories/aqua-pearls-hot-&amp;-cold-packs/plush',
      permanent: true
    },
    {
      destination: '/categories/desk-amp-office/calculators',
      source: '/categories/office/calculators-&amp;-rulers',
      permanent: true
    },
    {
      destination: '/categories/leisure-amp-outdoor',
      source: '/categories/outdoors-&amp;-leisure/raingear',
      permanent: true
    },
    {
      destination: '/categories/umbrellas',
      source: '/categories/outdoors-&-leisure/umbrellas',
      permanent: true
    },
    {
      destination: '/categories/kits/home-amp-office-kits',
      source: '/categories/office/dusters-&-brushes',
      permanent: true
    },
    {
      destination: '/categories/plush-amp-novelties',
      source: '/categories/aws-collection',
      permanent: true
    },
    {
      destination: '/categories/desk-amp-office/calculators',
      source: '/categories/office/calculators-&-rulers',
      permanent: true
    },
    {
      destination: '/categories/amenities/hot-amp-cold-packs',
      source: '/categories/aqua-pearls-hot-&amp;-cold-packs/mini-shapes',
      permanent: true
    },
    {
      destination: '/categories/personal-care/sunscreen',
      source: '/categories/health-&-wellness/sunscreens',
      permanent: true
    },
    {
      destination: '/categories/portfolios-amp-notebooks/pen-included',
      source: '/categories/journals-&-notepads/journal-with-pen',
      permanent: true
    },
    {
      destination: '/categories/kits/health-amp-wellness-kits',
      source: '/categories/health-&-wellness/pedometers-step-counters',
      permanent: true
    },
    {
      destination: '/categories/personal-care/hand-sanitizers',
      source: '/categories/health-&-wellness/sanitizers',
      permanent: true
    },
    {
      destination: '/categories/leisure-amp-outdoor/towels-sports-amp-fitness',
      source: '/categories/outdoors-&-leisure/towels',
      permanent: true
    },
    {
      destination: '/categories/home-amp-auto/home-accessories',
      source: '/categories/home/dusters-&amp;-squeegees',
      permanent: true
    },
    {
      destination: '/categories/sunglasses-amp-eyewear',
      source: '/categories/outdoors-&amp;-leisure/sunglasses',
      permanent: true
    },
    {
      destination: '/categories/amenities/hot-amp-cold-packs',
      source: '/categories/aqua-pearls-hot-&-cold-packs/mini-shapes',
      permanent: true
    },
    {
      destination: '/categories/hitronics-amp-tech-accessories/headphones',
      source: '/categories/audio/headphones-&-earbuds',
      permanent: true
    },
    {
      destination: '/categories/kits/health-amp-wellness-kits',
      source: '/categories/health-&-wellness/wonder-beads',
      permanent: true
    },
    {
      destination: '/categories/home-amp-auto/home-accessories',
      source: '/categories/home/dusters-&-squeegees',
      permanent: true
    },
    {
      destination: '/categories/portfolios-amp-notebooks/journals',
      source: '/categories/journals-&-notepads/softcover',
      permanent: true
    },
    {
      destination: '/categories/leisure-amp-outdoor',
      source: '/categories/outdoors-&-leisure/event-gear',
      permanent: true
    },
    {
      destination: '/categories/leisure-amp-outdoor',
      source: '/categories/outdoors-&-leisure/raingear',
      permanent: true
    },
    {
      destination: '/categories/blankets',
      source: '/categories/outdoors-&-leisure/blankets-inventory',
      permanent: true
    },
    {
      destination: '/categories/plush-amp-novelties/fidget-toys-amp-stress-relievers',
      source: '/categories/stress-relievers/fruits-&-veggies',
      permanent: true
    },
    {
      destination: '/categories/plush-amp-novelties/fidget-toys-amp-stress-relievers',
      source: '/categories/stress-relievers/space-&-science',
      permanent: true
    },
    {
      destination: '/categories/plush-amp-novelties/pet-accessories',
      source: '/categories/sports-&-fitness/pet',
      permanent: true
    },
    {
      destination: '/categories/amenities/spa-sets-amp-travel-comfort-accessories',
      source: '/categories/health-&-wellness/spa-items',
      permanent: true
    },
    {
      destination: '/categories/portfolios-amp-notebooks/journals',
      source: '/categories/journals-&-notepads',
      permanent: true
    },
    {
      destination: '/categories/portfolios-amp-notebooks/journals',
      source: '/categories/journals-&-notepads/hardcover',
      permanent: true
    },
    {
      destination: '/categories/apparel',
      source: '/categories/outdoors-&-leisure/apparel',
      permanent: true
    },
    {
      destination: '/categories/plush-amp-novelties/fidget-toys-amp-stress-relievers',
      source: '/categories/stress-relievers/earth-&-nature',
      permanent: true
    },
    {
      destination: '/categories/amenities/hot-amp-cold-packs',
      source: '/categories/aqua-pearls-hot-&-cold-packs/aqua-pearls-original',
      permanent: true
    },
    {
      destination: '/categories/amenities/hot-amp-cold-packs',
      source: '/categories/aqua-pearls-hot-&-cold-packs/theraputic',
      permanent: true
    },
    {
      destination: '/categories/kits/health-amp-wellness-kits',
      source: '/categories/health-&-wellness',
      permanent: true
    },
    {
      destination: '/categories/sunglasses-amp-eyewear',
      source: '/categories/outdoors-&-leisure/sunglasses',
      permanent: true
    },
    {
      destination: '/categories/hitronics-amp-tech-accessories/chargers-auto-amp-adapters',
      source: '/categories/technology/adapters-&-cables',
      permanent: true
    },
    {
      destination: '/categories/leisure-amp-outdoor',
      source: '/categories/outdoors-&-leisure',
      permanent: true
    },
    {
      destination: '/categories/leisure-amp-outdoor',
      source: '/categories/outdoors-&-leisure/cooling-scarves',
      permanent: true
    },
    {
      destination: '/categories/plush-amp-novelties/puzzles-amp-games',
      source: '/categories/outdoors-&-leisure/games',
      permanent: true
    },
    {
      destination: '/categories/headwear-amp-accessories',
      source: '/categories/outdoors-&-leisure/headwear',
      permanent: true
    },
    {
      destination: '/categories/plush-amp-novelties/plush-special-packaging',
      source: '/categories/aqua-pearls-hot-&-cold-packs/plush',
      permanent: true
    },
    {
      destination: '/categories/kits/health-amp-wellness-kits',
      source: '/categories/health-&-wellness/comfortclay',
      permanent: true
    },
    {
      destination: '/categories/kits/health-amp-wellness-kits',
      source: '/categories/health-&-wellness/fitness-trackers',
      permanent: true
    },
    {
      destination: '/categories/personal-care/lip-balms-amp-lip-moisturizers',
      source: '/categories/health-&-wellness/lip-balms',
      permanent: true
    },
    {
      destination: '/categories/leisure-amp-outdoor/planters-amp-gardening-accessories',
      source: '/categories/outdoors-&-leisure/garden',
      permanent: true
    },
    {
      destination: '/categories/industry-essentials/sports-amp-fitness-products',
      source: '/categories/sports-&-fitness',
      permanent: true
    },
    {
      destination: '/categories/industry-essentials/sports-amp-fitness-products',
      source: '/categories/sports-&-fitness/bicycle-items',
      permanent: true
    },
    {
      destination: '/categories/amenities/hot-amp-cold-packs',
      source: '/categories/aqua-pearls-hot-&-cold-packs',
      permanent: true
    },
    {
      destination: '/categories/kits/health-amp-wellness-kits',
      source: '/categories/health-&-wellness/pedometers-multi-function',
      permanent: true
    },
    {
      destination: '/categories/amenities/cases-amp-organizers',
      source: '/categories/health-&-wellness/pill-boxes',
      permanent: true
    },
    {
      destination: '/categories/plush-amp-novelties/fidget-toys-amp-stress-relievers',
      source: '/categories/stress-relievers/food-&-beverage',
      permanent: true
    },
    {
      destination: '/categories/plush-amp-novelties/fidget-toys-amp-stress-relievers',
      source: '/categories/stress-relievers/super-heroes-&-fantasy',
      permanent: true
    },
    {
      destination: '/categories/blankets',
      source: '/categories/outdoors-&-leisure/blankets',
      permanent: true
    },
    {
      destination: '/categories/industry-essentials/sports-amp-fitness-products',
      source: '/categories/sports-&-fitness/exercise-equipment',
      permanent: true
    },
    {
      destination: '/categories/bags-duffels-amp-accessories/pouches',
      source: '/categories/bags/pouches-&-cases',
      permanent: true
    },
    {
      destination: '/categories/drinkware',
      source: '/categories/drinkware/insulated-bottles-&-tumblers',
      permanent: true
    },
    {
      destination: '/categories/kits/health-amp-wellness-kits',
      source: '/categories/health-&-wellness/eye-mask',
      permanent: true
    },
    {
      destination: '/categories/amenities/massagers',
      source: '/categories/health-&-wellness/massagers-&-scratchers',
      permanent: true
    },
    {
      destination: '/categories/personal-care',
      source: '/categories/health-&-wellness/personal-care',
      permanent: true
    },
    {
      destination: '/categories/desk-amp-office/clips-amp-magnets',
      source: '/categories/home/magnets-&-clips',
      permanent: true
    },
    {
      destination: '/categories/writing-instruments/highlighters-amp-highlighter-pens',
      source: '/categories/office/pens-&-highlighters',
      permanent: true
    },
    {
      destination: '/categories/desk-amp-office/fans',
      source: '/categories/outdoors-&-leisure/fans',
      permanent: true
    },
    {
      destination: '/categories/plush-amp-novelties/fidget-toys-amp-stress-relievers',
      source: '/categories/stress-relievers/shapes-&-symbols',
      permanent: true
    },
    // END OF COVERAGE FILE
    {
      destination: '/categories/amenities/cases-amp-organizers',
      source: '/categories/technology/organizers-&-cases',
      permanent: true
    },
    {
      destination: '/categories/personal-care/stain-removers',
      source: '/categories/travel/stain-&-lint-removers',
      permanent: true
    },
    {
      destination: '/categories/sunglasses-amp-eyewear/eyewear-adult',
      source: '/categories/sunglasses-amp-eyewear/eyewearadult',
      permanent: true
    },
    {
      destination: '/categories/ceramic-mugs/mugs-dye-sublimation',
      source: '/categories/ceramic-mugs/mugsdye-sublimation',
      permanent: true
    },
    {
      destination: '/categories/mints-candy-amp-gum/mints-printed',
      source: '/categories/mints-candy-amp-gum/mintsprinted',
      permanent: true
    },
    {
      destination: '/categories/ceramic-mugs/mugs-stoneware',
      source: '/categories/ceramic-mugs/mugsstoneware',
      permanent: true
    },
    {
      destination: '/categories/event-amp-trade-show-display/flags-garden',
      source: '/categories/event-amp-trade-show-display/flagsgarden',
      permanent: true
    },
    {
      destination: '/categories/drawstrings-amp-backpacks/backpacks-laptop',
      source: '/categories/drawstrings-amp-backpacks/backpackslaptop',
      permanent: true
    },
    {
      destination: '/categories/drinkware/mugs-single-amp-double-wall',
      source: '/categories/drinkware/mugssingle-amp-double-wall',
      permanent: true
    },
    {
      destination: '/categories/tools-lights-amp-key-tags/safety-lights-amp-reflectors',
      source: '/categories/tools-lights-amp-key-tags/safetylights-amp-reflectors',
      permanent: true
    },
    {
      destination: '/categories/gourmet-food-gifts/chocolates-bags',
      source: '/categories/gourmet-food-gifts/chocolatesbags',
      permanent: true
    },
    {
      destination: '/categories/event-amp-trade-show-display/flags-table-top',
      source: '/categories/event-amp-trade-show-display/flagstable-top',
      permanent: true
    },
    {
      destination: '/categories/headwear-amp-accessories/caps-cotton',
      source: '/categories/headwear-amp-accessories/capscotton',
      permanent: true
    },
    {
      destination: '/categories/headwear-amp-accessories/caps-sports-amp-hit-dry',
      source: '/categories/headwear-amp-accessories/capssports-amp-hit-dry',
      permanent: true
    },
    {
      destination: '/categories/bags-duffels-amp-accessories/tote-bags-wine',
      source: '/categories/bags-duffels-amp-accessories/tote-bagswine',
      permanent: true
    },
    {
      destination: '/categories/drawstrings-amp-backpacks/backpacks-nylon-amp-polyester',
      source: '/categories/drawstrings-amp-backpacks/backpacksnylon-amp-polyester',
      permanent: true
    },
    {
      destination: '/categories/apparel/jackets-hooded',
      source: '/categories/apparel/jacketshooded',
      permanent: true
    },
    {
      destination: '/categories/writing-instruments/ballpoint-pens-plastic-sleek-write',
      source: '/categories/writing-instruments/ballpoint-pensplastic-sleek-write',
      permanent: true
    },
    {
      destination: '/categories/home-amp-auto/utensils-portable',
      source: '/categories/home-amp-auto/utensilsportable',
      permanent: true
    },
    {
      destination: '/categories/drinkware/bottles-plastic',
      source: '/categories/drinkware/bottlesplastic',
      permanent: true
    },
    {
      destination: '/categories/special-packaging/custom-box-window',
      source: '/categories/special-packaging/custom-boxwindow',
      permanent: true
    },
    {
      destination: '/categories/full-color-retail-boxes/custom-box-stock-designs',
      source: '/categories/full-color-retail-boxes/custom-boxstock-designs',
      permanent: true
    },
    {
      destination: '/categories/plush-amp-novelties/plush-custom',
      source: '/categories/plush-amp-novelties/plushcustom',
      permanent: true
    },
    {
      destination: '/categories/drawstrings-amp-backpacks/drawstring-sports-packs-nfl-approved',
      source: '/categories/drawstrings-amp-backpacks/drawstring-sports-packsnfl-approved',
      permanent: true
    },
    {
      destination: '/categories/tools-lights-amp-key-tags/safety-whistles',
      source: '/categories/tools-lights-amp-key-tags/safetywhistles',
      permanent: true
    },
    {
      destination: '/categories/ceramic-mugs/tumblers-stoneware',
      source: '/categories/ceramic-mugs/tumblersstoneware',
      permanent: true
    },
    {
      destination: '/categories/gourmet-food-gifts/gourmet-gifts-drinkware',
      source: '/categories/gourmet-food-gifts/gourmet-giftsdrinkware',
      permanent: true
    },
    {
      destination: '/categories/headwear-amp-accessories/caps-mesh-back',
      source: '/categories/headwear-amp-accessories/capsmesh-back',
      permanent: true
    },
    {
      destination: '/categories/apparel/apparel-unisex',
      source: '/categories/apparel/apparelunisex',
      permanent: true
    },
    {
      destination: '/categories/writing-instruments/stylus-pens-multi-function',
      source: '/categories/writing-instruments/stylus-pensmulti-function',
      permanent: true
    },
    {
      destination: '/categories/ceramic-mugs/mugs-soup-amp-spooner',
      source: '/categories/ceramic-mugs/mugssoup-amp-spooner',
      permanent: true
    },
    {
      destination: '/categories/mints-candy-amp-gum/candy-glass-containers',
      source: '/categories/mints-candy-amp-gum/candyglass-containers',
      permanent: true
    },
    {
      destination: '/categories/sunglasses-amp-eyewear/sunglasses-rubberized',
      source: '/categories/sunglasses-amp-eyewear/sunglassesrubberized',
      permanent: true
    },
    {
      destination: '/categories/special-packaging/custom-box-video',
      source: '/categories/special-packaging/custom-boxvideo',
      permanent: true
    },
    {
      destination: '/categories/sunglasses-amp-eyewear/sunglasses-malibu',
      source: '/categories/sunglasses-amp-eyewear/sunglassesmalibu',
      permanent: true
    },
    {
      destination: '/categories/drinkware/bottles-sports-amp-collapsible',
      source: '/categories/drinkware/bottlessports-amp-collapsible',
      permanent: true
    },
    {
      destination: '/categories/headwear-amp-accessories/caps-polyester',
      source: '/categories/headwear-amp-accessories/capspolyester',
      permanent: true
    },
    {
      destination: '/categories/tools-lights-amp-key-tags/key-lights-plastic',
      source: '/categories/tools-lights-amp-key-tags/key-lightsplastic',
      permanent: true
    },
    {
      destination: '/categories/gourmet-food-gifts/nuts-boxes',
      source: '/categories/gourmet-food-gifts/nutsboxes',
      permanent: true
    },
    {
      destination: '/categories/hitronics-amp-tech-accessories/chargers-wireless',
      source: '/categories/hitronics-amp-tech-accessories/chargerswireless',
      permanent: true
    },
    {
      destination: '/categories/bags-duffels-amp-accessories/tote-bags-cotton-amp-canvas',
      source: '/categories/bags-duffels-amp-accessories/tote-bagscotton-amp-canvas',
      permanent: true
    },
    {
      destination: '/categories/bags-duffels-amp-accessories/tote-bags-nylon-amp-polyester',
      source: '/categories/bags-duffels-amp-accessories/tote-bagsnylon-amp-polyester',
      permanent: true
    },
    {
      destination: '/categories/apparel/tees-recycled',
      source: '/categories/apparel/teesrecycled',
      permanent: true
    },
    {
      destination: '/categories/drinkware/bottles-stainless-steel-amp-aluminum',
      source: '/categories/drinkware/bottlesstainless-steel-amp-aluminum',
      permanent: true
    },
    {
      destination: '/categories/gourmet-food-gifts/gourmet-gifts-bags',
      source: '/categories/gourmet-food-gifts/gourmet-giftsbags',
      permanent: true
    },
    {
      destination: '/categories/ceramic-mugs/mugs-12-oz-14-oz-',
      source: '/categories/ceramic-mugs/mugs12-oz-14-oz-',
      permanent: true
    },
    {
      destination: '/categories/headwear-amp-accessories/caps-6-panel',
      source: '/categories/headwear-amp-accessories/caps6-panel',
      permanent: true
    },
    {
      destination: '/categories/event-amp-trade-show-display/flags-pennants',
      source: '/categories/event-amp-trade-show-display/flagspennants',
      permanent: true
    },
    {
      destination: '/categories/home-amp-auto/food-containers-bento-boxes',
      source: '/categories/home-amp-auto/food-containersbento-boxes',
      permanent: true
    },
    {
      destination: '/categories/drinkware/cups-plastic',
      source: '/categories/drinkware/cupsplastic',
      permanent: true
    },
    {
      destination: '/categories/sunglasses-amp-eyewear/sunglasses-sport-amp-novelty',
      source: '/categories/sunglasses-amp-eyewear/sunglassessport-amp-novelty',
      permanent: true
    },
    {
      destination: '/categories/hitronics-amp-tech-accessories/power-banks-slim',
      source: '/categories/hitronics-amp-tech-accessories/power-banksslim',
      permanent: true
    },
    {
      destination: '/categories/home-amp-auto/utensils-cooking-amp-baking',
      source: '/categories/home-amp-auto/utensilscooking-amp-baking',
      permanent: true
    },
    {
      destination: '/categories/gourmet-food-gifts/candy-amp-nuts-plastic-amp-acrylic-containers',
      source: '/categories/gourmet-food-gifts/candy-amp-nutsplastic-amp-acrylic-containers',
      permanent: true
    },
    {
      destination: '/categories/drinkware/tumblers-stemless-wine',
      source: '/categories/drinkware/tumblersstemless-wine',
      permanent: true
    },
    {
      destination: '/categories/drinkware/tumblers-glass',
      source: '/categories/drinkware/tumblersglass',
      permanent: true
    },
    {
      destination: '/categories/gourmet-food-gifts/popcorn-singles',
      source: '/categories/gourmet-food-gifts/popcornsingles',
      permanent: true
    },
    {
      destination: '/categories/bags-duffels-amp-accessories/tote-bags-coolers',
      source: '/categories/bags-duffels-amp-accessories/tote-bagscoolers',
      permanent: true
    },
    {
      destination: '/categories/tools-lights-amp-key-tags/lights-flashlights',
      source: '/categories/tools-lights-amp-key-tags/lightsflashlights',
      permanent: true
    },
    {
      destination: '/categories/drinkware/mugs-stainless-steel-amp-copper',
      source: '/categories/drinkware/mugsstainless-steel-amp-copper',
      permanent: true
    },
    {
      destination: '/categories/drinkware/mugs-campfire',
      source: '/categories/drinkware/mugscampfire',
      permanent: true
    },
    {
      destination: '/categories/special-packaging/custom-retail-packaging',
      source: '/categories/special-packaging/customretail-packaging',
      permanent: true
    },
    {
      destination: '/categories/writing-instruments/ballpoint-pens-plastic',
      source: '/categories/writing-instruments/ballpoint-pensplastic',
      permanent: true
    },
    {
      destination: '/categories/mints-candy-amp-gum/candy-plastic-amp-acrylic-containers',
      source: '/categories/mints-candy-amp-gum/candyplastic-amp-acrylic-containers',
      permanent: true
    },
    {
      destination: '/categories/drinkware/cups-glass',
      source: '/categories/drinkware/cupsglass',
      permanent: true
    },
    {
      destination: '/categories/gourmet-food-gifts/popcorn-tins',
      source: '/categories/gourmet-food-gifts/popcorntins',
      permanent: true
    },
    {
      destination: '/categories/mints-candy-amp-gum/candy-boxes',
      source: '/categories/mints-candy-amp-gum/candyboxes',
      permanent: true
    },
    {
      destination: '/categories/bags-duffels-amp-accessories/tote-bags-eco-inspired',
      source: '/categories/bags-duffels-amp-accessories/tote-bagseco-inspired',
      permanent: true
    },
    {
      destination: '/categories/apparel/apparel-youth',
      source: '/categories/apparel/apparelyouth',
      permanent: true
    },
    {
      destination: '/categories/leisure-amp-outdoor/towels-beach',
      source: '/categories/leisure-amp-outdoor/towelsbeach',
      permanent: true
    },
    {
      destination: '/categories/hitronics-amp-tech-accessories/chargers-cords-amp-cables',
      source: '/categories/hitronics-amp-tech-accessories/chargerscords-amp-cables',
      permanent: true
    },
    {
      destination: '/categories/headwear-amp-accessories/caps-visors',
      source: '/categories/headwear-amp-accessories/capsvisors',
      permanent: true
    },
    {
      destination: '/categories/drawstrings-amp-backpacks/drawstring-sports-packs-reflective',
      source: '/categories/drawstrings-amp-backpacks/drawstring-sports-packsreflective',
      permanent: true
    },
    {
      destination: '/categories/tools-lights-amp-key-tags/lights-carabiner',
      source: '/categories/tools-lights-amp-key-tags/lightscarabiner',
      permanent: true
    },
    {
      destination: '/categories/mints-candy-amp-gum/mints-plastic-amp-acrylic-containers',
      source: '/categories/mints-candy-amp-gum/mintsplastic-amp-acrylic-containers',
      permanent: true
    },
    {
      destination: '/categories/hitronics-amp-tech-accessories/earbuds-wireless',
      source: '/categories/hitronics-amp-tech-accessories/earbudswireless',
      permanent: true
    },
    {
      destination: '/categories/special-packaging/custom-box-standard',
      source: '/categories/special-packaging/custom-boxstandard',
      permanent: true
    },
    {
      destination: '/categories/tools-lights-amp-key-tags/lights-desk-amp-phone',
      source: '/categories/tools-lights-amp-key-tags/lightsdesk-amp-phone',
      permanent: true
    },
    {
      destination: '/categories/gourmet-food-gifts/nuts-bags',
      source: '/categories/gourmet-food-gifts/nutsbags',
      permanent: true
    },
    {
      destination: '/categories/sunglasses-amp-eyewear/sunglasses-panama',
      source: '/categories/sunglasses-amp-eyewear/sunglassespanama',
      permanent: true
    },
    {
      destination: '/categories/gourmet-food-gifts/popcorn-boxes',
      source: '/categories/gourmet-food-gifts/popcornboxes',
      permanent: true
    },
    {
      destination: '/categories/mints-candy-amp-gum/mints-boxes',
      source: '/categories/mints-candy-amp-gum/mintsboxes',
      permanent: true
    },
    {
      destination: '/categories/magnets-amp-stickers/sticker-stock-shapes-indoor-use',
      source: '/categories/magnets-amp-stickers/sticker-stock-shapesindoor-use',
      permanent: true
    },
    {
      destination: '/categories/mints-candy-amp-gum/mints-individually-wrapped',
      source: '/categories/mints-candy-amp-gum/mintsindividually-wrapped',
      permanent: true
    },
    {
      destination: '/categories/gourmet-food-gifts/chocolates-tins',
      source: '/categories/gourmet-food-gifts/chocolatestins',
      permanent: true
    },
    {
      destination: '/categories/writing-instruments/stylus-pens-plastic',
      source: '/categories/writing-instruments/stylus-pensplastic',
      permanent: true
    },
    {
      destination: '/categories/drinkware/bottles-shaker',
      source: '/categories/drinkware/bottlesshaker',
      permanent: true
    },
    {
      destination: '/categories/tools-lights-amp-key-tags/key-lights-metal',
      source: '/categories/tools-lights-amp-key-tags/key-lightsmetal',
      permanent: true
    },
    {
      destination: '/categories/leisure-amp-outdoor/towels-sports-amp-fitness',
      source: '/categories/leisure-amp-outdoor/towelssports-amp-fitness',
      permanent: true
    },
    {
      destination: '/categories/plush-amp-novelties/plush-special-packaging',
      source: '/categories/plush-amp-novelties/plushspecial-packaging',
      permanent: true
    },
    {
      destination: '/categories/apparel/apparel-mens',
      source: '/categories/apparel/apparelmens',
      permanent: true
    },
    {
      destination: '/categories/drinkware/tumblers-single-amp-double-wall',
      source: '/categories/drinkware/tumblerssingle-amp-double-wall',
      permanent: true
    },
    {
      destination: '/categories/special-packaging/custom-box-retail-display',
      source: '/categories/special-packaging/custom-boxretail-display',
      permanent: true
    },
    {
      destination: '/categories/mints-candy-amp-gum/candy-tins',
      source: '/categories/mints-candy-amp-gum/candytins',
      permanent: true
    },
    {
      destination: '/categories/headwear-amp-accessories/caps-snap-back',
      source: '/categories/headwear-amp-accessories/capssnap-back',
      permanent: true
    },
    {
      destination: '/categories/writing-instruments/ballpoint-pens-metal',
      source: '/categories/writing-instruments/ballpoint-pensmetal',
      permanent: true
    },
    {
      destination: '/categories/tools-lights-amp-key-tags/safety-accessories',
      source: '/categories/tools-lights-amp-key-tags/safetyaccessories',
      permanent: true
    },
    {
      destination: '/categories/home-amp-auto/accessories-home-/-auto',
      source: '/categories/home-amp-auto/accessorieshome-/-auto',
      permanent: true
    },
    {
      destination: '/categories/drawstrings-amp-backpacks/drawstring-sports-packs-non-woven',
      source: '/categories/drawstrings-amp-backpacks/drawstring-sports-packsnon-woven',
      permanent: true
    },
    {
      destination: '/categories/gourmet-food-gifts/nuts-tins',
      source: '/categories/gourmet-food-gifts/nutstins',
      permanent: true
    },
    {
      destination: '/categories/plush-amp-novelties/plush-8-',
      source: '/categories/plush-amp-novelties/plush8-',
      permanent: true
    },
    {
      destination: '/categories/drinkware/mugs-glass',
      source: '/categories/drinkware/mugsglass',
      permanent: true
    },
    {
      destination: '/categories/mints-candy-amp-gum/mints-bags',
      source: '/categories/mints-candy-amp-gum/mintsbags',
      permanent: true
    },
    {
      destination: '/categories/hitronics-amp-tech-accessories/speakers-waterproof',
      source: '/categories/hitronics-amp-tech-accessories/speakerswaterproof',
      permanent: true
    },
    {
      destination: '/categories/hitronics-amp-tech-accessories/power-banks-10000-20000-mah',
      source: '/categories/hitronics-amp-tech-accessories/power-banks10000-20000-mah',
      permanent: true
    },
    {
      destination: '/categories/drawstrings-amp-backpacks/backpacks-cotton-amp-canvas',
      source: '/categories/drawstrings-amp-backpacks/backpackscotton-amp-canvas',
      permanent: true
    },
    {
      destination: '/categories/drawstrings-amp-backpacks/backpacks-insulated',
      source: '/categories/drawstrings-amp-backpacks/backpacksinsulated',
      permanent: true
    },
    {
      destination: '/categories/gourmet-food-gifts/chocolates-plastic-amp-acrylic-containers',
      source: '/categories/gourmet-food-gifts/chocolatesplastic-amp-acrylic-containers',
      permanent: true
    },
    {
      destination: '/categories/apparel/button-down-short-sleeve',
      source: '/categories/apparel/button-downshort-sleeve',
      permanent: true
    },
    {
      destination: '/categories/gourmet-food-gifts/gourmet-gifts-towers',
      source: '/categories/gourmet-food-gifts/gourmet-giftstowers',
      permanent: true
    },
    {
      destination: '/categories/apparel/jackets-insulated',
      source: '/categories/apparel/jacketsinsulated',
      permanent: true
    },
    {
      destination: '/categories/gourmet-food-gifts/candy-amp-nuts-tins',
      source: '/categories/gourmet-food-gifts/candy-amp-nutstins',
      permanent: true
    },
    {
      destination: '/categories/drinkware/barware-stainless-steel',
      source: '/categories/drinkware/barwarestainless-steel',
      permanent: true
    },
    {
      destination: '/categories/tools-lights-amp-key-tags/lights-lanterns',
      source: '/categories/tools-lights-amp-key-tags/lightslanterns',
      permanent: true
    },
    {
      destination: '/categories/ceramic-mugs/mugs-8-oz-11-oz-',
      source: '/categories/ceramic-mugs/mugs8-oz-11-oz-',
      permanent: true
    },
    {
      destination: '/categories/drawstrings-amp-backpacks/drawstring-sports-packs-eco-inspired',
      source: '/categories/drawstrings-amp-backpacks/drawstring-sports-packseco-inspired',
      permanent: true
    },
    {
      destination: '/categories/hitronics-amp-tech-accessories/speakers-wireless-chargers',
      source: '/categories/hitronics-amp-tech-accessories/speakerswireless-chargers',
      permanent: true
    },
    {
      destination: '/categories/leisure-amp-outdoor/towels-golf',
      source: '/categories/leisure-amp-outdoor/towelsgolf',
      permanent: true
    },
    {
      destination: '/categories/drawstrings-amp-backpacks/backpacks-eco-inspired',
      source: '/categories/drawstrings-amp-backpacks/backpackseco-inspired',
      permanent: true
    },
    {
      destination: '/categories/magnets-amp-stickers/sticker-stock-shapes-outdoor-use',
      source: '/categories/magnets-amp-stickers/sticker-stock-shapesoutdoor-use',
      permanent: true
    },
    {
      destination: '/categories/ceramic-mugs/mugs-15-oz-20-oz-',
      source: '/categories/ceramic-mugs/mugs15-oz-20-oz-',
      permanent: true
    },
    {
      destination: '/categories/tools-lights-amp-key-tags/lights-book',
      source: '/categories/tools-lights-amp-key-tags/lightsbook',
      permanent: true
    },
    {
      destination: '/categories/mints-candy-amp-gum/candy-bags',
      source: '/categories/mints-candy-amp-gum/candybags',
      permanent: true
    },
    {
      destination: '/categories/headwear-amp-accessories/caps-budget',
      source: '/categories/headwear-amp-accessories/capsbudget',
      permanent: true
    },
    {
      destination: '/categories/headwear-amp-accessories/caps-camouflage',
      source: '/categories/headwear-amp-accessories/capscamouflage',
      permanent: true
    },
    {
      destination: '/categories/mints-candy-amp-gum/gum-tins',
      source: '/categories/mints-candy-amp-gum/gumtins',
      permanent: true
    },
    {
      destination: '/categories/drinkware/tumblers-stainless-steel',
      source: '/categories/drinkware/tumblersstainless-steel',
      permanent: true
    },
    {
      destination: '/categories/drawstrings-amp-backpacks/drawstring-sports-packs-clear',
      source: '/categories/drawstrings-amp-backpacks/drawstring-sports-packsclear',
      permanent: true
    },
    {
      destination: '/categories/mints-candy-amp-gum/gum-bags',
      source: '/categories/mints-candy-amp-gum/gumbags',
      permanent: true
    },
    {
      destination: '/categories/apparel/jackets-fleece',
      source: '/categories/apparel/jacketsfleece',
      permanent: true
    },
    {
      destination: '/categories/drawstrings-amp-backpacks/drawstring-sports-packs-nylon-amp-polyester',
      source: '/categories/drawstrings-amp-backpacks/drawstring-sports-packsnylon-amp-polyester',
      permanent: true
    },
    {
      destination: '/categories/gourmet-food-gifts/candy-amp-nuts-bags',
      source: '/categories/gourmet-food-gifts/candy-amp-nutsbags',
      permanent: true
    },
    {
      destination: '/categories/mints-candy-amp-gum/gum-boxes',
      source: '/categories/mints-candy-amp-gum/gumboxes',
      permanent: true
    },
    {
      destination: '/categories/tools-lights-amp-key-tags/safety-auto',
      source: '/categories/tools-lights-amp-key-tags/safetyauto',
      permanent: true
    },
    {
      destination: '/categories/special-packaging/custom-box-handle',
      source: '/categories/special-packaging/custom-boxhandle',
      permanent: true
    },
    {
      destination: '/categories/magnets-amp-stickers/magnet-stock-shapes-indoor-use',
      source: '/categories/magnets-amp-stickers/magnet-stock-shapesindoor-use',
      permanent: true
    },
    {
      destination: '/categories/hitronics-amp-tech-accessories/earbuds-wired',
      source: '/categories/hitronics-amp-tech-accessories/earbudswired',
      permanent: true
    },
    {
      destination: '/categories/apparel/tees-long-sleeve',
      source: '/categories/apparel/teeslong-sleeve',
      permanent: true
    },
    {
      destination: '/categories/ceramic-mugs/mugs-2-oz-7-oz-',
      source: '/categories/ceramic-mugs/mugs2-oz-7-oz-',
      permanent: true
    },
    {
      destination: '/categories/drinkware/bottles-glass',
      source: '/categories/drinkware/bottlesglass',
      permanent: true
    },
    {
      destination: '/categories/headwear-amp-accessories/caps-5-panel',
      source: '/categories/headwear-amp-accessories/caps5-panel',
      permanent: true
    },
    {
      destination: '/categories/sunglasses-amp-eyewear/sunglasses-youth',
      source: '/categories/sunglasses-amp-eyewear/sunglassesyouth',
      permanent: true
    },
    {
      destination: '/categories/gourmet-food-gifts/gourmet-gifts-meat-amp-cheese',
      source: '/categories/gourmet-food-gifts/gourmet-giftsmeat-amp-cheese',
      permanent: true
    },
    {
      destination: '/categories/mints-candy-amp-gum/mints-tins',
      source: '/categories/mints-candy-amp-gum/mintstins',
      permanent: true
    },
    {
      destination: '/categories/plush-amp-novelties/plush-6',
      source: '/categories/plush-amp-novelties/plush6',
      permanent: true
    },
    {
      destination: '/categories/hitronics-amp-tech-accessories/earbuds-accessories',
      source: '/categories/hitronics-amp-tech-accessories/earbudsaccessories',
      permanent: true
    },
    {
      destination: '/categories/bags-duffels-amp-accessories/tote-bags-clear',
      source: '/categories/bags-duffels-amp-accessories/tote-bagsclear',
      permanent: true
    },
    {
      destination: '/categories/drawstrings-amp-backpacks/drawstring-sports-packs-cotton',
      source: '/categories/drawstrings-amp-backpacks/drawstring-sports-packscotton',
      permanent: true
    },
    {
      destination: '/categories/mints-candy-amp-gum/chocolates-boxes',
      source: '/categories/mints-candy-amp-gum/chocolatesboxes',
      permanent: true
    },
    {
      destination: '/categories/hitronics-amp-tech-accessories/speakers-carabiner-amp-keyring',
      source: '/categories/hitronics-amp-tech-accessories/speakerscarabiner-amp-keyring',
      permanent: true
    },
    {
      destination: '/categories/gourmet-food-gifts/chocolates-boxes',
      source: '/categories/gourmet-food-gifts/chocolatesboxes',
      permanent: true
    },
    {
      destination: '/categories/gourmet-food-gifts/nuts-plastic-amp-acrylic-containers',
      source: '/categories/gourmet-food-gifts/nutsplastic-amp-acrylic-containers',
      permanent: true
    },
    {
      destination: '/categories/drawstrings-amp-backpacks/backpacks-travel-sets',
      source: '/categories/drawstrings-amp-backpacks/backpackstravel-sets',
      permanent: true
    },
    {
      destination: '/categories/drinkware/cups-stadium',
      source: '/categories/drinkware/cupsstadium',
      permanent: true
    },
    {
      destination: '/categories/apparel/apparel-ladies',
      source: '/categories/apparel/apparelladies',
      permanent: true
    },
    {
      destination: '/categories/bags-duffels-amp-accessories/tote-bags-nfl-approved',
      source: '/categories/bags-duffels-amp-accessories/tote-bagsnfl-approved',
      permanent: true
    },
    {
      destination: '/categories/hitronics-amp-tech-accessories/chargers-auto-amp-adapters',
      source: '/categories/hitronics-amp-tech-accessories/chargersauto-amp-adapters',
      permanent: true
    },
    {
      destination: '/categories/sunglasses-amp-eyewear/sunglasses-aviator',
      source: '/categories/sunglasses-amp-eyewear/sunglassesaviator',
      permanent: true
    },
    {
      destination: '/categories/apparel/jackets-denim',
      source: '/categories/apparel/jacketsdenim',
      permanent: true
    },
    {
      destination: '/categories/special-packaging/custom-box-gift-sets',
      source: '/categories/special-packaging/custom-boxgift-sets',
      permanent: true
    },
    {
      destination: '/categories/mints-candy-amp-gum/candy-individually-wrapped',
      source: '/categories/mints-candy-amp-gum/candyindividually-wrapped',
      permanent: true
    },
    {
      destination: '/categories/gourmet-food-gifts/popcorn-plastic-amp-acrylic-containers',
      source: '/categories/gourmet-food-gifts/popcornplastic-amp-acrylic-containers',
      permanent: true
    },
    {
      destination: '/categories/mints-candy-amp-gum/gum-packs',
      source: '/categories/mints-candy-amp-gum/gumpacks',
      permanent: true
    },
    {
      destination: '/categories/mints-candy-amp-gum/gum-plastic-amp-acrylic-containers',
      source: '/categories/mints-candy-amp-gum/gumplastic-amp-acrylic-containers',
      permanent: true
    },
    {
      destination: '/categories/apparel/tees-short-sleeve',
      source: '/categories/apparel/teesshort-sleeve',
      permanent: true
    },
    {
      destination: '/categories/writing-instruments/stylus-pens-metal',
      source: '/categories/writing-instruments/stylus-pensmetal',
      permanent: true
    },
    {
      destination: '/categories/bags-duffels-amp-accessories/tote-bags-dye-sublimation',
      source: '/categories/bags-duffels-amp-accessories/tote-bagsdye-sublimation',
      permanent: true
    },
    {
      destination: '/categories/tools-lights-amp-key-tags/lights-nightlights',
      source: '/categories/tools-lights-amp-key-tags/lightsnightlights',
      permanent: true
    },
    {
      destination: '/categories/drawstrings-amp-backpacks/backpacks-clear',
      source: '/categories/drawstrings-amp-backpacks/backpacksclear',
      permanent: true
    },
    {
      destination: '/categories/writing-instruments/ballpoint-pens-rpet',
      source: '/categories/writing-instruments/ballpoint-pensrpet',
      permanent: true
    },
    {
      destination: '/categories/drawstrings-amp-backpacks/backpacks-sling-amp-beach',
      source: '/categories/drawstrings-amp-backpacks/backpackssling-amp-beach',
      permanent: true
    },
    {
      destination: '/categories/gourmet-food-gifts/candy-amp-nuts-towers',
      source: '/categories/gourmet-food-gifts/candy-amp-nutstowers',
      permanent: true
    },
    {
      destination: '/categories/apparel/button-down-long-sleeve',
      source: '/categories/apparel/button-downlong-sleeve',
      permanent: true
    },
    {
      destination: '/categories/plush-amp-novelties/plush-key-chains',
      source: '/categories/plush-amp-novelties/plushkey-chains',
      permanent: true
    },
    {
      destination: '/categories/gourmet-food-gifts/gourmet-gifts-boxes',
      source: '/categories/gourmet-food-gifts/gourmet-giftsboxes',
      permanent: true
    },
    {
      destination: '/categories/apparel/hoodies-adult',
      source: '/categories/apparel/hoodiesadult',
      permanent: true
    },
    {
      destination: '/categories/event-amp-trade-show-display/flags-feather',
      source: '/categories/event-amp-trade-show-display/flagsfeather',
      permanent: true
    },
    {
      destination: '/categories/special-packaging/custom-box-stock-shapes',
      source: '/categories/special-packaging/custom-boxstock-shapes',
      permanent: true
    },
    {
      destination: '/categories/sunglasses-amp-eyewear/sunglasses-specialty',
      source: '/categories/sunglasses-amp-eyewear/sunglassesspecialty',
      permanent: true
    },
    {
      destination: '/categories/headwear-amp-accessories/caps-fitted',
      source: '/categories/headwear-amp-accessories/capsfitted',
      permanent: true
    },
    {
      destination: '/categories/ceramic-mugs/tumblers-8-oz-11-oz-',
      source: '/categories/ceramic-mugs/tumblers8-oz-11-oz-',
      permanent: true
    },
    {
      destination: '/search-results',
      source: '/search_results',
      permanent: true
    },
    {
      destination: '/drinkware/brumate/12by16-oz-brumate-hopsulator-trio',
      source: '/drinkware/brumate/12/16-oz-brumate-hopsulator-trio',
      permanent: true
    },
    {
      destination: '/products/leisure-amp-outdoor/beverage-coolers-amp-holders/12by16-oz-brumate-hopsulator-trio',
      source: '/leisure-amp-outdoor/beverage-coolers-amp-holders-12by16-oz-brumate-hopsulator-trio',
      permanent: true
    },
    {
      destination: '/full-color-retail-boxes/custom-box-stock-designs/custom-full-color-box',
      source: '/full-color-retail-boxes/custom-box-stock-designs/custom-retail-box',
      permanent: true
    },
    {
      destination: '/coolers/cooler-lunch-bags/cafe-cooler-bag',
      source: '/coolers/cooler-lunch-bags/café-cooler-bag',
      permanent: true
    },
    {
      destination: '/products/pet-toys/gonia-wing-ring-flyer',
      source: '/pet-toys/gonia-wing-ring-flyer',
      permanent: true
    },
    {
      destination: '/products/pet-toys/folding-flying-disc-with-pouch',
      source: '/pet-toys/folding-flying-disc-with-pouch',
      permanent: true
    },
    {
      destination: '/categories/hitronics-amp-tech-accessories',
      source: '/categories/hitronics-amp-tech-accessories/aws',
      permanent: true
    },
    {
      destination: '/categories/plush-amp-novelties',
      source: '/categories/plush-amp-novelties/aws',
      permanent: true
    },
    {
      destination: '/categories/drinkware',
      source: '/categories/drinkware/aws',
      permanent: true
    },
    {
      destination: '/categories/bags-duffels-amp-accessories',
      source: '/categories/bags-duffels-amp-accessories/aws',
      permanent: true
    },
    {
      destination: '/categories/kits/health-amp-wellness-kits',
      source: '/categories/protection-and-wellness',
      permanent: true
    }
  ],
  rewrites: () => [
    {
      source: '/ingest/static/:path*',
      destination: 'https://us-assets.i.posthog.com/static/:path*'
    },
    {
      source: '/ingest/:path*',
      destination: 'https://us.i.posthog.com/:path*'
    },
    {
      source: '/ingest/decide',
      destination: 'https://us.i.posthog.com/decide'
    }
  ]
};

export default nextConfig;
