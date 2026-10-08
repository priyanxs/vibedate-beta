// rows: [name, price (₹), isVeg, description?, isAlcohol?]
export const items = (prefix, rows) =>
  rows.map(([name, price, veg, desc, alc], i) => ({
    id: `${prefix}-${i + 1}`,
    name,
    price,
    veg,
    desc: desc || '',
    alc: Boolean(alc),
  }))

// Compact venue builder: menu = [appetizers, mains, drinks, desserts]
export const makeVenue = (city, id, name, vibe, emoji, cuisine, tagline, highlights, dressCode, afterSpot, menu) => ({
  id,
  city,
  name,
  vibe,
  emoji,
  cuisine,
  tagline,
  highlights,
  dressCode,
  afterSpot,
  menu: {
    appetizers: items(`${id}-a`, menu[0]),
    mains: items(`${id}-m`, menu[1]),
    drinks: items(`${id}-d`, menu[2]),
    desserts: items(`${id}-s`, menu[3]),
  },
})
