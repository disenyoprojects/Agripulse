// Barangay lists for the BLISTT municipalities (Benguet + Baguio City).
// The agricultural municipalities are complete; Baguio City lists the most
// common barangays. A manual "type it in" fallback in the wizard covers any
// barangay not present here.

export const BARANGAY_MANUAL = '__manual__'

export const BARANGAYS: Record<string, string[]> = {
  'La Trinidad': [
    'Alapang', 'Alno', 'Ambiong', 'Bahong', 'Balili', 'Beckel', 'Betag',
    'Bineng', 'Cruz', 'Lubas', 'Pico', 'Poblacion', 'Puguis', 'Shilan',
    'Tawang', 'Wangal',
  ],
  Itogon: [
    'Ampucao', 'Dalupirip', 'Gumatdang', 'Loacan', 'Poblacion (Central)',
    'Tinongdan', 'Tuding', 'Ucab', 'Virac',
  ],
  Sablan: [
    'Bagong', 'Balluay', 'Banangan', 'Banengbeng', 'Bayabas', 'Kamog',
    'Pappa', 'Poblacion (Central)',
  ],
  Tuba: [
    'Ansagan', 'Camp One', 'Camp 3', 'Camp 4', 'Nangalisan',
    'Poblacion (Central)', 'San Pascual', 'Tabaan Norte', 'Tabaan Sur',
    'Tadiangan', 'Taloy Norte', 'Taloy Sur', 'Twin Peaks',
  ],
  Tublay: [
    'Ambassador', 'Ambongdolan', 'Ba-ayan', 'Basil', 'Caponga (Poblacion)',
    'Daclan', 'Tublay Central', 'Tuel',
  ],
  'Baguio City': [
    'Aurora Hill Proper', 'Aurora Hill North Central', 'Aurora Hill South Central',
    'Asin Road', 'Bakakeng Central', 'Bakakeng North', 'Balsigan',
    'Bayan Park East', 'Bayan Park Village', 'Bayan Park West', 'Brookside',
    'Cabinet Hill-Teachers Camp', 'Camp 7', 'Camp 8', 'Camp Allen',
    'Campo Filipino', 'City Camp Central', 'City Camp Proper', 'Country Club Village',
    'Cresencia Village', 'Dizon Subdivision', 'Dominican Hill-Mirador',
    'Engineers Hill', 'Fairview Village', 'Ferguson Road', 'Gibraltar',
    'Greenwater Village', 'Guisad Central', 'Guisad Sorong', 'Happy Hollow',
    'Happy Homes', 'Harrison-Claudio Carantes', 'Holy Ghost Extension',
    'Holy Ghost Proper', 'Imelda Village', 'Irisan', 'Kias', 'Loakan Proper',
    'Lopez Jaena', 'Lourdes Subdivision Proper', 'Lucnab', 'Magsaysay Private Road',
    'Malcolm Square-Perfecto', 'Manuel Roxas', 'Middle Quezon Hill', 'Military Cut-off',
    'Mines View Park', 'Outlook Drive', 'Pacdal', 'Padre Burgos', 'Padre Zamora',
    'Pinsao Pilot Project', 'Pinsao Proper', 'Poliwes', 'Pucsusan', 'Quezon Hill Proper',
    'Quirino Hill', 'Rock Quarry', 'Salud Mitra', 'San Antonio Village', 'San Luis Village',
    'San Roque Village', 'San Vicente', 'Santo Rosario', 'Santo Tomas Proper',
    'Scout Barrio', 'Session Road Area', 'Slaughter House Area', 'Teodora Alonzo',
    'Trancoville', 'Upper Quezon Hill', 'Victoria Village',
  ],
}
