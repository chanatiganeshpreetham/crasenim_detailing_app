export const products = [
  {
    id: 'crasenim-pharma',
    name: 'Crasenim Pharma',
    image: require('../../assets/crasenim-logo.jpeg'),
  },
  {
    id: 'crasenim',
    name: 'Crasenim',
    image: require('../../assets/meds/Crasenim.jpg'),
  },
  {
    id: 'amoxsenim',
    name: 'Amoxsenim',
    image: require('../../assets/meds/Amoxsenim.jpg'),
  },
  {
    id: 'babybar',
    name: 'Babybar',
    image: require('../../assets/meds/Babybar.jpg'),
  },
  {
    id: 'metsenim',
    name: 'Metsenim',
    image: require('../../assets/meds/Metsenim.jpg'),
  },
  {
    id: 'pansenim',
    name: 'Pansenim',
    image: require('../../assets/meds/Pansenim.jpg'),
  },
  {
    id: 'telsenim',
    name: 'Telsenim',
    image: require('../../assets/meds/Telsenim.jpg'),
  },
  {
    id: 'vimily',
    name: 'Vimily',
    image: require('../../assets/meds/Vimily.jpg'),
  },
] as const;

export type ProductId = (typeof products)[number]['id'];

export const specialties = [
  {
    id: 'gp',
    name: 'GP (General Practitioner)',
    shortName: 'GP',
    productIds: [
      'crasenim-pharma',
      'amoxsenim',
      'crasenim',
      'vimily',
      'pansenim',
      'telsenim',
      'metsenim',
    ],
  },
  {
    id: 'mbbs',
    name: 'M.B.B.S.',
    shortName: 'M.B.B.S.',
    productIds: [
      'crasenim-pharma',
      'telsenim',
      'metsenim',
      'crasenim',
      'amoxsenim',
      'pansenim',
      'vimily',
    ],
  },
  {
    id: 'gynae',
    name: 'Gynae',
    shortName: 'Gynae',
    productIds: [
      'crasenim-pharma',
      'crasenim',
      'vimily',
      'amoxsenim',
      'pansenim',
      'telsenim',
    ],
  },
  {
    id: 'md-physician',
    name: 'MD (Physician)',
    shortName: 'MD',
    productIds: [
      'crasenim-pharma',
      'telsenim',
      'metsenim',
      'crasenim',
      'amoxsenim',
      'pansenim',
      'vimily',
    ],
  },
  {
    id: 'pedia',
    name: 'Pedia',
    shortName: 'Pedia',
    productIds: ['crasenim-pharma', 'crasenim', 'babybar'],
  },
  {
    id: 'cardio',
    name: 'Cardio',
    shortName: 'Cardio',
    productIds: ['crasenim-pharma', 'telsenim', 'crasenim', 'metsenim'],
  },
  {
    id: 'diabetic',
    name: 'Diabetic',
    shortName: 'Diabetic',
    productIds: ['crasenim-pharma', 'metsenim', 'crasenim', 'telsenim'],
  },
  {
    id: 'surgeon',
    name: 'Surgeon',
    shortName: 'Surgeon',
    productIds: ['crasenim-pharma', 'amoxsenim', 'crasenim', 'pansenim'],
  },
  {
    id: 'endocrinologist',
    name: 'Endocrinologist',
    shortName: 'Endocrinologist',
    productIds: [
      'crasenim-pharma',
      'telsenim',
      'metsenim',
      'crasenim',
      'amoxsenim',
      'pansenim',
    ],
  },
  {
    id: 'gastro',
    name: 'Gastro',
    shortName: 'Gastro',
    productIds: ['crasenim-pharma', 'crasenim', 'pansenim', 'amoxsenim'],
  },
  {
    id: 'ent',
    name: 'ENT',
    shortName: 'ENT',
    productIds: ['crasenim-pharma', 'amoxsenim', 'pansenim', 'crasenim'],
  },
  {
    id: 'ortho',
    name: 'Ortho',
    shortName: 'Ortho',
    productIds: [
      'crasenim-pharma',
      'crasenim',
      'amoxsenim',
      'pansenim',
      'vimily',
    ],
  },
  {
    id: 'dentist',
    name: 'Dentist',
    shortName: 'Dentist',
    productIds: ['crasenim-pharma', 'amoxsenim', 'pansenim'],
  },
  {
    id: 'derma',
    name: 'Derma',
    shortName: 'Derma',
    productIds: [
      'crasenim-pharma',
      'amoxsenim',
      'crasenim',
      'babybar',
      'pansenim',
    ],
  },
  {
    id: 'optha',
    name: 'Optha',
    shortName: 'Optha',
    productIds: [
      'crasenim-pharma',
      'crasenim',
      'amoxsenim',
      'pansenim',
      'vimily',
    ],
  },
  {
    id: 'pulmonologist',
    name: 'Pulmonologist',
    shortName: 'Pulmonologist',
    productIds: [
      'crasenim-pharma',
      'amoxsenim',
      'telsenim',
      'crasenim',
      'pansenim',
    ],
  },
  {
    id: 'urologist',
    name: 'Urologist',
    shortName: 'Urologist',
    productIds: [
      'crasenim-pharma',
      'crasenim',
      'telsenim',
      'amoxsenim',
      'pansenim',
    ],
  },
  {
    id: 'neuro',
    name: 'Neuro',
    shortName: 'Neuro',
    productIds: ['crasenim-pharma', 'crasenim', 'pansenim'],
  },
] as const satisfies ReadonlyArray<{
  id: string;
  name: string;
  shortName: string;
  productIds: readonly ['crasenim-pharma', ...ProductId[]];
}>;
