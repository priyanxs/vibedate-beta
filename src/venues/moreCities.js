/* Extra venues so Indore and Jabalpur have 20 each. Names are real places; menus are illustrative templates (see quick.js). */
import { quick as q } from './quick'

export const MORE_VENUES = [
  /* ------------------------------ Indore (+11) ----------------------------- */
  q('indore', 'cafe', 'in-chalan', 'Chalan Cafe', 'Casual', '☕', 'cafe', 'A Vijay Nagar café for coffee, snacks and easy conversation.', 0.95),
  q('indore', 'restaurant', 'in-olive', 'Olive Leaf', 'Cozy', '🫒', 'north', 'A Vijay Nagar restaurant with a relaxed, multi-cuisine menu.', 1.1),
  q('indore', 'cafe', 'in-coffeenism', 'Coffeenism', 'Cozy', '🫘', 'cafe', 'A coffee-first café in Vijay Nagar.', 1),
  q('indore', 'cafe', 'in-sencia', 'Sencia Cafe', 'Cozy', '🍰', 'cafe', 'A cozy Vijay Nagar café with desserts and light meals.', 1.05),
  q('indore', 'restaurant', 'in-cream', 'Cream Centre', 'Casual', '🍨', 'north', 'A family-friendly restaurant known for its ice-cream desserts.', 1.05),
  q('indore', 'restaurant', 'in-ohlio', 'Ohlio Gourmet Cafe & Bar', 'Vibrant', '🍸', 'chinese', 'A lively AB Road café and bar with a wide menu.', 1.3),
  q('indore', 'restaurant', 'in-kabelo', 'Kabelo Veg Barbecues', 'Vibrant', '🔥', 'bbq', 'Live-grill vegetarian barbecues at the table.', 0.95),
  q('indore', 'restaurant', 'in-capers', 'Capers (Effotel by Sayaji)', 'Romantic', '🍷', 'fine', 'Hotel dining for a special evening.', 1.15),
  q('indore', 'restaurant', 'in-destiny', 'Destiny Cafe and Fine Dine', 'Romantic', '🕯️', 'fine', 'A fine-dine café for dressy dinners.', 1),
  q('indore', 'cafe', 'in-r5', 'R5 Caffe Junction', 'Casual', '🥪', 'cafe', 'A casual café junction for snacks and coffee.', 0.9),
  q('indore', 'restaurant', 'in-bn', 'Barbeque Nation (Indore)', 'Vibrant', '🔥', 'bbq', 'Live grills at your table — fun from the first skewer.', 1),

  /* ----------------------------- Jabalpur (+13) ---------------------------- */
  q('jabalpur', 'restaurant', 'jb-dhaba', 'Dhaba – Estd 1986 Delhi', 'Casual', '🍢', 'nonveg', 'Mughlai, North Indian and kebabs in Napier Town.', 1),
  q('jabalpur', 'cafe', 'jb-ccd', 'Café Coffee Day (Napier Town)', 'Cozy', '☕', 'cafe', 'A familiar café for coffee and quick bites.', 1),
  q('jabalpur', 'restaurant', 'jb-spiceit', 'Spice It (Ibis Hotel)', 'Romantic', '🍽️', 'fine', 'Hotel restaurant in Civil Lines.', 1.1),
  q('jabalpur', 'restaurant', 'jb-chaatbistro', 'Chaat Bistro', 'Casual', '🥘', 'chaat', 'Chaat and snacks in Civil Lines.', 1.2),
  q('jabalpur', 'restaurant', 'jb-meraaki', 'Meraaki Kitchen', 'Cozy', '🍛', 'north', 'A Civil Lines kitchen for comfort-food dinners.', 1),
  q('jabalpur', 'restaurant', 'jb-spicecourt', 'Spice Court', 'Casual', '🌶️', 'north', 'North Indian dining in Civil Lines.', 1),
  q('jabalpur', 'cafe', 'jb-barista', 'Barista (Civil Lines)', 'Cozy', '🫖', 'cafe', 'Coffee, beverages, fast food and desserts.', 1),
  q('jabalpur', 'restaurant', 'jb-bn', 'Barbeque Nation (Jagat Mall)', 'Vibrant', '🔥', 'bbq', 'Barbecue, kebabs and biryani at Jagat Mall.', 0.95),
  q('jabalpur', 'restaurant', 'jb-downing', '10 Downing Street (Marhatal)', 'Vibrant', '🏙️', 'chinese', 'Biryani, Chinese, Italian and North Indian under one roof.', 1.05),
  q('jabalpur', 'restaurant', 'jb-asanzo', 'Asanzo Fast Food Restaurant', 'Casual', '🍔', 'chaat', 'Pure-veg South Indian, North Indian, Italian and street food.', 1.3),
  q('jabalpur', 'restaurant', 'jb-panchavti', 'Panchavti Gaurav', 'Cozy', '🍲', 'veg', 'A popular air-conditioned restaurant for Rajasthani and Gujarati food.', 1.1),
  q('jabalpur', 'restaurant', 'jb-roopali', 'Roopali Restaurant', 'Casual', '🥗', 'veg', 'Vegetarian Continental, Indian, South Indian and Punjabi dishes.', 1),
  q('jabalpur', 'street', 'jb-badkul', 'Badkul (Fawara)', 'Casual', '🍯', 'sweets', 'A Fawara sweet shop, famous for khoya jalebi since 1889.', 1),
]
