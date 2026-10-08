/* Background music playlist. Files live in public/audio/ (AAC .m4a plays in every browser).
   All tracks below are PUBLIC DOMAIN recordings from Wikimedia Commons.

   To add your own track: copy the file into public/audio/ and add an entry here.
   Only add music you own or have a licence to publish — popular songs (and covers of them)
   are copyrighted and must not be bundled into a public website without permission. */

export const MUSIC_TRACKS = [
  {
    title: 'Indian Folk Classical Flute Music (2)',
    artist: 'Bansuri · MayankSingh33',
    src: 'audio/hindustani-flute.m4a',
    source: 'https://commons.wikimedia.org/wiki/File:Indian_Folk_Classical_Flute_Music_(2).wav',
    license: 'CC BY-SA 4.0',
  },
  {
    title: 'Raag Yaman',
    artist: 'Hindustani classical · ज्ञानदा गद्रे-फडके',
    src: 'audio/raga-yaman.m4a',
    source: 'https://commons.wikimedia.org/wiki/File:RagaYaman.wav',
    license: 'CC BY-SA 4.0',
  },
  {
    title: 'Nocturne in E-flat major, Op. 9 No. 2',
    artist: 'Frédéric Chopin · piano: Frank Lévy',
    src: 'audio/chopin-nocturne-op9-no2.m4a',
    source: 'https://commons.wikimedia.org/wiki/File:Chopin_-_Nocturne_No._2_in_E-flat_major,_Op._9_No._2_(Frank_Levy).flac',
    license: 'Public domain',
  },
  {
    title: 'Nocturne in E major, Op. 62 No. 2',
    artist: 'Frédéric Chopin · piano: Luke Faulkner',
    src: 'audio/chopin-nocturne-op62-no2.m4a',
    source: 'https://commons.wikimedia.org/wiki/File:Chopin_-_Nocturne_No._18_in_E_major,_Op._62_No._2_(Luke_Faulkner).flac',
    license: 'Public domain',
  },
  {
    title: 'Gymnopédie No. 1',
    artist: 'Erik Satie · classical guitar: Michael Laucke',
    src: 'audio/gymnopedie-1.m4a',
    source: 'https://commons.wikimedia.org/wiki/File:Satie_Gymnopedie_No_1_performed_by_Michael_Laucke.flac',
    license: 'Public domain',
  },
]

/* Optional default YouTube track (an 11-character video id or a full link). When set, the music panel offers it
   as "Play this song" and plays it in YouTube's own embedded player (YouTube handles the licensing, so no audio
   file is bundled). Visitors can also paste their own link in the panel. */
export const DEFAULT_YOUTUBE = ''

/* Bollywood love instrumentals. These are NOT bundled audio: they play inside YouTube's own embedded player (YouTube
   handles the licensing with the uploader). Each id was checked to be public and embeddable when it was added; if an
   uploader later removes a video, that button simply stops working — replace its id here. */
export const BOLLYWOOD_PICKS = [
  { id: 'zTqadO7V1TM', title: 'Kesariya — instrumental', note: 'Brahmāstra' },
  { id: 'Kb54juoXQvQ', title: 'Apna Bana Le — instrumental', note: 'Bhediya' },
  { id: 'Yut1hsMzHe4', title: 'Raataan Lambiyan — piano', note: 'Shershaah' },
  { id: 'nDAZ7WuWxm0', title: 'Tere Vaaste — instrumental', note: 'Zara Hatke Zara Bachke' },
  { id: 'BKMtuRY2plQ', title: 'Tum Hi Ho — piano', note: 'Aashiqui 2' },
  { id: '6mg6npBiCaM', title: 'Best of Arijit Singh — instrumentals', note: 'Long mix' },
]
