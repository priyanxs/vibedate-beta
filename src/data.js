/* ------------------------------------------------------------------
   VibeDate — mock "backend" data.
   Venue details, menus and prices are ILLUSTRATIVE. Please confirm
   current menus and prices with the venue before you go.
------------------------------------------------------------------- */

export const BUDGET = { min: 500, max: 10000, step: 100, default: 3000 }

export const budgetTier = (b) => {
  if (b < 1000) return 'Coffee & conversation'
  if (b < 2500) return 'Casual date night'
  if (b < 5000) return 'Dinner & a thoughtful gift'
  if (b < 8000) return 'A special evening'
  return 'The full luxury experience'
}

/* ---------------------------- Vibes ------------------------------- */

export const VIBE_LIST = ['Romantic', 'Cozy', 'Vibrant', 'Casual']

export const VIBES = {
  Romantic: {
    emoji: '🌹',
    blurb: 'Candlelight, lakeside views and slow evenings.',
    gradient: 'linear-gradient(135deg, #c8102e 0%, #f06b8d 100%)',
  },
  Cozy: {
    emoji: '🕯️',
    blurb: 'Warm corners, good coffee and easy conversation.',
    gradient: 'linear-gradient(135deg, #e58aa6 0%, #ffd3df 100%)',
  },
  Vibrant: {
    emoji: '✨',
    blurb: 'Lively crowds, big flavours and great energy.',
    gradient: 'linear-gradient(135deg, #ff8fb1 0%, #a3e635 100%)',
  },
  Casual: {
    emoji: '☀️',
    blurb: 'No pressure, great food, zero fuss.',
    gradient: 'linear-gradient(135deg, #ffe0ea 0%, #c4f26b 100%)',
  },
}

/* ---------------------------- Menus ------------------------------- */

export const MENU_CATEGORIES = [
  { key: 'appetizers', label: 'Appetizers' },
  { key: 'mains', label: 'Mains' },
  { key: 'drinks', label: 'Drinks' },
  { key: 'desserts', label: 'Desserts' },
]

// rows: [name, price (₹), isVeg, description?, isAlcohol?]
const items = (prefix, rows) =>
  rows.map(([name, price, veg, desc, alc], i) => ({
    id: `${prefix}-${i + 1}`,
    name,
    price,
    veg,
    desc: desc || '',
    alc: Boolean(alc),
  }))

/* --------------------------- Venues ------------------------------- */

export const VENUES = [
  {
    id: 'umt',
    name: 'Under the Mango Tree',
    vibe: 'Romantic',
    emoji: '🌳',
    cuisine: 'North Indian · Continental',
    tagline: 'Leafy, intimate and made for slow conversation.',
    highlights: ['Open-air feel', 'Candlelit evenings', 'Great for anniversaries'],
    dressCode: 'Smart casual with a dressy touch',
    afterSpot: 'Take a slow walk and finish with a drive by the lake.',
    menu: {
      appetizers: items('umt-a', [
        ['Paneer Tikka Platter', 340, true, 'Charred cottage cheese with mint chutney'],
        ['Hara Bhara Kebab', 290, true, 'Spinach and green pea patties'],
        ['Chicken Malai Tikka', 380, false, 'Creamy, cardamom-marinated chicken'],
        ['Crispy Corn Pepper Salt', 260, true, 'Golden corn, cracked pepper'],
      ]),
      mains: items('umt-m', [
        ['Dal Makhani', 320, true, 'Slow-cooked black lentils'],
        ['Paneer Lababdar', 380, true, 'Silky tomato-cashew gravy'],
        ['Butter Chicken', 460, false, 'Tandoori chicken in a buttery gravy'],
        ['Mutton Rogan Josh', 580, false, 'Slow-braised, Kashmiri style'],
        ['Veg Dum Biryani', 340, true, 'Saffron basmati with raita'],
        ['Butter Naan Basket', 140, true, 'Assorted naans, freshly baked'],
      ]),
      drinks: items('umt-d', [
        ['Fresh Lime Soda', 110, true],
        ['Virgin Mojito', 180, true, 'Mint, lime and soda'],
        ['Cold Coffee', 190, true],
        ['Rose & Lychee Cooler', 220, true, 'A romantic signature mocktail'],
      ]),
      desserts: items('umt-s', [
        ['Gulab Jamun with Rabri', 180, true],
        ['Chocolate Brownie & Ice Cream', 240, true],
        ['Phirni', 160, true, 'Chilled rice pudding in a clay bowl'],
      ]),
    },
  },
  {
    id: 'ww',
    name: 'Wind & Waves',
    vibe: 'Romantic',
    emoji: '🌅',
    cuisine: 'Multi-cuisine · Lakeside',
    tagline: 'Sunset views over the Upper Lake.',
    highlights: ['Lake views', 'Golden-hour tables', 'Easy and elegant'],
    dressCode: 'Smart casual, light layers for the lake breeze',
    afterSpot: 'Walk along the Upper Lake promenade or take a short boat ride.',
    menu: {
      appetizers: items('ww-a', [
        ['Paneer Tikka', 300, true],
        ['Veg Seekh Kebab', 280, true],
        ['Fish Fingers', 360, false, 'Crisp-fried with tartare'],
        ['Chicken Tikka', 340, false],
      ]),
      mains: items('ww-m', [
        ['Paneer Butter Masala', 340, true],
        ['Dal Tadka', 240, true],
        ['Kadhai Chicken', 400, false, 'Peppery, tomato-based gravy'],
        ['Jeera Rice', 200, true],
        ['Tandoori Roti Basket', 120, true],
      ]),
      drinks: items('ww-d', [
        ['Fresh Lime Water', 80, true],
        ['Cold Coffee', 150, true],
        ['Virgin Piña Colada', 210, true],
        ['Masala Chai Pot', 120, true, 'Made for sunset sipping'],
      ]),
      desserts: items('ww-s', [
        ['Gulab Jamun', 120, true],
        ['Ice Cream Sundae', 200, true],
        ['Moong Dal Halwa', 140, true],
      ]),
    },
  },
  {
    id: 'jnp',
    name: 'Jehan Numa Palace',
    vibe: 'Romantic',
    emoji: '🏰',
    cuisine: 'Fine dining · Royal & Continental',
    tagline: 'Heritage-hotel elegance for a night to remember.',
    highlights: ['Heritage setting', 'Fine dining', 'Milestone occasions'],
    dressCode: 'Smart formal — blazer or an elegant dress',
    afterSpot: 'A scenic drive around Shamla Hills to close the evening.',
    menu: {
      appetizers: items('jnp-a', [
        ['Galouti Kebab', 780, false, 'Melt-in-the-mouth royal kebab'],
        ['Burrata & Heirloom Tomato', 720, true],
        ['Tandoori Prawns', 950, false],
        ['Truffle Mushroom Tartlet', 680, true],
      ]),
      mains: items('jnp-m', [
        ['Slow-cooked Black Dal', 720, true, 'Overnight simmered, finished with cream'],
        ['Paneer Pasanda', 780, true],
        ['Murgh Makhani', 880, false],
        ['Lamb Shank Nihari', 1250, false, 'Fall-off-the-bone, rich and aromatic'],
        ['Wild Mushroom Risotto', 840, true],
        ['Pan-seared Chicken Supreme', 980, false],
      ]),
      drinks: items('jnp-d', [
        ['Signature Rose Mocktail', 420, true],
        ['Fresh Pressed Juice', 360, true],
        ['Sparkling Water', 280, true],
        ['House Red Wine (glass)', 720, true, '', true],
        ['House White Wine (glass)', 720, true, '', true],
      ]),
      desserts: items('jnp-s', [
        ['Saffron Rasmalai Tart', 480, true],
        ['Chocolate Fondant', 520, true],
        ['Crème Brûlée', 500, true],
      ]),
    },
  },
  {
    id: 'oliver',
    name: "Oliver's",
    vibe: 'Cozy',
    emoji: '☕',
    cuisine: 'Café · Continental · Desserts',
    tagline: 'A warm corner, great coffee and comfort food.',
    highlights: ['Quiet corners', 'Dessert menu', 'Perfect for a second date'],
    dressCode: 'Soft smart casual',
    afterSpot: 'Stroll nearby with a take-away hot chocolate.',
    menu: {
      appetizers: items('oliver-a', [
        ['Garlic Bread with Cheese', 190, true],
        ['Loaded Nachos', 260, true, 'Salsa, jalapeño and cheese sauce'],
        ['Peri-Peri Chicken Wings', 320, false],
        ['Bruschetta Trio', 240, true],
      ]),
      mains: items('oliver-m', [
        ['Penne Arrabbiata', 320, true],
        ['White Sauce Pasta', 340, true, 'Creamy and herbed'],
        ['Chicken Alfredo', 390, false],
        ['Margherita Pizza', 360, true, 'Thin crust'],
        ['Grilled Chicken Sandwich', 320, false],
      ]),
      drinks: items('oliver-d', [
        ['Hot Chocolate', 190, true, 'Thick and velvety'],
        ['Cappuccino', 150, true],
        ['Iced Latte', 190, true],
        ['Strawberry Smoothie', 210, true],
      ]),
      desserts: items('oliver-s', [
        ['Warm Brownie Sundae', 260, true],
        ['Tiramisu Jar', 240, true],
        ['New York Cheesecake', 280, true],
      ]),
    },
  },
  {
    id: 'ich',
    name: 'Indian Coffee House',
    vibe: 'Cozy',
    emoji: '📚',
    cuisine: 'South Indian · Coffee · Snacks',
    tagline: 'Old-school charm and filter coffee that never rushes you.',
    highlights: ['Nostalgic ambience', 'Very budget-friendly', 'Long, unhurried chats'],
    dressCode: 'Relaxed and neat — a comfy kurta or a casual shirt',
    afterSpot: 'Wander through the nearby market lanes and share a street dessert.',
    menu: {
      appetizers: items('ich-a', [
        ['Veg Cutlet', 90, true],
        ['Onion Pakoda', 80, true],
        ['Chicken Cutlet', 120, false],
        ['French Fries', 100, true],
      ]),
      mains: items('ich-m', [
        ['Masala Dosa', 110, true],
        ['Idli Sambar', 80, true],
        ['Grilled Veg Sandwich', 100, true],
        ['Chicken Biryani', 200, false],
        ['Egg Curry & Paratha', 150, false],
      ]),
      drinks: items('ich-d', [
        ['Filter Coffee', 50, true],
        ['Cold Coffee', 90, true],
        ['Masala Tea', 30, true],
        ['Lemon Tea', 40, true],
      ]),
      desserts: items('ich-s', [
        ['Vanilla Ice Cream', 80, true],
        ['Gulab Jamun', 70, true],
        ['Caramel Custard', 90, true],
      ]),
    },
  },
  {
    id: 'gfb',
    name: 'Greek Food & Brewery',
    vibe: 'Vibrant',
    emoji: '🫒',
    cuisine: 'Mediterranean · Brewery · Grill',
    tagline: 'Big flavours, lively crowd and craft drinks.',
    highlights: ['Lively atmosphere', 'Craft drinks', 'Great for sharing plates'],
    dressCode: 'Smart casual with a pop of colour',
    afterSpot: 'Keep the energy going with a late-evening drive and dessert.',
    menu: {
      appetizers: items('gfb-a', [
        ['Hummus & Warm Pita', 360, true],
        ['Falafel Plate', 380, true],
        ['Greek Salad', 340, true, 'Feta, olives and cucumber'],
        ['Chicken Souvlaki Skewers', 460, false],
      ]),
      mains: items('gfb-m', [
        ['Veg Moussaka', 560, true, 'Layered, baked aubergine'],
        ['Chicken Gyro Platter', 620, false],
        ['Lamb Kofta Platter', 780, false],
        ['Mushroom & Spinach Pizza', 520, true],
        ['Pasta Primavera', 480, true],
      ]),
      drinks: items('gfb-d', [
        ['Mint Lemonade', 160, true],
        ['Virgin Mojito', 200, true],
        ['Craft Wheat Beer (pint)', 380, true, '', true],
        ['Classic Mojito', 320, true, '', true],
        ['Sangria (glass)', 420, true, '', true],
      ]),
      desserts: items('gfb-s', [
        ['Baklava', 280, true, 'Honey and pistachio layers'],
        ['Greek Yogurt with Honey', 240, true],
        ['Chocolate Lava Cake', 320, true],
      ]),
    },
  },
  {
    id: 'bn',
    name: 'Barbeque Nation',
    vibe: 'Vibrant',
    emoji: '🔥',
    cuisine: 'BBQ · Grill buffet',
    tagline: 'Live grills at your table — fun from the first skewer.',
    highlights: ['Interactive grill', 'Unlimited feast', 'Playful and social'],
    dressCode: 'Casual and comfortable (you will smell like barbecue!)',
    afterSpot: 'Walk off the feast with a stroll and an ice-cream stop.',
    menu: {
      appetizers: items('bn-a', [
        ['Crispy Corn Basket', 220, true],
        ['Peri-Peri Paneer Bites', 290, true],
        ['Chicken Wings Basket', 340, false],
        ['Loaded Nachos', 260, true],
      ]),
      mains: items('bn-m', [
        ['Veg Grill Buffet (per person)', 849, true, 'Unlimited live grills, mains and desserts'],
        ['Non-Veg Grill Buffet (per person)', 1049, false],
        ['Premium Buffet (per person)', 1299, false, 'Adds seafood and lamb grills'],
      ]),
      drinks: items('bn-d', [
        ['Mocktail of the Day', 200, true],
        ['Fresh Lime Soda', 110, true],
        ['Cold Coffee', 170, true],
        ['Mango Lassi', 150, true],
      ]),
      desserts: items('bn-s', [
        ['Chocolate Brownie', 200, true],
        ['Gulab Jamun', 120, true],
        ['Ice Cream Duo', 160, true],
      ]),
    },
  },
  {
    id: 'sg',
    name: 'Sagar Gaire',
    vibe: 'Casual',
    emoji: '🥪',
    cuisine: 'Chaat · Fast food · Café',
    tagline: 'Easy, tasty and pocket-friendly — no pressure.',
    highlights: ['Quick and relaxed', 'Budget-friendly', 'Perfect first meet-up'],
    dressCode: 'Casual and clean — jeans and a good tee or kurti',
    afterSpot: 'Grab a chai or kulfi and walk around the neighbourhood.',
    menu: {
      appetizers: items('sg-a', [
        ['Samosa Chaat', 90, true],
        ['Veg Spring Rolls', 130, true],
        ['Crispy Chilli Potato', 140, true],
        ['Paneer Tikka Roll', 160, true],
      ]),
      mains: items('sg-m', [
        ['Chole Bhature', 140, true],
        ['Pav Bhaji', 150, true],
        ['Veg Hakka Noodles', 160, true],
        ['Veg Burger Combo', 170, true],
        ['Paneer Butter Masala with Roti', 220, true],
      ]),
      drinks: items('sg-d', [
        ['Masala Chai', 40, true],
        ['Fresh Lime Soda', 70, true],
        ['Cold Coffee', 110, true],
        ['Mango Shake', 120, true],
      ]),
      desserts: items('sg-s', [
        ['Hot Jalebi with Rabri', 110, true],
        ['Kulfi Falooda', 130, true],
        ['Brownie with Ice Cream', 150, true],
      ]),
    },
  },
  {
    id: 'md',
    name: 'Manohar Dairy & Restaurant',
    vibe: 'Casual',
    emoji: '🥛',
    cuisine: 'Vegetarian · Sweets · Chaat',
    tagline: 'A Bhopal favourite for chaat, sweets and thalis.',
    highlights: ['Local flavour', 'Vegetarian', 'Sweet-tooth friendly'],
    dressCode: 'Comfortable casual',
    afterSpot: 'Pick up a box of sweets and take a relaxed evening walk.',
    menu: {
      appetizers: items('md-a', [
        ['Dahi Papdi Chaat', 90, true],
        ['Aloo Tikki Chaat', 90, true],
        ['Kachori with Aloo Sabzi', 70, true],
        ['Paneer Pakoda', 140, true],
      ]),
      mains: items('md-m', [
        ['Mini Thali', 220, true],
        ['Chole Bhature', 130, true],
        ['Dal Baati Churma', 240, true],
        ['Paneer Paratha with Curd', 150, true],
        ['Pav Bhaji', 140, true],
      ]),
      drinks: items('md-d', [
        ['Sweet Lassi', 80, true],
        ['Masala Chai (kulhad)', 30, true],
        ['Badam Doodh', 90, true],
        ['Rose Milk', 70, true],
      ]),
      desserts: items('md-s', [
        ['Rasmalai', 90, true],
        ['Jalebi with Rabri', 100, true],
        ['Malpua', 110, true],
      ]),
    },
  },
]

export const VENUE_BY_ID = Object.fromEntries(VENUES.map((v) => [v.id, v]))

/* ---------------------------- Gifts ------------------------------- */

export const GIFT_CATEGORIES = [
  { key: 'flowers', label: 'Flowers' },
  { key: 'chocolates', label: 'Chocolates' },
  { key: 'personalized', label: 'Personalised' },
  { key: 'jewelry', label: 'Jewellery' },
]

export const GIFTS = [
  // Flowers
  { id: 'g-rose', name: 'Single Long-stem Red Rose', category: 'flowers', price: 120, emoji: '🌹', vibes: ['Romantic', 'Casual', 'Cozy'], note: 'A timeless, low-key gesture.' },
  { id: 'g-sun', name: 'Sunflower Bunch', category: 'flowers', price: 450, emoji: '🌻', vibes: ['Casual', 'Vibrant'], note: 'Sunny, cheerful and a little unexpected.' },
  { id: 'g-rbq', name: 'Hand-tied Rose Bouquet (12)', category: 'flowers', price: 650, emoji: '💐', vibes: ['Romantic', 'Cozy'], note: 'Classic romance, beautifully wrapped.' },
  { id: 'g-peony', name: 'Pastel Peony & Rose Bouquet', category: 'flowers', price: 1250, emoji: '🌸', vibes: ['Cozy', 'Romantic'], note: 'Soft, elegant and made for cozy evenings.' },
  { id: 'g-orchid', name: 'Orchid & Lily Arrangement', category: 'flowers', price: 2100, emoji: '🪷', vibes: ['Romantic'], note: 'A premium arrangement that signals real effort.' },
  { id: 'g-rbox', name: 'Luxe Rose Box (24 roses)', category: 'flowers', price: 2800, emoji: '🎁', vibes: ['Romantic', 'Vibrant'], note: 'Statement-making for milestone dates.' },
  // Chocolates
  { id: 'g-silk', name: 'Silk Chocolate Gift Pack', category: 'chocolates', price: 260, emoji: '🍫', vibes: ['Casual', 'Cozy', 'Vibrant'], note: 'Sweet, simple and always appreciated.' },
  { id: 'g-truffle', name: 'Handmade Truffle Box', category: 'chocolates', price: 720, emoji: '🍬', vibes: ['Cozy', 'Romantic'], note: 'Small-batch truffles with a personal feel.' },
  { id: 'g-ferrero', name: 'Ferrero Rocher (16 pc)', category: 'chocolates', price: 850, emoji: '🍯', vibes: ['Romantic', 'Vibrant'], note: 'A crowd-pleaser in gold foil.' },
  { id: 'g-belgian', name: 'Belgian Chocolate Assortment', category: 'chocolates', price: 1450, emoji: '🎀', vibes: ['Romantic', 'Cozy'], note: 'A refined box for chocolate lovers.' },
  { id: 'g-straw', name: 'Chocolate & Strawberry Hamper', category: 'chocolates', price: 2200, emoji: '🍓', vibes: ['Romantic', 'Vibrant'], note: 'Indulgent, photogenic and playful.' },
  // Personalised
  { id: 'g-note', name: 'Handwritten Note + Mini Polaroids', category: 'personalized', price: 220, emoji: '💌', vibes: ['Casual', 'Cozy', 'Romantic'], note: 'Thoughtfulness beats price every time.' },
  { id: 'g-key', name: 'Personalised Name Keychain', category: 'personalized', price: 320, emoji: '🔑', vibes: ['Casual', 'Vibrant'], note: 'Small, useful and clearly "for them".' },
  { id: 'g-mug', name: 'Photo Memory Mug', category: 'personalized', price: 420, emoji: '☕', vibes: ['Casual', 'Cozy'], note: 'A daily reminder of a good evening.' },
  { id: 'g-candle', name: 'Custom Scented Candle', category: 'personalized', price: 650, emoji: '🕯️', vibes: ['Cozy', 'Romantic'], note: 'Warm, calming and personal.' },
  { id: 'g-scrap', name: 'Couple Memory Scrapbook', category: 'personalized', price: 950, emoji: '📖', vibes: ['Cozy', 'Casual'], note: 'Best when you have a few shared moments.' },
  { id: 'g-star', name: 'Custom Star-map Frame', category: 'personalized', price: 1350, emoji: '🌌', vibes: ['Romantic', 'Cozy'], note: 'The night sky from a moment that matters.' },
  // Jewellery
  { id: 'g-pendant', name: 'Minimal Silver Pendant', category: 'jewelry', price: 1100, emoji: '📿', vibes: ['Casual', 'Cozy', 'Romantic'], note: 'Understated and easy to wear daily.' },
  { id: 'g-brace', name: 'Rose-gold Charm Bracelet', category: 'jewelry', price: 1650, emoji: '✨', vibes: ['Cozy', 'Vibrant', 'Romantic'], note: 'Playful and pretty, with room to add charms.' },
  { id: 'g-pearl', name: 'Pearl Stud Earrings', category: 'jewelry', price: 2600, emoji: '🦪', vibes: ['Romantic', 'Cozy'], note: 'Classic elegance that never dates.' },
  { id: 'g-initial', name: 'Initial Pendant (925 Silver)', category: 'jewelry', price: 3400, emoji: '💎', vibes: ['Romantic', 'Vibrant'], note: 'Personal without being over the top.' },
  { id: 'g-watch', name: 'Classic Leather-strap Watch', category: 'jewelry', price: 4200, emoji: '⌚', vibes: ['Vibrant', 'Casual', 'Cozy'], note: 'A practical keepsake with lasting value.' },
  { id: 'g-solitaire', name: 'Solitaire-style Diamond Pendant', category: 'jewelry', price: 7500, emoji: '💍', vibes: ['Romantic'], note: 'Reserved for a truly special occasion.' },
]

export const GIFT_BY_ID = Object.fromEntries(GIFTS.map((g) => [g.id, g]))

/* --------------------------- Outfits ------------------------------ */

export const OUTFITS = {
  Romantic: {
    dressCode: 'Smart formal / evening chic',
    palettes: [
      { name: 'Crimson & Charcoal', colors: ['#c8102e', '#2b2b33', '#f8e1e7', '#ffffff'], note: 'Use crimson as a single bold accent against deep neutrals.' },
      { name: 'Midnight & Blush', colors: ['#1f2a44', '#f4b6c2', '#ffffff', '#c9a24d'], note: 'Navy base with soft blush and a touch of gold.' },
      { name: 'Ivory & Wine', colors: ['#f7f0e6', '#7b1e3a', '#3a2a2f', '#d9b9a7'], note: 'Rich, warm and photogenic in candlelight.' },
    ],
    pieces: {
      him: ['Tailored blazer or structured jacket', 'Crisp shirt in a solid colour', 'Dark chinos or tailored trousers', 'Polished leather loafers or derbies', 'A clean, minimal watch'],
      her: ['Midi dress or an elegant co-ord set', 'One statement piece — earrings or a necklace', 'Block heels or dressy flats', 'A compact clutch', 'Soft waves or a sleek low bun'],
    },
    avoid: ['Loud graphic prints', 'Heavy fragrance', 'Brand-new shoes you have not broken in'],
    grooming: 'Fresh haircut or trim two days before, neat nails, and a light fragrance.',
  },
  Cozy: {
    dressCode: 'Soft smart casual',
    palettes: [
      { name: 'Rose & Oatmeal', colors: ['#e8b4bc', '#efe6da', '#8c6a5d', '#ffffff'], note: 'Warm neutrals with a hint of pink — approachable and soft.' },
      { name: 'Denim & Cream', colors: ['#3c5a7d', '#f5efe6', '#c9908f', '#2e2e2e'], note: 'A timeless pairing that always looks effortless.' },
      { name: 'Olive & Blush', colors: ['#6b7a3a', '#f2c6cf', '#f6f1e9', '#4a3f3a'], note: 'Earthy and fresh, perfect for café light.' },
    ],
    pieces: {
      him: ['Textured knit or a well-fitted overshirt', 'Straight-fit jeans or chinos', 'Clean white sneakers or suede boots', 'Simple chain or watch'],
      her: ['Soft knit top with high-waist jeans', 'Light cardigan or a denim jacket', 'Comfortable flats or clean sneakers', 'Dainty jewellery and a tote'],
    },
    avoid: ['Anything stiff or overly formal', 'Strong perfumes in small spaces'],
    grooming: 'Keep it fresh and natural — good skin care, tidy hair, light scent.',
  },
  Vibrant: {
    dressCode: 'Smart casual with a pop of colour',
    palettes: [
      { name: 'Electric Contrast', colors: ['#c8102e', '#1b1b1f', '#a3e635', '#f3f3f3'], note: 'Black base with crimson and lime accents for confident energy.' },
      { name: 'Sunset Brights', colors: ['#ff7a8a', '#fff4e5', '#2d3a4a', '#ffd166'], note: 'Warm brights balanced with a deep slate neutral.' },
      { name: 'Pink & Olive', colors: ['#f4a6bd', '#556b2f', '#ffffff', '#222222'], note: 'Unexpected, stylish and easy to remember.' },
    ],
    pieces: {
      him: ['Patterned or coloured shirt with sleeves rolled', 'Slim chinos or dark jeans', 'Statement sneakers or loafers', 'A bold-but-simple accessory'],
      her: ['Co-ord set or jumpsuit in a bright tone', 'Trendy flats or block heels', 'Bold earrings', 'Crossbody bag'],
    },
    avoid: ['Fabrics that stain easily if you are grilling', 'Over-accessorising'],
    grooming: 'Go for a confident fragrance and tidy, styled hair.',
  },
  Casual: {
    dressCode: 'Relaxed and clean',
    palettes: [
      { name: 'White & Sky', colors: ['#ffffff', '#9cc4e4', '#2f3e52', '#d7b899'], note: 'Fresh, light and wonderfully easy.' },
      { name: 'Blush & Grey', colors: ['#f4c2cf', '#9aa0a6', '#ffffff', '#394150'], note: 'Soft contrast that feels put-together without trying.' },
      { name: 'Lime Accent', colors: ['#a3e635', '#ffffff', '#2c2c34', '#e6e6e6'], note: 'One fresh pop on neutral basics.' },
    ],
    pieces: {
      him: ['Well-fitted plain tee or polo', 'Dark jeans or relaxed chinos', 'Clean sneakers', 'A light jacket if it is cool'],
      her: ['Printed kurti or a simple top with jeans', 'Comfortable sandals or sneakers', 'Light jewellery', 'A small sling bag'],
    },
    avoid: ['Wrinkled clothes', 'Overdressing — comfort is the point'],
    grooming: 'Clean, fresh and relaxed. A good smile is the best accessory.',
  },
}

/* ----------------------- Conversation cards ----------------------- */

export const CARD_CATEGORIES = ['Icebreakers', 'Fun', 'Deep', 'Dreams', 'Romantic']

export const CONVERSATION_CARDS = [
  // Icebreakers
  { id: 1, category: 'Icebreakers', q: 'What is the best thing that happened to you this week?' },
  { id: 2, category: 'Icebreakers', q: 'What is your go-to comfort food after a long day?' },
  { id: 3, category: 'Icebreakers', q: 'What is the last show or series you could not stop watching?' },
  { id: 4, category: 'Icebreakers', q: 'Are you a morning person or a night owl?' },
  { id: 5, category: 'Icebreakers', q: 'What song has been on repeat for you lately?' },
  // Fun
  { id: 6, category: 'Fun', q: 'If you could have dinner with anyone, alive or not, who would it be?' },
  { id: 7, category: 'Fun', q: 'What is the most spontaneous thing you have ever done?' },
  { id: 8, category: 'Fun', q: 'Which superpower would you pick, and how would you actually use it?' },
  { id: 9, category: 'Fun', q: 'What is a harmless "hot take" you will defend to the end?' },
  { id: 10, category: 'Fun', q: 'What would your perfect lazy Sunday look like?' },
  { id: 11, category: 'Fun', q: 'If we could teleport anywhere right now, where are we going?' },
  // Deep
  { id: 12, category: 'Deep', q: 'What is something you are proud of that most people do not know?' },
  { id: 13, category: 'Deep', q: 'Who has influenced the person you are today the most?' },
  { id: 14, category: 'Deep', q: 'What is a lesson you learned the hard way?' },
  { id: 15, category: 'Deep', q: 'What makes you feel most like yourself?' },
  { id: 16, category: 'Deep', q: 'What does a really good friendship look like to you?' },
  // Dreams
  { id: 17, category: 'Dreams', q: 'What is one thing on your bucket list you are determined to do?' },
  { id: 18, category: 'Dreams', q: 'Where do you see yourself, happily, in five years?' },
  { id: 19, category: 'Dreams', q: 'If money did not matter, how would you spend your days?' },
  { id: 20, category: 'Dreams', q: 'What skill would you love to master?' },
  { id: 21, category: 'Dreams', q: 'What is a place that you want to live in at least once?' },
  // Romantic
  { id: 22, category: 'Romantic', q: 'What is your idea of a perfect date?' },
  { id: 23, category: 'Romantic', q: 'What small gesture makes you feel truly appreciated?' },
  { id: 24, category: 'Romantic', q: 'What is the most memorable compliment you have received?' },
  { id: 25, category: 'Romantic', q: 'What is your love language — words, time, touch, gifts or acts?' },
  { id: 26, category: 'Romantic', q: 'What made you say yes to tonight?' },
]

/* --------------------- Time options for the plan ------------------- */

// minutes since midnight, 10:00 AM → 10:30 PM
export const START_TIMES = Array.from({ length: 26 }, (_, i) => 600 + i * 30)

/* ------------------------ Wingman quick asks ----------------------- */

export const WINGMAN_PROMPTS = [
  'Give me conversation starters',
  'How do I make them feel special?',
  'Date etiquette tips',
  'What should I wear?',
  "I'm nervous — help!",
  'How do I end the night well?',
]
