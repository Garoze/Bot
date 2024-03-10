type Option = {
  label: string;
  description?: string;
  value: string;
  emoji?: string;
};

export const getMapName = (value: string): string => {
  const toMapName: Record<string, string> = {
    'gas-station': 'Thank You, Come Again',
    streamer: '23 Megabytes A Second',
    'meth-house': 'Twisted Nerve',
    'talent-agency': 'The Spider',
    'aluminum-hat': 'A Lethal Obsession',
    veterans: 'Ides of March',
    midjot: 'Sinuous Trail',
    'beach-house': 'Ends of the Earth',
    postal: 'Greased Palms',
    'voll-house': 'Valley of the Dolls',
    columbine: 'Elephant',
    mexico: 'Rust Belt',
    hotel: 'Sins of the Father',
    ballad: 'Neon Tomb',
    dealership: 'Buy Cheap, Buy Twice',
    'feminist-cult': 'Carriers of the Vine',
    hospital: 'Relapse',
    port: 'Hide and Seek',
  };

  return toMapName[value];
};

export const maps: Option[] = [
  {
    label: 'Thank You, Come Again',
    description: '4U Gas Station - Barricaded suspects [Peso: 0.1]',
    value: 'gas-station',
  },
  {
    label: '23 Megabytes A Second',
    description: 'San Uriel Condominiums - Barricaded suspects [Peso: 0.25]',
    value: 'streamer',
  },
  {
    label: 'Twisted Nerve',
    description: '213 Park Homes - Barricaded suspects [Peso: 0.25]',
    value: 'meth-house',
  },
  {
    label: 'The Spider',
    description: 'Brixley Talent Time - Barricaded suspects [Peso: 0.5]',
    value: 'talent-agency',
  },
  {
    label: 'A Lethal Obsession',
    description: `Sullivan's Slope - Barricaded suspects [Peso: 0.25]`,
    value: 'aluminum-hat',
  },
  {
    label: 'Ides of March',
    description: 'Brisa Cove - Barricaded suspects [Peso: 0.5]',
    value: 'veterans',
  },
  {
    label: 'Sinuous Trail',
    description: 'Mindjot Data Center - Barricaded suspects [Peso: 0.75]',
    value: 'midjot',
  },
  {
    label: 'Ends of the Earth',
    description: 'Kawayu Beach - Barricaded suspects [Peso: 0.1]',
    value: 'beach-house',
  },
  {
    label: 'Greased Palms',
    description: 'Los Sueños Postal Service - Barricaded suspects [Peso: 1]',
    value: 'postal',
  },
  {
    label: 'Valley of the Dolls',
    description: 'Voll Health House - Barricaded suspects [Peso: 0.5]',
    value: 'voll-house',
  },
  {
    label: 'Elephant',
    description: 'Watt Community College - Barricaded suspects [Peso: 0.75]',
    value: 'columbine',
  },
  {
    label: 'Rust Belt',
    description: 'Costa Vino Border Reserve - Barricaded suspects [Peso: 0.5]',
    value: 'mexico',
  },
  {
    label: 'Sins of the Father',
    description: 'Clemente Hotel - Barricaded suspects [Peso: 0.75]',
    value: 'hotel',
  },
  {
    label: 'Neon Tomb',
    description: 'Neon Nightclub - Barricaded suspects [Peso: 1]',
    value: 'ballad',
  },
  {
    label: `Buy Cheap, Buy Twice`,
    description: `Caesar's Car Dealership - Barricaded suspects [Peso: 1]`,
    value: 'dealership',
  },
  {
    label: 'Carriers of the Vine',
    description: 'Cherryesa Farm - Barricaded suspects [Peso: 1]',
    value: 'feminist-cult',
  },
  {
    label: 'Relapse',
    description: 'Coastal Grove Medical Center - Barricaded suspects [Peso: 1]',
    value: 'hospital',
  },
  {
    label: 'Hide and Seek',
    description: 'Port Hokan - Barricaded suspects [Peso: 1]',
    value: 'port',
  },
];
