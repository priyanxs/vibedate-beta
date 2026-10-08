/* Delhi: many more real venues. Names are real places; menus are illustrative templates (see quick.js).
   Venues with a photo in src/assets/venues/<id>.jpg show it (credits in photoCredits.js). */
import { quick as q } from './quick'

const D = 'delhi'

export const DELHI_VENUES = [
  /* ---------------------------- Connaught Place ---------------------------- */
  q(D, 'restaurant', 'dl-saravana', 'Saravana Bhavan (Connaught Place)', 'Casual', '🥞', 'south', 'A reliable vegetarian South Indian stop in the heart of CP.', 1.3),
  q(D, 'cafe', 'dl-wengers', 'Wenger’s Deli', 'Cozy', '🥐', 'cafe', 'A classic CP bakery-deli for pastries, sandwiches and tea.', 1.2),
  q(D, 'cafe', 'dl-chabar', 'Cha Bar (Oxford Bookstore)', 'Cozy', '🍵', 'cafe', 'A tea café inside a bookstore — easy, quiet and literary.', 1.25),
  q(D, 'cafe', 'dl-warehouse', 'Warehouse Café', 'Vibrant', '🏭', 'cafe', 'A lively CP café with a wide, modern menu.', 1.3),
  q(D, 'cafe', 'dl-tonino', 'Caffe Tonino', 'Cozy', '☕', 'cafe', 'An Italian-style café in Connaught Place.', 1.35),
  q(D, 'restaurant', 'dl-ladybaga', 'Lady Baga', 'Vibrant', '🌴', 'pub', 'A beach-shack-style bar and kitchen in CP.', 1.1),
  q(D, 'restaurant', 'dl-biryaniblues', 'Biryani Blues', 'Casual', '🍚', 'nonveg', 'Biryani-focused menu with kebabs and curries.', 1.2),
  q(D, 'restaurant', 'dl-bikanervala', 'Bikanervala (Connaught Place)', 'Casual', '🥨', 'veg', 'Vegetarian snacks, chaat and sweets, open all day.', 1.15),
  q(D, 'restaurant', 'dl-castles', 'Castle’s Barbeque', 'Vibrant', '🔥', 'bbq', 'Live-grill barbecue dining in Connaught Place.', 1.1),
  q(D, 'restaurant', 'dl-darzi', 'The Darzi Bar & Kitchen', 'Romantic', '🥂', 'pub', 'A stylish bar and kitchen for a dressier evening.', 1.5),
  q(D, 'restaurant', 'dl-desi', 'Desi Villagio', 'Casual', '🌾', 'north', 'North Indian and multi-cuisine plates in CP.', 1.2),
  q(D, 'cafe', 'dl-openhouse', 'Openhouse Cafe', 'Cozy', '🪴', 'cafe', 'A relaxed Connaught Place café for coffee and meals.', 1.2),
  q(D, 'cafe', 'dl-immigrant', 'The Immigrant Cafe', 'Cozy', '🧳', 'cafe', 'A café for slow coffee and comfort food.', 1.25),
  q(D, 'restaurant', 'dl-ucc', 'United Coffee House', 'Romantic', '🏛️', 'fine', 'A Connaught Place institution with grand, old-world dining.', 1.6),
  q(D, 'cafe', 'dl-ich', 'Indian Coffee House (Connaught Place)', 'Casual', '📚', 'south', 'A no-frills coffee-house classic in Mohan Singh Place.', 0.7),

  /* ---------------------------- Hauz Khas Village ---------------------------- */
  q(D, 'restaurant', 'dl-levels', 'Levels HKV', 'Vibrant', '🎶', 'pub', 'A multi-level Hauz Khas Village hangout.', 1.2),
  q(D, 'cafe', 'dl-raasta', 'Raasta', 'Vibrant', '🌙', 'pub', 'A rooftop café and bar in Hauz Khas Village.', 1.1),
  q(D, 'restaurant', 'dl-matchbox', 'Matchbox', 'Vibrant', '🔥', 'pub', 'A lively Hauz Khas Village bar and kitchen.', 1.1),
  q(D, 'restaurant', 'dl-imperfecto', 'Imperfecto', 'Cozy', '🍷', 'pub', 'A cozy Hauz Khas Village spot for drinks and Italian-leaning plates.', 1.2),
  q(D, 'restaurant', 'dl-masha', 'Masha', 'Vibrant', '🎧', 'pub', 'A Hauz Khas Village bar with a party feel.', 1.1),
  q(D, 'restaurant', 'dl-rehab', 'Rehab Gastropub', 'Vibrant', '🍻', 'pub', 'A Hauz Khas Village gastropub with craft drinks.', 1.15),

  /* ------------------------------- Cafés ----------------------------------- */
  q(D, 'cafe', 'dl-farzi', 'Farzi Café', 'Vibrant', '✨', 'pub', 'Playful modern-Indian plates and cocktails.', 1.5),
  q(D, 'cafe', 'dl-smoke', 'Smoke House Deli', 'Cozy', '🥓', 'cafe', 'An all-day deli café in Khan Market.', 1.5),
  q(D, 'cafe', 'dl-ama', 'Ama Cafe', 'Cozy', '🌼', 'cafe', 'A homely café loved for easy meals and coffee.', 1.05),
  q(D, 'cafe', 'dl-diggin', 'Diggin', 'Romantic', '🌿', 'cafe', 'A leafy, Italian-leaning café with a garden feel.', 1.5),
  q(D, 'cafe', 'dl-rose', 'Rose Cafe', 'Cozy', '🌹', 'cafe', 'A rose-themed café for dessert and coffee.', 1.1),
  q(D, 'cafe', 'dl-cafeteria', 'Cafeteria & Co.', 'Cozy', '🍰', 'cafe', 'A casual café for coffee, bites and desserts.', 1.05),
  q(D, 'cafe', 'dl-tesu', 'Cafe Tesu', 'Cozy', '🫖', 'cafe', 'A café with a cozy, boutique feel.', 1.1),
  q(D, 'cafe', 'dl-bluetokai', 'Blue Tokai Coffee Roasters', 'Cozy', '☕', 'cafe', 'Specialty coffee roasted in India.', 1.15),

  /* --------------------- Old Delhi, street food & icons --------------------- */
  q(D, 'street', 'dl-paranthe', 'Paranthe Wali Gali (Chandni Chowk)', 'Casual', '🫓', 'veg', 'A lane of old parantha shops, stuffed flatbreads for over a century.', 0.9),
  q(D, 'restaurant', 'dl-baburam', 'Babu Ram Devi Dayal Paranthe Wale', 'Casual', '🥘', 'veg', 'A historic parantha shop in Paranthe Wali Gali.', 0.9),
  q(D, 'street', 'dl-natraj', 'Natraj Dahi Bhalle Wala', 'Casual', '🥣', 'chaat', 'Aloo tikki chaat and dahi bhalla since the 1940s.', 1),
  q(D, 'street', 'dl-ramladoo', 'Ram Ladoo (Lajpat Nagar)', 'Casual', '🧆', 'chaat', 'Crispy moong dal ladoo chaat in Lajpat Nagar market.', 1),
  q(D, 'restaurant', 'dl-motimahal', 'Moti Mahal Delux', 'Casual', '🍗', 'nonveg', 'The place that popularised butter chicken and dal makhani.', 1.3),
  q(D, 'restaurant', 'dl-bukhara', 'Bukhara (ITC Maurya)', 'Romantic', '🏺', 'fine', 'Legendary tandoori fine dining at ITC Maurya.', 3.4),
]
