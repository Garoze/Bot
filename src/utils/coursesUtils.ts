type Option = {
  label: string;
  description?: string;
  value: string;
  emoji?: string;
};

export const getCourseName = (value: string): string => {
  const toCourseName: Record<string, string> = {
    '1159899636044144710': 'Disciplinar',
    '1159899891443695686': 'Movimento',
    '1164423835383251059': 'Liderança',
    '1162837149595475988': 'Modulação',
    '1164423832610799626': 'Asseguramento',
    '1171280756232953957': 'Pistolas',
    '1171280463453769788': 'Fuzil-médio',
    '1171280470454059008': 'Escopetas',
    '1171280467044077661': 'Sub-metralhadoras',
    '1171284647322320986': 'Recursos-Humanos',
    '1171284717836976191': 'Orientação',
    '1162837253219950722': 'Tiro 1.0',
    '1204146112584486982': 'Tiro 2.0',
    '1176875517752909824': 'Fatiamento 1.0',
    '1176877809038278757': 'Fatiamento 2.0',
    '1113630247477313596': 'Granada 1.0',
    '1176881097347453018': 'Granada 2.0',
    '1164423830442364928': 'Não-letais 1.0',
    '1176881196450451538': 'Não-letais 2.0',
    '1194282112547835927': 'Escudo 1.0',
    '1194282232131616848': 'Escudo 2.0',
  };

  return toCourseName[value];
};

export const courses: Option[] = [
  { label: 'Disciplinar', value: '1159899636044144710', emoji: '✅' },
  { label: 'Movimento', value: '1159899891443695686', emoji: '✅' },
  { label: 'Liderança', value: '1164423835383251059', emoji: '✅' },
  { label: 'Modulação', value: '1162837149595475988', emoji: '✅' },
  { label: 'Asseguramento', value: '1164423832610799626', emoji: '✅' },
  { label: 'Pistolas', value: '1171280756232953957', emoji: '✅' },
  { label: 'Fuzil-médio', value: '1171280463453769788', emoji: '✅' },
  { label: 'Escopetas', value: '1171280470454059008', emoji: '✅' },
  { label: 'Sub-metralhadoras', value: '1171280467044077661', emoji: '✅' },
  { label: 'Recursos-Humanos', value: '1171284647322320986', emoji: '✅' },
  { label: 'Orientação', value: '1171284717836976191', emoji: '✅' },
  { label: 'Tiro 1.0', value: '1162837253219950722', emoji: '✅' },
  { label: 'Tiro 2.0', value: '1204146112584486982', emoji: '✅' },
  { label: 'Fatiamento 1.0', value: '1176875517752909824', emoji: '✅' },
  { label: 'Fatiamento 2.0', value: '1176877809038278757', emoji: '✅' },
  { label: 'Granada 1.0', value: '1113630247477313596', emoji: '✅' },
  { label: 'Granada 2.0', value: '1176881097347453018', emoji: '✅' },
  { label: 'Não-letais 1.0', value: '1164423830442364928', emoji: '✅' },
  { label: 'Não-letais 2.0', value: '1176881196450451538', emoji: '✅' },
  { label: 'Escudo 1.0', value: '1194282112547835927', emoji: '✅' },
  { label: 'Escudo 2.0', value: '1194282232131616848', emoji: '✅' },
];
