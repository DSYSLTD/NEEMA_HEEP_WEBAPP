export interface CountyDetails {
  name: string;
  subCounties: string[];
  constituencies: string[];
  wards: Record<string, string[]> & { [key: string]: string[] };
}

export const ALL_47_COUNTIES = [
  'Baringo',
  'Bomet',
  'Bungoma',
  'Busia',
  'Elgeyo-Marakwet',
  'Embu',
  'Garissa',
  'Homa Bay',
  'Isiolo',
  'Kajiado',
  'Kakamega',
  'Kericho',
  'Kiambu',
  'Kilifi',
  'Kirinyaga',
  'Kisii',
  'Kisumu',
  'Kitui',
  'Kwale',
  'Laikipia',
  'Lamu',
  'Machakos',
  'Makueni',
  'Mandera',
  'Marsabit',
  'Meru',
  'Migori',
  'Mombasa',
  'Murang\'a',
  'Nairobi',
  'Nakuru',
  'Nandi',
  'Narok',
  'Nyamira',
  'Nyandarua',
  'Nyeri',
  'Samburu',
  'Siaya',
  'Taita–Taveta',
  'Tana River',
  'Tharaka-Nithi',
  'Trans Nzoia',
  'Turkana',
  'Uasin Gishu',
  'Vihiga',
  'Wajir',
  'West Pokot',
];

export const KENYA_COUNTIES = ALL_47_COUNTIES;
export const COUNTIES_LIST = ALL_47_COUNTIES;

// Detailed data mapping for counties
const RAW_COUNTY_MAP: Record<string, { subCounties: string[]; wards: Record<string, string[]> }> = {
  'Embu': {
    subCounties: ['Manyatta', 'Runyenjes', 'Mbeere North', 'Mbeere South'],
    wards: {
      'Manyatta': ['Ruguru-Ngandori', 'Kirimari', 'Gaturi South', 'Kithimu', 'Mbeti North', 'Nginda'],
      'Runyenjes': ['Gaturi North', 'Kagaari Upper', 'Kagaari Lower', 'Central Ward', 'Kyeni North', 'Kyeni South'],
      'Mbeere North': ['Nthawa', 'Muminji', 'Evuroore'],
      'Mbeere South': ['Mbeti South', 'Mavuria', 'Mwea', 'Makima', 'Kiambere'],
    },
  },
  'Nyeri': {
    subCounties: ['Nyeri Town', 'Kieni East', 'Kieni West', 'Mathira East', 'Mathira West', 'Mukurweini', 'Tetu', 'Othaya'],
    wards: {
      'Nyeri Town': ['Rware', 'Ruring\'u', 'Kiganjo/Mathari', 'Gatitu/Aguthi'],
      'Kieni East': ['Gakawa', 'Kabaru', 'Naromoru/Kiamathaga'],
      'Kieni West': ['Mweiga', 'Endarasha/Mwiyogo', 'Gatarakwa'],
      'Mathira East': ['Iratu', 'Magutu', 'Kirimukuyu'],
      'Mathira West': ['Ruguru', 'Kiganjo'],
      'Mukurweini': ['Mukurweini West', 'Mukurweini Central', 'Rugi'],
      'Tetu': ['Dedan Kimathi', 'Wamagana', 'Aguthi-Gaaki'],
      'Othaya': ['Mahiga', 'Iria-ini', 'Chinga', 'Karima'],
    },
  },
  'Kirinyaga': {
    subCounties: ['Kirinyaga Central', 'Kirinyaga East', 'Kirinyaga West', 'Mwea East', 'Mwea West'],
    wards: {
      'Kirinyaga Central': ['Mutira', 'Kanyekini', 'Kerugoya', 'Inoi'],
      'Kirinyaga East': ['Kabare', 'Baragwi', 'Karumandi'],
      'Kirinyaga West': ['Mukure', 'Kiine', 'Kariti'],
      'Mwea East': ['Tebere', 'Nyangati', 'Murinduko'],
      'Mwea West': ['Mutithi', 'Kangai', 'Thiba'],
    },
  },
  'Murang\'a': {
    subCounties: ['Kiharu', 'Kangema', 'Mathioya', 'Kandara', 'Gatanga', 'Maragua', 'Kigumo'],
    wards: {
      'Kiharu': ['Township', 'Mbiri', 'Mugoiri', 'Murarandia'],
      'Kangema': ['Kanga', 'Muguru', 'Rwathia'],
      'Mathioya': ['Gitugi', 'Kiru', 'Kamacharia'],
      'Kandara': ['Ng\'araria', 'Muruka', 'Ithiru', 'Ruchu'],
      'Gatanga': ['Ithanga', 'Kakuzi/Mitubiri', 'Mugumo-ini', 'Gatanga'],
      'Maragua': ['Kimorori/Wempa', 'Makuyu', 'Kamahuha', 'Ichagaki'],
      'Kigumo': ['Kahumbu', 'Muthithi', 'Kigumo', 'Kangari'],
    },
  },
  'Kiambu': {
    subCounties: ['Githunguri', 'Kiambu', 'Kikuyu', 'Limuru', 'Ruiru', 'Thika Town', 'Lari', 'Juja', 'Gatundu North', 'Gatundu South', 'Kabete', 'Kiambaa'],
    wards: {
      'Githunguri': ['Githunguri', 'Githiga', 'Ikinu', 'Ngewa', 'Komothai'],
      'Kiambu': ['Township', 'Riabai', 'Ndumberi', 'Ting\'ang\'a'],
      'Kikuyu': ['Karai', 'Nachu', 'Sigona', 'Kikuyu', 'Kinoo'],
      'Limuru': ['Limuru Central', 'Limuru East', 'Ndeiya', 'Bibirioni', 'Tigoni/Ngecha'],
      'Ruiru': ['Gitothua', 'Biashara', 'Gatongora', 'Kahawa Sukari', 'Kahawa Wendani', 'Kiuu', 'Mwiki'],
      'Thika Town': ['Township', 'Kamenu', 'Hospital', 'Gatuanyaga', 'Ngenya'],
      'Lari': ['Kijabe', 'Nyanduma', 'Kamburu', 'Lari/Kirenga'],
      'Juja': ['Murera', 'Theta', 'Juja', 'Kalimoni', 'Witeithie'],
      'Gatundu North': ['Gituamba', 'Githobokoni', 'Chania', 'Mang\'u'],
      'Gatundu South': ['Kiamwangi', 'Kiganjo', 'Ndarugu', 'Ngenda'],
      'Kabete': ['Gitaru', 'Muguga', 'Nyadhuna', 'Kabete', 'Uthiru'],
      'Kiambaa': ['Cianda', 'Karuri', 'Ndenderu', 'Muchatha', 'Kihara'],
    },
  },
  'Meru': {
    subCounties: ['Imenti North', 'Imenti South', 'Central Imenti', 'Tigania West', 'Tigania East', 'Buuri', 'Igembe North', 'Igembe Central', 'Igembe South'],
    wards: {
      'Imenti North': ['Municipality', 'Ntima East', 'Ntima West', 'Nyaki North', 'Nyaki South'],
      'Imenti South': ['Mitunguu', 'Igoji East', 'Igoji West', 'Abogeta East', 'Abogeta West', 'Nkuene'],
      'Central Imenti': ['Mwanganthia', 'Abothuguchi Central', 'Abothuguchi West', 'Kiagu'],
      'Tigania West': ['Athwana', 'Akithii', 'Kianjai', 'Nkomo', 'Mbeeu'],
      'Tigania East': ['Mikinduri', 'Karama', 'Muthara', 'Thangatha'],
      'Buuri': ['Timau', 'Kisima', 'Kiirua/Naari', 'Ruiri/Rwarera'],
      'Igembe North': ['Antuambui', 'Ntunene', 'Antubetwe Kiongo', 'Naathu', 'Amwathi'],
      'Igembe Central': ['Akirang\'ondu', 'Kangeta', 'Njia', 'Igembe East'],
      'Igembe South': ['Maua', 'Kiegoi/Antubochiu', 'Athiru Gaiti', 'Akachiu', 'Kanuni'],
    },
  },
  'Laikipia': {
    subCounties: ['Laikipia East', 'Laikipia West', 'Laikipia North'],
    wards: {
      'Laikipia East': ['Nanyuki', 'Umande', 'Thingithu', 'Tigithi', 'Ngobit'],
      'Laikipia West': ['Ol-Moran', 'Rumuruti Township', 'Githiga', 'Marmanet', 'Salama'],
      'Laikipia North': ['Mukogodo East', 'Mukogodo West', 'Sosian', 'Segera'],
    },
  },
  'Nairobi': {
    subCounties: ['Westlands', 'Dagoretti North', 'Dagoretti South', 'Lang\'ata', 'Kibra', 'Roysambu', 'Kasarani', 'Ruaraka', 'Embakasi South', 'Embakasi North', 'Embakasi Central', 'Embakasi East', 'Embakasi West', 'Makadara', 'Kamukunji', 'Starehe', 'Mathare'],
    wards: {
      'Westlands': ['Kitisuru', 'Parklands/Highridge', 'Karura', 'Kangemi', 'Mountain View'],
      'Dagoretti North': ['Kilimani', 'Kawangware', 'Gatina', 'Kileleshwa', 'Kabiro'],
      'Dagoretti South': ['Mutu-ini', 'Ngando', 'Riruta', 'Uthiru/Ruthimitu', 'Waithaka'],
      'Lang\'ata': ['Karen', 'Nairobi West', 'Mugumu-ini', 'South C', 'Nyayo Highrise'],
      'Kibra': ['Laini Saba', 'Lindi', 'Makina', 'Woodley/Kenyatta Golf Course', 'Sarang\'ombe'],
      'Roysambu': ['Githurai', 'Kahawa West', 'Zimmerman', 'Roysambu', 'Kahawa'],
      'Kasarani': ['Clay City', 'Mwiki', 'Kasarani', 'Njiru', 'Ruai'],
      'Ruaraka': ['Babadogo', 'Utalii', 'Mathare North', 'Lucky Summer', 'Korogocho'],
      'Embakasi South': ['Imara Daima', 'Kwa Njenga', 'Kwa Reuben', 'Pipeline', 'Kware'],
      'Embakasi North': ['Kariobangi North', 'Dandora Area I', 'Dandora Area II', 'Dandora Area III', 'Dandora Area IV'],
      'Embakasi Central': ['Kayole North', 'Kayole Central', 'Kayole South', 'Komarock', 'Matopeni/Spring Valley'],
      'Embakasi East': ['Upper Savanna', 'Lower Savanna', 'Embakasi', 'Utawala', 'Mihango'],
      'Embakasi West': ['Umoja I', 'Umoja II', 'Mowlem', 'Kariobangi South'],
      'Makadara': ['Maringo/Hamza', 'Harambee', 'Makadara', 'Viwandani'],
      'Kamukunji': ['Pumwani', 'Eastleigh North', 'Eastleigh South', 'Airbase', 'California'],
      'Starehe': ['Nairobi Central', 'Ngara', 'Pangani', 'Ziwani/Kariokor', 'Landimawe', 'South B'],
      'Mathare': ['Hospital', 'Mabatini', 'Huruma', 'Ngei', 'Mlango Kubwa', 'Kiamaiko'],
    },
  },
  'Nakuru': {
    subCounties: ['Nakuru Town East', 'Nakuru Town West', 'Naivasha', 'Gilgil', 'Kuresoi South', 'Kuresoi North', 'Molo', 'Njoro', 'Rongai', 'Subukia', 'Bahati'],
    wards: {
      'Nakuru Town East': ['Biashara', 'Kivumbini', 'Flamingo', 'Menengai', 'Nakuru East'],
      'Nakuru Town West': ['Barut', 'London', 'Kaptembwo', 'Kapkures', 'Rhoda'],
      'Naivasha': ['Biashara', 'Hells Gate', 'Lake View', 'Mai Mahiu', 'Maella', 'Olkaria', 'Naivasha East'],
      'Gilgil': ['Gilgil', 'Elementaita', 'Mbaruk/Eburu', 'Malewa West', 'Murindat'],
      'Kuresoi South': ['Amalo', 'Keringet', 'Kiptororo', 'Tinet'],
      'Kuresoi North': ['Kiptororo', 'Nyota', 'Sirikwa', 'Kamara'],
      'Molo': ['Molo', 'Elburgon', 'Turi', 'Mariashoni'],
      'Njoro': ['Njoro', 'Lare', 'Nessuit', 'Likiia', 'Kihingo'],
      'Rongai': ['Menengai West', 'Soin', 'Visoi', 'Mosop', 'Solai'],
      'Subukia': ['Subukia', 'Waseges', 'Kabazi'],
      'Bahati': ['Bahati', 'Dundori', 'Kabatini', 'Lanet/Umoja', 'Kiamaina'],
    },
  },
  'Machakos': {
    subCounties: ['Machakos Town', 'Mavoko', 'Kangundo', 'Matungulu', 'Yatta', 'Masinga', 'Mwala', 'Kathiani'],
    wards: {
      'Machakos Town': ['Kalama', 'Muua', 'Machakos Central', 'Muvuti/Kiima-Kimwe', 'Mutituni'],
      'Mavoko': ['Athi River', 'Machakos East', 'Katani', 'Mlolongo/Syokimau'],
      'Kangundo': ['Kangundo North', 'Kangundo Central', 'Kangundo East', 'Kangundo West'],
      'Matungulu': ['Tala', 'Matungulu North', 'Matungulu East', 'Matungulu West', 'Kyeleni'],
      'Yatta': ['Ndalani', 'Matuu', 'Kithimani', 'Ikombe', 'Katangi'],
      'Masinga': ['Kivaa', 'Masinga Central', 'Ekalakala', 'Muthesya', 'Ndithini'],
      'Mwala': ['Kibauni', 'Masii', 'Mwala', 'Muthetheni', 'Wamunyu'],
      'Kathiani': ['Mitaboni', 'Kathiani Central', 'Upper Kaewa', 'Lower Kaewa'],
    },
  },
  'Nyandarua': {
    subCounties: ['Kinangop', 'Kipipiri', 'Ol Kalou', 'Ol Jorok', 'Ndaragwa'],
    wards: {
      'Kinangop': ['Engineer', 'Gathara', 'North Kinangop', 'Murungaru', 'Njabini/Kiburu', 'Nyakio', 'Magumu'],
      'Kipipiri': ['Wanjohi', 'Kipipiri', 'Geta', 'Gathanji'],
      'Ol Kalou': ['Karau', 'Kanjuiri Ridge', 'Mirangine', 'Kaimbaga', 'Rurii'],
      'Ol Jorok': ['Gathanji', 'Gatimu', 'Weru', 'Charagita'],
      'Ndaragwa': ['Leshau Pondo', 'Kiriita', 'Central', 'Shamata'],
    },
  },
  'Tharaka-Nithi': {
    subCounties: ['Chuka', 'Igambang\'ombe', 'Tharaka South', 'Tharaka North', 'Maara'],
    wards: {
      'Chuka': ['Mariani', 'Karingani', 'Magumoni'],
      'Igambang\'ombe': ['Mugwe', 'Igambang\'ombe'],
      'Tharaka South': ['Marimanti', 'Nkondi', 'Chiakariga'],
      'Tharaka North': ['Gatunga', 'Mukothima'],
      'Maara': ['Mitheru', 'Muthambi', 'Ganga', 'Chogoria'],
    },
  },
  'Mombasa': {
    subCounties: ['Mvita', 'Nyali', 'Changamwe', 'Jomvu', 'Kisauni', 'Likoni'],
    wards: {
      'Mvita': ['Mji wa Kale/Makadara', 'Tudor', 'Tononoka', 'Shimanzi/Ganjoni', 'Majengo'],
      'Nyali': ['Frere Town', 'Ziwa la Ng\'ombe', 'Mkomani', 'Kongowea', 'Kadzandani'],
      'Changamwe': ['Port Reitz', 'Kipevu', 'Airport', 'Changamwe', 'Chaani'],
      'Jomvu': ['Jomvu Kuu', 'Miritini', 'Mikindani'],
      'Kisauni': ['MJambere', 'Junda', 'Bamburi', 'Mwakirunge', 'Mtopanga', 'Magogoni'],
      'Likoni': ['Mtongwe', 'Shika Adabu', 'Bofu', 'Likoni', 'Timbwani'],
    },
  },
  'Kisumu': {
    subCounties: ['Kisumu Central', 'Kisumu East', 'Kisumu West', 'Seme', 'Nyando', 'Muhoroni', 'Nyakach'],
    wards: {
      'Kisumu Central': ['Railways', 'Migosi', 'Shauri Moyo Kaloleni', 'Market Milimani', 'Konndele'],
      'Kisumu East': ['Kajulu', 'Kolwa East', 'Manyatta B', 'Nyalenda A', 'Kolwa Central'],
      'Kisumu West': ['South West Kisumu', 'Central Kisumu', 'Kisumu North', 'West Kisumu', 'North West Kisumu'],
      'Seme': ['West Seme', 'Central Seme', 'East Seme', 'North Seme'],
      'Nyando': ['East Kano/Wawidhi', 'Awasi/Onjiko', 'Ahero', 'Kabonyo/Kanyagwal', 'Kobura'],
      'Muhoroni': ['Miwani', 'Ombeyi', 'Masogo/Nyang\'oma', 'Chemelil', 'Muhoroni/Koru'],
      'Nyakach': ['South West Nyakach', 'North Nyakach', 'Central Nyakach', 'West Nyakach', 'South East Nyakach'],
    },
  },
  'Uasin Gishu': {
    subCounties: ['Ainabkoi', 'Kapseret', 'Kesses', 'Moiben', 'Soy', 'Turbo'],
    wards: {
      'Ainabkoi': ['Kapsoya', 'Kaptagat', 'Ainabkoi/Olare'],
      'Kapseret': ['Simat/Kapseret', 'Kipkenyo', 'Ngeria', 'Megun', 'Langas'],
      'Kesses': ['Racecourse', 'Cheptiret/Kipchamo', 'Tulwet/Chuiyat', 'Tarakwa'],
      'Moiben': ['Tembelio', 'Sergoit', 'Karuna/Meibeki', 'Moiben', 'Kipsebwo'],
      'Soy': ['Moi\'s Bridge', 'Kapkenda', 'Soy', 'Kuinet/Kapsuswa', 'Kipsebwo', 'Ziwa'],
      'Turbo': ['Ngenyilel', 'Tapsagoi', 'Kamagut', 'Kiplombe', 'Kapsaos', 'Huruma'],
    },
  },
  'Kajiado': {
    subCounties: ['Kajiado Central', 'Kajiado North', 'Kajiado South', 'Kajiado East', 'Kajiado West'],
    wards: {
      'Kajiado Central': ['Purko', 'Ildamat', 'Dalalekutuk', 'Matapato North', 'Matapato South'],
      'Kajiado North': ['Olkeri', 'Ongata Rongai', 'Nkaimurunya', 'Oloolua', 'Ngong'],
      'Kajiado South': ['Entonet/Lenkisim', 'Mbirikani/Eselenkei', 'Kuku', 'Rombo', 'Kimana'],
      'Kajiado East': ['Kaputiei North', 'Kitengela', 'Oloosirkon/Sholinke', 'Kenyawa-Poka', 'Imaroro'],
      'Kajiado West': ['Keekonyokie', 'Iloodokilani', 'Magadi', 'Ewuaso Oonkidong\'i', 'Mosiro'],
    },
  },
};

// Helper function to create a safe ward dictionary proxy
function createWardsProxy(knownWards: Record<string, string[]> = {}): Record<string, string[]> {
  return new Proxy(knownWards, {
    get(target, prop: string) {
      if (typeof prop === 'symbol' || prop === 'then' || prop === 'toJSON') return undefined;
      if (prop in target && target[prop]) {
        return target[prop];
      }
      if (!prop || prop === '' || prop === 'undefined') return [];
      // Dynamic fallback wards for any given subcounty name
      return [
        `${prop} Central`,
        `${prop} Township`,
        `${prop} North`,
        `${prop} South`,
        `${prop} East`,
        `${prop} West`,
      ];
    },
  });
}

// Helper to construct a full CountyDetails object
export function getCountyDetails(countyName: string): CountyDetails {
  if (!countyName) {
    return {
      name: '',
      subCounties: [],
      constituencies: [],
      wards: createWardsProxy({}),
    };
  }

  // Normalize name matching
  const cleaned = countyName.trim().replace(/\s*County$/i, '');
  const matchedKey = Object.keys(RAW_COUNTY_MAP).find(
    k => k.toLowerCase() === cleaned.toLowerCase() || k.toLowerCase().replace('-', ' ') === cleaned.toLowerCase().replace('-', ' ')
  );

  if (matchedKey && RAW_COUNTY_MAP[matchedKey]) {
    const raw = RAW_COUNTY_MAP[matchedKey];
    return {
      name: matchedKey,
      subCounties: raw.subCounties,
      constituencies: raw.subCounties,
      wards: createWardsProxy(raw.wards),
    };
  }

  // Default fallback sub-counties for any other Kenyan county
  const fallbackSubCounties = [
    `${cleaned} Central`,
    `${cleaned} North`,
    `${cleaned} South`,
    `${cleaned} East`,
    `${cleaned} West`,
    'Township',
  ];

  return {
    name: cleaned,
    subCounties: fallbackSubCounties,
    constituencies: fallbackSubCounties,
    wards: createWardsProxy({}),
  };
}

// Proxy wrapper so COUNTY_DATA[countyName] always returns valid CountyDetails
export const COUNTY_DATA: Record<string, CountyDetails> = new Proxy(
  {},
  {
    get(_target, prop: string) {
      if (typeof prop === 'symbol' || prop === 'then' || prop === 'toJSON') return undefined;
      return getCountyDetails(prop);
    },
  }
);

// Backward-compatible array of served counties
export const NEEMA_SERVED_COUNTIES = [
  { name: 'Nyeri', subCounties: RAW_COUNTY_MAP['Nyeri'].subCounties },
  { name: 'Kirinyaga', subCounties: RAW_COUNTY_MAP['Kirinyaga'].subCounties },
  { name: 'Murang\'a', subCounties: RAW_COUNTY_MAP['Murang\'a'].subCounties },
  { name: 'Kiambu', subCounties: RAW_COUNTY_MAP['Kiambu'].subCounties },
  { name: 'Meru', subCounties: RAW_COUNTY_MAP['Meru'].subCounties },
  { name: 'Embu', subCounties: RAW_COUNTY_MAP['Embu'].subCounties },
  { name: 'Laikipia', subCounties: RAW_COUNTY_MAP['Laikipia'].subCounties },
];
