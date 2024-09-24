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
      }
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'printsyouassets.s3.amazonaws.com'
      }
    ]
  },
  redirects: async () => [
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
      source: '/drinkware/brumate/12/16-oz-brümate-hopsulator-trio',
      permanent: true
    },
    {
      destination: '/leisure-amp-outdoor/beverage-coolers-amp-holders/12by16-oz-brumate-hopsulator-trio',
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
