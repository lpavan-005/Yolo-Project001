export type Category = 'day1' | 'day2' | 'food' | 'deep';

export interface Place {
  id: string;
  cat: Category;
  order?: number;
  name: string;
  time?: string;
  sub?: string;
  lat: number;
  lng: number;
  /** Google place photo - may rate-limit, image components handle fallback */
  photo: string | null;
  note: string;
  maps: string;
  /** Fallback hero image from Unsplash - free, stable, atmospheric */
  fallbackPhoto: string;
  /** For food/deep items that are specifically an evening option for a given day,
   *  without changing their primary category. Keeps them flexible (pick one)
   *  while still surfacing them in that day's timeline/filter. */
  linkedDay?: 'day1' | 'day2';
}

const G = 'https://lh3.googleusercontent.com/place-photos/';

// Curated Unsplash photos by category - stable URLs, atmospheric
const FALLBACK_BY_CAT: Record<Category, string[]> = {
  day1: [
    'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', // himalayan temple
    'https://images.unsplash.com/photo-1597149959910-77f9112eb95b?w=800', // mountain temple
    'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=800', // prayer flags
    'https://images.unsplash.com/photo-1545224144-b38cd309ef69?w=800', // mountain town
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800', // himalayan village
    'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?w=800', // hot spring
    'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800', // waterfall forest
  ],
  day2: [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', // mountain viewpoint
    'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800', // snow valley
    'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800', // tunnel mountain
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800', // glacier river
    'https://images.unsplash.com/photo-1485470733090-0aae1788d5af?w=800', // mountain spring
    'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800', // ancient temple
    'https://images.unsplash.com/photo-1599499068602-ba3aa44e0fbb?w=800', // textile shop
    'https://images.unsplash.com/photo-1559054663-e8d23213f55c?w=800', // tibetan food
  ],
  food: [
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800', // cafe
    'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=800', // pancakes
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', // breakfast spread
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800', // himachali food
    'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800', // thali
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800', // coffee
    'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800', // espresso
    'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800', // cafe interior
    'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800', // cafe quiet
    'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800', // mexican
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800', // riverside dining
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', // dinner
    'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800', // colonial cafe
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800', // trout
  ],
  deep: [
    'https://images.unsplash.com/photo-1542890689-0bfa2c7d6c95?w=800', // apple juice
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=800', // trout
  ],
};

let fallbackIdx: Record<Category, number> = { day1: 0, day2: 0, food: 0, deep: 0 };
function nextFallback(cat: Category): string {
  const arr = FALLBACK_BY_CAT[cat];
  const url = arr[fallbackIdx[cat] % arr.length];
  fallbackIdx[cat]++;
  return url;
}

export const PLACES: Place[] = [
  // ============= DAY 1 =============
  {
    id: 'hadimba', cat: 'day1', order: 1, name: 'Hadimba Devi Temple', time: '7:30 AM',
    lat: 32.2483526, lng: 77.1815727,
    photo: G + 'AJRVUZP0MpmLMQo2m6F5N_UmRQ_cFJtF0NkUaPdCPuzFTt6-3H3le0QH6bVqAmtpp0VdRwF1xXDY393nU6yup8cbveHApTPX-NP3xPZo2P-Yr4VlrKjfdl_OFmUblszzTHDad5Em4_js6OuasE0U-A=s500',
    fallbackPhoto: nextFallback('day1'),
    note: 'Go early, before 9 AM it\'s crowded. 16th-century wooden pagoda inside a deodar forest — the most photographed building in the valley, and it earns it. The four-tiered cedar tower with its conical roof was built in 1553 in honor of Hidimba, a demon-princess from the Mahabharata who became Bhima\'s wife. Look up at the carved entrance: animals, geometric medallions, scenes from the epic. The forest around it is part of the magic; don\'t rush out.',
    maps: 'https://maps.google.com/?cid=3290482383344535452',
  },
  {
    id: 'museum', cat: 'day1', order: 2, name: 'Museum of Himachal Culture & Folk Art', time: '8:15 AM',
    lat: 32.2462111, lng: 77.1805751,
    photo: G + 'AJRVUZMUl7VxZyfhW1wgM5KkDH3uKuBUZMs71mCNBiZyoX0kvCWmZfTHgtMJw4e4IY3u8ocKzs_s6eRusohYSuF5TFIlic5_VV4YPha0A50UwmEZO2s2Tcd9hy2vhNE0cd54duPpW9Nm8MIuiS16AA=s500',
    fallbackPhoto: nextFallback('day1'),
    note: 'Two minutes from Hadimba. ₹30 entry, 20–45 min inside. Traditional Himachali costumes, jewelry, wood carvings, musical instruments, scale models of old temples and Pahari stone houses. This is the actual culture stop — context for everything you\'ll see for the next two days. Skip it and the rest of the trip is just pretty pictures.',
    maps: 'https://maps.google.com/?cid=1829728353546562606',
  },
  {
    id: 'gompa', cat: 'day1', order: 3, name: 'Gadhan Thekchhokling Gompa', time: '9:00 AM',
    lat: 32.2420094, lng: 77.1880419,
    photo: G + 'AJRVUZPD73dRK3S1MnORpXi6rXs-Wl2mYukNW0WXPKhJLmdIVIfg2bbbdcssyMA4ur532d6KZWP2zN2kg8VZ81wJCYsqqk61qRw37wcg8eygZ3pScoP9GZwA8CS48uW47kqSq6rfgSSlrQZH1Wkrtw=s500',
    fallbackPhoto: nextFallback('day1'),
    note: 'Tibetan monastery built by refugees in the 1960s, golden roof, two minutes off Mall Road. Spin the prayer wheels clockwise on the way in, sit a moment if it\'s quiet. The carpet workshop in the back is sometimes open and worth a look.',
    maps: 'https://maps.google.com/?cid=16053422117256869720',
  },
  {
    id: 'mallroad', cat: 'day1', order: 4, name: 'Mall Road & Tibetan Market', time: '9:30 AM',
    lat: 32.2395474, lng: 77.188419,
    photo: G + 'AJRVUZP8oxOZ2yqh7JLnxHc6G_JqkW0UgJW5Z3CWyZFl-nKJ4y44xc0KAp-HfuUpQ5kE9hWbXsxUYxMXF-AbECH7lQZ1nEi7i4E6CuQ7shWCF2WvNkAyKXprXWHNAZohEJXS5qOF7F2DkgAva2Csjg=s500',
    fallbackPhoto: nextFallback('day1'),
    note: 'A quick morning walk-through to get oriented — Mall Road comes alive in the evening, this is just reconnaissance. The Tibetan Market in the lane just behind is the better browse: hand-knit woollens, prayer flags, turquoise jewelry, and almost zero tour groups in the mornings.',
    maps: 'https://maps.google.com/?cid=5092724298667435407',
  },
  {
    id: 'manu', cat: 'day1', order: 5, name: 'Manu Temple & Manaligarh wander', time: '11:00 AM · unhurried',
    lat: 32.257042, lng: 77.1760523,
    photo: G + 'AJRVUZN1FmvjEAW3qCeukAKmX07z1qnVfUwYW64B_j-FTC5R2gLuv-83lQrMDywQYFJaUZmGrVb-AiXFrIIqePe9LLtaW_IQTyFlRzvdoC7egI9HpapsHNCHpnXbX0cOc6AeqlQFrL49dolN07YaqeE=s500',
    fallbackPhoto: nextFallback('day1'),
    note: 'No fixed end time on this one. The only Manu temple in the world — Manali literally means "abode of Manu." Old Manali was originally called Manaligarh: ask any local in these lanes about the ruined fort and the old Pahari stone-roofed houses, they\'ll point you. This is the deliberately unstructured block of the trip. Walk, don\'t navigate. Sit by the Manalsu river. Let a cafe owner talk to you.',
    maps: 'https://maps.google.com/?cid=7000778892376485553',
  },
  {
    id: 'vashisht', cat: 'day1', order: 6, name: 'Vashisht Temple & Hot Springs', time: '2:00 PM',
    lat: 32.2650375, lng: 77.187917,
    photo: G + 'AJRVUZPgLpx7Q07joDAOafElJ1dX6u5lAegabqU_RuGk2s8BCDzkEkqwFiAodOLTxIMfTtRStl52m8_v3boZ7uJd2L5hZd7_OGW47BhEiWep6hoiMgRWIV3a9fZ-V8UCEhKMXTY488vzRpqO9IIIxN0=s500',
    fallbackPhoto: nextFallback('day1'),
    note: 'A 4,000-year-old wood-carved temple to Sage Vashishtha, plus natural sulphur hot spring baths next door (separate sections for men and women, free, surprisingly clean). Genuinely good after a morning of walking — and the soft pre-acclimatization heat is a small kindness to your body before Hampta.',
    maps: 'https://maps.google.com/?cid=10966175281046846565',
  },
  {
    id: 'jogini', cat: 'day1', order: 7, name: 'Jogini Waterfall walk', time: '3:15 PM · optional',
    lat: 32.274739, lng: 77.1855532,
    photo: G + 'AJRVUZMxlWA7nR-AJlEVQpAHla3tCvSYxUxlNWhPSAUVixhfsrH4HuiwMFpe6FitJ23UQrOGK8drcMFjlzZX7Z__VJV7AXeKEHnedBwMBzF6NyoQGySVuvjX7SHaj0uq6--F6kI0IA5rjioMXk3sFw=s500',
    fallbackPhoto: nextFallback('day1'),
    note: 'A gentle ~3km walk through forest from Vashisht — not a trek, but two-plus hours round trip eats time. The waterfall itself is a 150ft cascade that locals consider sacred. Skip if the day is running long; the temple and hot springs alone justify Vashisht.',
    maps: 'https://maps.google.com/?cid=14761532545719677785',
  },
  // ============= DAY 2 =============
  {
    id: 'kothi', cat: 'day2', order: 1, name: 'Kothi Village viewpoint', time: '7:20 AM',
    lat: 32.3148126, lng: 77.1858676,
    photo: G + 'AJRVUZMSnuEGP_PcSTCOhLHGflw1m4xwGfX8nr4A_riEyUahStrGZoq7DXoOwW7IhzoCMjXWQH9ldhUss4KGvbvgteB_65I0CFGhpXyeRgOCDjhVFfESCpPgh25EJnkbxxNFTmaIzJSGtgewi9tJvA=s500',
    fallbackPhoto: nextFallback('day2'),
    note: 'A roadside stop, no walking needed. The Beas gorge opens up here, snow peaks on the horizon — perfect first photo of the day when the light is still soft. Mountaineers traditionally pause here to look at what they\'re heading into.',
    maps: 'https://maps.google.com/?cid=16832392208311684250',
  },
  {
    id: 'solang', cat: 'day2', order: 2, name: 'Solang Valley', time: '7:45 AM',
    lat: 32.3161847, lng: 77.1568471,
    photo: G + 'AJRVUZOBOzyNJJR5GfnfeagJxHUdz2AGCC_HFOCwsnq7hhr1CVG1eC9NwxPPnIWIgxAZUj9Dq_NkWwT9YoIlaSf9uoTClBti7LpenlyP-UExq3EmzgczbYmTZUGFjX5mQ_i6bH1fA3U85Q4RFa_CN8EXfgrGjA=s500',
    fallbackPhoto: nextFallback('day2'),
    note: 'A brief photo stop — paragliding is shut in monsoon, the ropeway runs but isn\'t the day\'s main event. Don\'t pay for activities here; save your energy for Sissu, which delivers more.',
    maps: 'https://maps.google.com/?cid=10737879570819143749',
  },
  {
    id: 'ataltunnel', cat: 'day2', order: 3, name: 'Atal Tunnel South Portal', time: '8:45 AM',
    lat: 32.3641124, lng: 77.1332935,
    photo: G + 'AJRVUZMufKjkITnvWbjRtqWn4jAk-UtVlN2qiU_pGdk27lVMqcl7biqtS6Nzz-3nG4VxJAJzL7nPSAsI8zCObT_e7D8ePYYjY1eD_K33EgBBlN2rODDtJzLESPyg6DmGbZy5X5I02f_VNKO9J1SQ5w=s500',
    fallbackPhoto: nextFallback('day2'),
    note: 'World\'s longest high-altitude tunnel at 3,000m+. Photo at the portal, then through 9km of mountain. On the other side, you\'re in Lahaul — a different valley, different culture, different weather. The drive itself is the moment.',
    maps: 'https://maps.google.com/?cid=4318149296729695169',
  },
  {
    id: 'sissu', cat: 'day2', order: 4, name: 'Sissu', time: '9:35 AM · 2-2.5 hrs',
    lat: 32.4801662, lng: 77.1244267,
    photo: G + 'AJRVUZMZ1xoQ6yoLYJw0FhZfBGCgnIhsZiiBwzKjPoj8rr5uajflWCGDTKw904nMq1D3oz_-nvrC91sTmeTYu84KGADBF4-ErWzMWx0PqkjZ06d8jRQum2qk708RLBfTeXY4wtVm1AKQQshQP2xoVA=s500',
    fallbackPhoto: nextFallback('day2'),
    note: 'The payoff. Snow patches on the peaks even in late July, a 100m+ waterfall straight down the cliff, the glacial Chandra river running through. The valley grows seabuckthorn (chharma) — look for roadside vendors selling fresh juice from local women\'s co-ops, genuinely endemic to right here. Eat a Lahauli thali at a small dhaba: thukpa, momos, sha bakley. This is the highest you\'ll go before Hampta, and the body work begins here.',
    maps: 'https://maps.google.com/?cid=6995630744138823130',
  },
  {
    id: 'nehrukund', cat: 'day2', order: 5, name: 'Nehru Kund', time: '1:30 PM',
    lat: 32.2859822, lng: 77.1798238,
    photo: G + 'AJRVUZORiw8_EeQC1Vug57ZwZ3En4sle0ZrXjxRbh1L3dD9FlpP-syGb0kEmdaqcT5xROla4RQsEek4-XS0g5NR8NmkCwMCXVKsXgFMjjffSF2Kza9wL7Zw9w-Fnu6xZ-LRQG7sdRSzcTPHvKu8lNg=s500',
    fallbackPhoto: nextFallback('day2'),
    note: 'A natural cold spring on the way back into town, named because Nehru reportedly drank from it during visits. Five-minute stop, refill water bottles.',
    maps: 'https://maps.google.com/?cid=11686843260813279563',
  },
  {
    id: 'jagatsukh', cat: 'day2', order: 6, name: 'Jagatsukh Shiv Mandir', time: '3:00 PM',
    lat: 32.198255, lng: 77.2026588,
    photo: G + 'AJRVUZNpnrF09OLDCzyhdz2tWLAqYwEIG-vINGOTSGVh_6_z7klEuSXLm5HtG37XfRRJF-f7tUIAAZRfbEurypJQ9bmlcNbt4KgdsCGPOg6fv9je_PzVSzZ9wFtp6U9Kn80ZUnifmLRQaQrDvkGmHQ=s500',
    fallbackPhoto: nextFallback('day2'),
    note: 'An 8th-century Pandava-era stone temple, six kilometres south of Manali, in a village that was actually the original capital of the Kullu kings. Almost no tourists — the offbeat counterpoint to Hadimba\'s morning crowds. Small, weathered, real.',
    maps: 'https://maps.google.com/?cid=14141064979983014324',
  },
  {
    id: 'bhuttico', cat: 'day2', order: 7, name: 'Bhuttico Showroom', time: '5:30 PM',
    lat: 32.2462699, lng: 77.1892021,
    photo: G + 'AJRVUZNypUBaNQY8vBhQ4PBnWc8cwTIlmkJ-SsLI9AgWHz-prZpHNejndGdNZFv0Kvq5xMBBGy-Qj88aNAjhrTI5yjdCA3DO_kTrg6QmT8mQAWTPVcua-M2ijMli0fe0O4sAx-TznsN4lOiBSofuO-HmSJyOJg=s500',
    fallbackPhoto: nextFallback('day2'),
    note: 'A cooperative founded in 1944 by local women weavers. Government-certified, GI-tagged Kullu and Pashmina shawls — the genuine article that Mall Road stalls mostly imitate. Profits go back to the weaver community. The Mall Road branch is the most convenient of three locations.',
    maps: 'https://maps.google.com/?cid=980958240385922949',
  },
  {
    id: 'chopsticks', cat: 'day2', order: 8, name: 'Chopsticks Restaurant', time: '7:00 PM',
    lat: 32.2439251, lng: 77.1892073,
    photo: G + 'AJRVUZMi03S139p84rHvebCwxJwsec6_ECfJGDKmeKxvUoTGFCfnR_anopcghkicdIjnngsNLsCxerwW9znATM26ieyhiRTZAk3DmJIaq7bbnxbanpi3Dn3UNBQm_5kpBIa2lo06JGC8RMsab6vDcA=s500',
    fallbackPhoto: nextFallback('day2'),
    note: 'A decades-old Tibetan-Chinese-Japanese institution on Mall Road. The consensus across reviews: "a visit to Manali is incomplete without it." Order the thukpa, the momos, and the sha bakley (fried meat momo). The closing dinner of the trip.',
    maps: 'https://maps.google.com/?cid=1333227146972206893',
  },
  // ============= FOOD =============
  {
    id: 'sabali', cat: 'food', sub: 'Breakfast', name: 'Sabali Cafe & Bakery', lat: 32.2534613, lng: 77.1766181,
    photo: G + 'AJRVUZNouLMy14FZL-Q5K-MeXtziS4IrpFAzw8kbcicyzmkdVUKAa0Ey-2HkPPombZX_Hz79OBQfrA1lKo15d6TMr9wSwWWj6oii-4rqhgIx5ISoWl8TeQ_XDpdSXWHbpt16_wAa49_N4m8UHx6H9Q=s500',
    fallbackPhoto: nextFallback('food'),
    note: 'Tucked up a staircase in Old Manali with mountain views. Focaccia, fresh-baked bread, and a coffee that holds up against any in town. Quiet in the mornings.',
    maps: 'https://maps.google.com/?cid=6644430127982018085',
  },
  {
    id: '7sisters', cat: 'food', sub: 'Breakfast', name: '7 Sisters Cafe', lat: 32.2723395, lng: 77.1869065,
    photo: G + 'AJRVUZMwADw6j1TJAi9vb3iASTr-VI1PZS0tgDCiMKojDLYFVGzfxQmaCbjv_lFhAoRqPpJ_NDUS4IXPBQdjvGuZ0AkbCv9MyEMMnyVwbkmhT1cA7G_NGjCMG5CMb_P3C41QFU5g1qCd4uY36oOZmA=s500',
    fallbackPhoto: nextFallback('food'),
    note: 'On the trail toward Jogini Falls, tucked into the woods. Best pancakes in the valley by local consensus, and one of the few places that does proper Siddu — the steamed walnut-stuffed bread that\'s purely Himachali. Combines well with the Jogini walk.',
    maps: 'https://maps.google.com/?cid=10643674775570541565',
  },
  {
    id: 'sunshine', cat: 'food', sub: 'Breakfast', name: 'Sunshine Cafe', lat: 32.2529114, lng: 77.1771765,
    photo: G + 'AJRVUZODMRScBhsxX1IdiSy57YfytqoHHFgRvUUUV_60PL-9iA-jhPUMHlmVSMm6tvDN4siw0bQFU4pxRVo75WTPotBDRiny-bBZzZGksMRjD-54MSkgMEGMXxRPdxHgRO6GhGA3MAegJ58b3UJjDlc=s500',
    fallbackPhoto: nextFallback('food'),
    note: 'The reputation: best Nutella pancakes in Old Manali. Pet-friendly. Quiet during the day, live music some evenings. Sit outside if it\'s sunny.',
    maps: 'https://maps.google.com/?cid=1133400081163872956',
  },
  {
    id: 'himachaliflavours', cat: 'food', sub: 'Local · Siddu', name: 'Himachali Flavours', lat: 32.2459474, lng: 77.1897453,
    photo: G + 'AJRVUZMLUQOH5zUiW_nAltqIKli1Qm3HilbRGwew6qQFMmWsOrCMBicvHaTMa38eMINKuwG09c43nyidbMZVeK8hyMdJ0SqrNoD1fyaS1NOThLZYxWH_JWhNu4o-da2_cChZL-cn15fudicEXKogR5g=s500',
    fallbackPhoto: nextFallback('food'),
    note: 'Two minutes from Hadimba Temple. Locals call it the best Siddu in Manali, and the 4.9 rating backs that up. Also exceptional momos and a surprisingly serious Hyderabadi biryani. Slot it into Day 1 morning.',
    maps: 'https://maps.google.com/?cid=17160227155120513523',
  },
  {
    id: 'pahadi', cat: 'food', sub: 'Lunch · Dham', name: 'The Pahadi Cafe', lat: 32.2458713, lng: 77.18956399999999,
    photo: G + 'AJRVUZOeTt5uJeckvKYFqoLKuUlJ2wz1LsxouBWH-q5hadOPsCZu7ABc7TWsdMLyj33MjlPUFrgbeEyj6cUldCsl2ihvyhH7TKGHZgJJX4zPszNYOm7-ghWdJMyp52jPIGRK1cpFdbabd0ejyvHGtQ=s500',
    fallbackPhoto: nextFallback('food'),
    note: 'A rooftop on Mall Road, panoramic views over the valley, veg and non-veg dham, mutton, siddu. Ask about babru, patande, and madra — the dishes beyond the standard thali. Top-rated Himachali sit-down meal in town.',
    maps: 'https://maps.google.com/?cid=2290408951307618335',
  },
  {
    id: 'fatplate', cat: 'food', sub: 'Lunch', name: 'Fat Plate', lat: 32.217848, lng: 77.197185,
    photo: G + 'AJRVUZNVCQYkh-xXRixMOBlpZrycUcnnElzxlRx1tQXQnt-zf_8NcEMLq9fSj6YHCNUXhkZwBbV5q62zn__iLvgHXgqeag6uhUTM3Q3wbg0PdYwG6yxX--oUY6B5RDwJ9wn9w6S0F8SDCZDadY_JD6M=s500',
    fallbackPhoto: nextFallback('food'),
    note: 'Farm-to-table in Prini, south of town. Homemade lingdi (fern) pickles and apricot jams to take home. Worth a detour for the food, and the drive itself feels different from the tourist circuit.',
    maps: 'https://maps.google.com/?cid=561835632109054563',
  },
  {
    id: 'dylans', cat: 'food', sub: 'Coffee', name: 'Dylan\'s Toasted & Roasted', lat: 32.2527657, lng: 77.1782922,
    photo: G + 'AJRVUZPmlZKIMafnOC9sRHdzSjr85PbzUC9irezVkspzIWz2zMj4_IC2rTr88kXVfEZmiatVD5rLjXr7HKhdKoi-0rePIUQ_Jjw8vAozKxH5xhZhJ-hxLW6usOLZuv8S9VcY1sFNxWKUcj-KTtQU7jU=s500',
    fallbackPhoto: nextFallback('food'),
    note: 'The legend. Running since 2005 (originally "Double Vision"). Often called the best coffee in India by repeat visitors. Pancakes, waffles, and an owner who\'ll talk to you if it\'s slow.',
    maps: 'https://maps.google.com/?cid=6688405209942900445',
  },
  {
    id: 'mingmas', cat: 'food', sub: 'Coffee', name: 'Mingma\'s', lat: 32.2454432, lng: 77.1888585,
    photo: G + 'AJRVUZPowfSrlJJ8tYSlOHXJkdf6TdufhC7unjFiFpgWPeyot_SCrs_N0NYAieLkwXD3C1OmRpzfCAXeJkvQFXWEyqXYpNC2xSKjL1Ac_zoa5puZL8p6JHaTlevBJvTdzX4N4-SA-rylDzQkgwcj=s500',
    fallbackPhoto: nextFallback('food'),
    note: 'Tiny, no-frills, ten seats maybe. Locals\' actual pick for the best coffee in town — quieter than Dylan\'s, more focused. Coffee and desserts only. The carrot cake is the move.',
    maps: 'https://maps.google.com/?cid=4248827492482655897',
  },
  {
    id: 'bornfree', cat: 'food', sub: 'Coffee', name: 'Born Free Cafe', lat: 32.25274, lng: 77.178696,
    photo: G + 'AJRVUZOG9PY3_1qGrU7kWIu3rglwIHAmm3akubye4vep-y50z2YQoegi502ZHDxz7O2XDJBMcUxPeQjy3YcGKAOGeP1yDdrc7GG5fHGcHhub5G-FM9qoGgWqFTP5IVou8101I_USEFQWFIx91HJYwg=s500',
    fallbackPhoto: nextFallback('food'),
    note: 'Blue Tokai roasters, working wifi, coworking-style seating in the day, live music in the evenings. If you need a real laptop hour, this is it.',
    maps: 'https://maps.google.com/?cid=12249333819187785907',
  },
  {
    id: 'drifters', cat: 'food', sub: 'Coffee', name: 'Drifters\' Cafe', lat: 32.2550286, lng: 77.1769401,
    photo: G + 'AJRVUZPtXCdXZEn9yuTnKMoed7KZqPkqHQCcrRexeZl0zugbfHyRS5LfSQYcWeieNqvIxtHSGWU3mO1n6K-ZAScCmXsEaX8ZdlFoq7clQYY2-vE9X8ed3k_Ndd_48xaBLvCyddhGeyifhNjNpDACoCzKSs-C=s500',
    fallbackPhoto: nextFallback('food'),
    note: 'Old Manali. Cozy, board games on the shelf, a pool table, and a coffee program serious enough to mention alongside Dylan\'s. Backpacker institution.',
    maps: 'https://maps.google.com/?cid=8270927780300967476',
  },
  {
    id: 'amigos', cat: 'food', sub: 'Quick bite', name: 'Cafe Amigos', lat: 32.2463225, lng: 77.1891964,
    photo: G + 'AJRVUZNkfC_RwTpPKWzW0WsAeofz420f7zR9ueVoRdpR1G66Hcn7sNulNsflDDi0sTGnqm3RWr_P8hFRs-ghxffs53Uy3VBrKyi000R-hBc79mThNZC-MZLctWbynLGz4PYp7xZVWOqIAMSn99kw91Q=s500',
    fallbackPhoto: nextFallback('food'),
    note: 'Surprisingly good Mexican plus a German-bakery side. The blueberry cheesecake is the local favourite. Mall Road location, easy to slot in mid-day.',
    maps: 'https://maps.google.com/?cid=891907338336742259',
  },
  {
    id: 'cafe1947', cat: 'food', sub: 'Dinner', linkedDay: 'day1', name: 'Cafe 1947', lat: 32.282985, lng: 77.1805034,
    photo: G + 'AJRVUZPabnJaNHKJuwO4saqRFsGUhXPE4NIbCY-SAQYXhKZkabRBitttBuxmrjFS_hGQspybs9JCP_OSojIq9Wk_T1eZGyS_XrvrSRpMxfWxc6kQTn-qy5QXDuhFSFB7Rxrk1TENU0j4BAq2GvRSMZs=s500',
    fallbackPhoto: nextFallback('food'),
    note: 'Riverside on the Beas, in Bahang. Italian-leaning, live music most evenings. Go for the setting first, the food second — both are good, but the river-and-firepit atmosphere is the actual reason.',
    maps: 'https://maps.google.com/?cid=16349313308763280428',
  },
  {
    id: 'lazydog', cat: 'food', sub: 'Dinner', linkedDay: 'day1', name: 'The Lazy Dog Lounge', lat: 32.253047, lng: 77.1767637,
    photo: G + 'AJRVUZMFKXV21uckMJ0hVg4aNdElEhzmy3B9QIfG7OjUL0Aex3wAKcaDfP4mrOCpZ8hp1WNNw0SRq957cKZgQ3wJrti650_7yO543igEpLw_G686bBWm7imqh1kGulH1LCabsQXkZAkejJYHsbgzhRD2hzQcsA=s500',
    fallbackPhoto: nextFallback('food'),
    note: 'Old Manali, riverside. The most-cited single most iconic Old Manali night out. Live music, grilled trout, and the kind of crowd that makes you remember the evening for the right reasons.',
    maps: 'https://maps.google.com/?cid=8922124573768640723',
  },
  {
    id: 'johnsons', cat: 'food', sub: 'Dinner', linkedDay: 'day1', name: 'Johnson\'s Cafe Hotel & Bar', lat: 32.2475075, lng: 77.1873987,
    photo: G + 'AJRVUZPt7tuSBQTSF7BQyF_OsJZWf7zCtBDB9_2nunTpaj1u8TI1xhQzLf1OTd19u2goJhcZhx5K31Gaegwcjg0iUR3fOVF6rfcRkxGB0-TZ3vsaqltEEaG47xEHh1YHMPYFhYQ3CrpqJTOvW4it5A=s500',
    fallbackPhoto: nextFallback('food'),
    note: 'Old colonial-bungalow institution on Circuit House Road. Garden seating, trout grilled to order, a quieter atmosphere than the Old Manali riverside scene. The romantic option.',
    maps: 'https://maps.google.com/?cid=16493807488697696469',
  },
  {
    id: 'khyber', cat: 'food', sub: 'Dinner', linkedDay: 'day1', name: 'Khyber Restaurant & Bar', lat: 32.2457586, lng: 77.1896348,
    photo: G + 'AJRVUZOaXbGDmiswQMaBiq63ZkZYEyV14qkRPngMczXDJ1uZzR2YoyLJRExsL4FJBm6sA2XolaVTdMC3-M994olcKtYDEvFsGWmhJA2B-OvY1MOnBIIZ7bzA62rRxIZ24EjBLuB-F9gDy_zn2wsK=s500',
    fallbackPhoto: nextFallback('food'),
    note: 'Mall Road, known for tandoori trout, with a view over the street. Honest note: recent reviews are mixed (3.4 stars), the older reputation was stronger. Worth a look, not a sure bet.',
    maps: 'https://maps.google.com/?cid=11421573581749531310',
  },
  // ============= DEEP CUTS =============
  {
    id: 'himcoop', cat: 'deep', sub: 'Local institution', name: 'Asli Himcoop Juice Bar', lat: 32.2474564, lng: 77.1842064,
    photo: null,
    fallbackPhoto: nextFallback('deep'),
    note: 'A cooperative juice shop near Durga Temple on Mall Road, running since around 1972 — 100% natural apple juice and fruit-crush syrups from the valley literally called India\'s Fruit Bowl. Important: there is a poorly-rated lookalike on the same road. Locals call the real one "Asli" (genuine) Himcoop — ask for it by that name.',
    maps: 'https://www.google.com/maps/search/?api=1&query=Asli+Himcoop+Juice+Bar+Manali',
  },
  {
    id: 'troutfarm', cat: 'deep', sub: 'Catch & cook', name: 'Himalayan Trout Fish Farm', lat: 32.1450725, lng: 77.1747963,
    photo: G + 'AJRVUZPT8GXIrbuWIoUZKRqso476K8c9-eoOFkjPC0Usqtv3dBX2GggsjPm3fmQimnMZBqu6L1veZqAlP3t90Yov93Yu1MD6rlvS7piglDoESmdYVWxWnw6rTFnVAWC6wvqN_jMpqqOz0S9brSnFngs=s500',
    fallbackPhoto: nextFallback('deep'),
    note: 'In Haripur, ~16km south, a dedicated detour. Trout farming here traces to British colonial stocking over a century ago, run by one family across generations. Catch your own, they\'ll grill it. Honest caveat: recent reviews mention flood damage and a semi-operational state from a secondary site — call ahead.',
    maps: 'https://maps.google.com/?cid=7147779442288585859',
  },
];

export const CATEGORY_META: Record<Category, { label: string; short: string; color: string; soft: string; ink: string }> = {
  day1: { label: 'Day 1 · Temples & Old Manali', short: 'Day 1', color: '#5687A8', soft: '#E8F0F6', ink: '#2C4E66' },
  day2: { label: 'Day 2 · Atal Tunnel & Sissu', short: 'Day 2', color: '#D4933A', soft: '#FBF1DF', ink: '#7A5314' },
  food: { label: 'Food & Drink', short: 'Eat', color: '#A85432', soft: '#F6E4DB', ink: '#5C2D17' },
  deep: { label: 'Deep Cuts', short: 'Deep', color: '#4A6B5A', soft: '#E3ECE6', ink: '#2A3F33' },
};
