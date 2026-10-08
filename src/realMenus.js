/* ==========================================================================
   REAL MENUS
   Every venue starts with an illustrative template menu. When you have a venue's real menu (a photo of the menu card,
   the printed menu, or permission from the venue), add it here and it replaces the template for that venue only.

   Format — the key is the venue id (see the `id` in src/venues/*.js, e.g. 'kl-6bp'):
     'venue-id': {
       source: 'Menu card photographed on 10 Oct 2026',      // shown to visitors under the menu
       menu: [
         [ ['Dish name', 320, true, 'short description'], ... ],   // starters
         [ ... ],                                                  // mains
         [ ... ],                                                  // drinks   (a 5th value `true` marks alcohol)
         [ ... ],                                                  // desserts
       ],
     },
   Each dish row is: [name, price in rupees, isVegetarian, description (optional), isAlcohol (optional)].
   Venues listed here show "Menu and prices from <source>" instead of the "illustrative" note.
   ========================================================================== */

export const REAL_MENUS = {
  // 'kl-6bp': {
  //   source: 'Menu card photographed on 10 Oct 2026',
  //   menu: [
  //     [['Bhetki Paturi', 650, false, 'Fish steamed in mustard paste']],
  //     [['Kosha Mangsho', 720, false], ['Basanti Pulao', 380, true]],
  //     [['Aam Pora Shorbot', 180, true]],
  //     [['Mishti Doi', 150, true]],
  //   ],
  // },
}
