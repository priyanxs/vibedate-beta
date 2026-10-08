/* Fast venue builder: real venue names + cuisine-based SAMPLE menus.
   Menu dishes and prices are ILLUSTRATIVE templates scaled by the venue's price tier — not the venue's actual menu.
   Use "Check the real menu" in the app for the current one. */
import { makeVenue } from '../venueHelpers'

const T = true
const F = false

const TYPES = {
  cafe: {
    cuisine: 'Café · Coffee & bites', highlights: ['Coffee and bites', 'Relaxed seating', 'Easy meet-up'], dress: 'Relaxed casual', after: 'Take a slow walk nearby.',
    menu: [
      [['Garlic Bread', 180, T], ['Peri-Peri Fries', 190, T], ['Loaded Nachos', 240, T]],
      [['Veg Sandwich', 220, T], ['Pasta Alfredo', 320, T], ['Margherita Pizza', 340, T], ['Chicken Burger', 320, F]],
      [['Cold Coffee', 160, T], ['Iced Tea', 160, T], ['Hot Chocolate', 180, T]],
      [['Brownie', 190, T], ['Waffle with Ice Cream', 230, T]],
    ],
  },
  north: {
    cuisine: 'North Indian · Multi-cuisine', highlights: ['North Indian classics', 'Sit-down dining', 'Good for groups'], dress: 'Smart casual', after: 'A relaxed drive or walk after dinner.',
    menu: [
      [['Paneer Tikka', 300, T], ['Veg Seekh Kebab', 280, T], ['Chicken Tikka', 340, F]],
      [['Dal Makhani', 300, T], ['Paneer Butter Masala', 340, T], ['Veg Biryani', 320, T], ['Butter Chicken', 420, F]],
      [['Fresh Lime Soda', 100, T], ['Masala Chai', 60, T], ['Sweet Lassi', 110, T]],
      [['Gulab Jamun', 110, T], ['Rasmalai', 150, T]],
    ],
  },
  chinese: {
    cuisine: 'Chinese · Pan-Asian', highlights: ['Noodles and wok dishes', 'Wide menu', 'Good for sharing'], dress: 'Smart casual', after: 'Walk off dinner nearby.',
    menu: [
      [['Veg Spring Rolls', 200, T], ['Crispy Corn', 220, T], ['Chilli Chicken', 300, F]],
      [['Veg Fried Rice', 250, T], ['Hakka Noodles', 260, T], ['Paneer Chilli Gravy', 320, T], ['Chicken Noodles', 300, F]],
      [['Fresh Lime Soda', 100, T], ['Iced Tea', 150, T], ['Virgin Mojito', 170, T]],
      [['Honey Noodles with Ice Cream', 220, T], ['Brownie', 190, T]],
    ],
  },
  veg: {
    cuisine: 'Vegetarian · Thali', highlights: ['Vegetarian', 'Comfort food', 'Family favourite'], dress: 'Comfortable casual', after: 'A short walk, or a sweet from a nearby shop.',
    menu: [
      [['Samosa', 50, T], ['Dahi Vada', 110, T], ['Paneer Pakoda', 160, T]],
      [['Mixed Veg & Paratha', 200, T], ['Paneer Butter Masala & Roti', 260, T], ['Dal Baati', 260, T], ['Veg Thali', 280, T]],
      [['Masala Chai', 30, T], ['Chaas', 50, T], ['Sweet Lassi', 80, T]],
      [['Gulab Jamun', 80, T], ['Moong Dal Halwa', 110, T]],
    ],
  },
  bbq: {
    cuisine: 'BBQ · Grill buffet', highlights: ['Live grills at the table', 'Unlimited feast', 'Playful and social'], dress: 'Casual and comfortable', after: 'Walk off the feast with a stroll.',
    menu: [
      [['Crispy Corn Basket', 230, T], ['Peri-Peri Paneer Bites', 300, T], ['Chicken Wings Basket', 350, F]],
      [['Veg Grill Buffet (per person)', 870, T, 'Unlimited live grills, mains and desserts'], ['Non-Veg Grill Buffet (per person)', 1070, F], ['Premium Buffet (per person)', 1320, F]],
      [['Fresh Lime Soda', 115, T], ['Mango Lassi', 155, T], ['Mocktail of the Day', 205, T]],
      [['Gulab Jamun', 125, T], ['Ice Cream Duo', 165, T]],
    ],
  },
  fine: {
    cuisine: 'Fine dining · Multi-cuisine', highlights: ['Elegant setting', 'Special occasions', 'Attentive service'], dress: 'Smart formal', after: 'A quiet drive after dinner.',
    menu: [
      [['Paneer Tikka', 480, T], ['Galouti Kebab', 560, F], ['Bruschetta', 420, T]],
      [['Dal Makhani', 460, T], ['Paneer Lababdar', 520, T], ['Murgh Makhani', 640, F], ['Pasta Primavera', 540, T]],
      [['Fresh Lime Soda', 180, T], ['Signature Mocktail', 320, T], ['House Wine (glass)', 620, T, '', T]],
      [['Rasmalai Tart', 340, T], ['Chocolate Fondant', 400, T]],
    ],
  },
  chaat: {
    cuisine: 'Chaat · Fast food', highlights: ['Quick and tasty', 'Budget-friendly', 'Local favourite'], dress: 'Comfortable casual', after: 'Finish with a sweet nearby.',
    menu: [
      [['Samosa', 40, T], ['Kachori', 50, T], ['Aloo Tikki', 60, T]],
      [['Pani Puri', 50, T], ['Papdi Chaat', 90, T], ['Pav Bhaji', 100, T], ['Veg Burger', 120, T]],
      [['Masala Chai', 25, T], ['Sweet Lassi', 60, T], ['Cold Coffee', 80, T]],
      [['Jalebi', 60, T], ['Kulfi', 80, T]],
    ],
  },
  sweets: {
    cuisine: 'Sweets · Snacks', highlights: ['Famous sweets', 'Fresh snacks', 'Heritage shop'], dress: 'Comfortable casual', after: 'Take a box of sweets for the walk.',
    menu: [
      [['Samosa', 35, T], ['Kachori', 40, T], ['Dahi Vada', 70, T]],
      [['Poha', 40, T], ['Poori Sabzi', 80, T], ['Chole Bhature', 100, T]],
      [['Masala Chai', 20, T], ['Sweet Lassi', 55, T], ['Badam Milk', 65, T]],
      [['Khoya Jalebi', 90, T], ['Rabri', 90, T], ['Gulab Jamun', 50, T]],
    ],
  },
  nonveg: {
    cuisine: 'Mughlai · Kebabs · Biryani', highlights: ['Kebabs and biryani', 'Hearty portions', 'Local favourite'], dress: 'Comfortable casual', after: 'A relaxed walk after dinner.',
    menu: [
      [['Paneer Tikka', 280, T], ['Seekh Kebab', 300, F], ['Chicken Tikka', 340, F]],
      [['Veg Biryani', 300, T], ['Chicken Biryani', 360, F], ['Butter Chicken', 420, F], ['Mutton Rogan Josh', 520, F]],
      [['Fresh Lime Soda', 100, T], ['Masala Chai', 50, T], ['Cold Drink', 60, T]],
      [['Phirni', 110, T], ['Gulab Jamun', 100, T]],
    ],
  },
}

const round10 = (n) => Math.max(10, Math.round(n / 10) * 10)

/** quick(city, kind, id, name, vibe, emoji, type, tagline, scale?) */
export const quick = (city, kind, id, name, vibe, emoji, type, tagline, scale = 1) => {
  const t = TYPES[type]
  const menu = t.menu.map((cat) => cat.map(([n, p, veg, desc, alc]) => [n, round10(p * scale), veg, desc, alc]))
  return { ...makeVenue(city, id, name, vibe, emoji, t.cuisine, tagline, t.highlights, t.dress, t.after, menu), kind }
}
