import { SchoolRecord } from '../types';

export const INITIAL_RECORDS: SchoolRecord[] = [
  // Wakiso District - Mathematics
  { id: 'w-m-1', school: 'Nabweru Primary', district: 'Wakiso', subject: 'Mathematics', required: 5, available: 3, km: 6, studentCount: 420, coordinates: { x: 38, y: 32 } },
  { id: 'w-m-2', school: 'Kawanda Primary', district: 'Wakiso', subject: 'Mathematics', required: 4, available: 6, km: 12, studentCount: 390, coordinates: { x: 34, y: 22 } },
  { id: 'w-m-3', school: 'Kira Community School', district: 'Wakiso', subject: 'Mathematics', required: 5, available: 4, km: 18, studentCount: 460, coordinates: { x: 48, y: 35 } },
  { id: 'w-m-4', school: 'Entebbe Demonstration', district: 'Wakiso', subject: 'Mathematics', required: 6, available: 4, km: 28, studentCount: 510, coordinates: { x: 42, y: 55 } },
  
  // Wakiso District - English
  { id: 'w-e-1', school: 'Kasangati Primary', district: 'Wakiso', subject: 'English', required: 4, available: 2, km: 8, studentCount: 380, coordinates: { x: 44, y: 25 } },
  { id: 'w-e-2', school: 'Namugongo Primary', district: 'Wakiso', subject: 'English', required: 5, available: 6, km: 9, studentCount: 470, coordinates: { x: 46, y: 30 } },
  { id: 'w-e-3', school: 'Bweyogerere Primary', district: 'Wakiso', subject: 'English', required: 4, available: 4, km: 16, studentCount: 410, coordinates: { x: 50, y: 38 } },
  { id: 'w-e-4', school: 'Nansana Public School', district: 'Wakiso', subject: 'English', required: 5, available: 3, km: 11, studentCount: 490, coordinates: { x: 36, y: 34 } },

  // Wakiso District - Science
  { id: 'w-s-1', school: 'Nabweru Primary', district: 'Wakiso', subject: 'Science', required: 4, available: 2, km: 6, studentCount: 420, coordinates: { x: 38, y: 32 } },
  { id: 'w-s-2', school: 'Kawanda Primary', district: 'Wakiso', subject: 'Science', required: 4, available: 5, km: 12, studentCount: 390, coordinates: { x: 34, y: 22 } },
  { id: 'w-s-3', school: 'Namugongo Primary', district: 'Wakiso', subject: 'Science', required: 4, available: 3, km: 9, studentCount: 470, coordinates: { x: 46, y: 30 } },

  // Mpigi District - Mathematics
  { id: 'm-m-1', school: 'Mpigi Central Primary', district: 'Mpigi', subject: 'Mathematics', required: 4, available: 2, km: 4, studentCount: 360, coordinates: { x: 22, y: 62 } },
  { id: 'm-m-2', school: 'Buwama Primary', district: 'Mpigi', subject: 'Mathematics', required: 3, available: 5, km: 21, studentCount: 310, coordinates: { x: 14, y: 74 } },
  { id: 'm-m-3', school: 'Muduuma Primary', district: 'Mpigi', subject: 'Mathematics', required: 4, available: 3, km: 14, studentCount: 350, coordinates: { x: 20, y: 52 } },
  { id: 'm-m-4', school: 'Kayabwe Model School', district: 'Mpigi', subject: 'Mathematics', required: 3, available: 4, km: 26, studentCount: 290, coordinates: { x: 12, y: 82 } },

  // Mpigi District - English
  { id: 'm-e-1', school: 'Mpigi Central Primary', district: 'Mpigi', subject: 'English', required: 4, available: 3, km: 4, studentCount: 360, coordinates: { x: 22, y: 62 } },
  { id: 'm-e-2', school: 'Buwama Primary', district: 'Mpigi', subject: 'English', required: 3, available: 4, km: 21, studentCount: 310, coordinates: { x: 14, y: 74 } },
  { id: 'm-e-3', school: 'Muduuma Primary', district: 'Mpigi', subject: 'English', required: 4, available: 5, km: 14, studentCount: 350, coordinates: { x: 20, y: 52 } },

  // Mpigi District - Social Studies
  { id: 'm-ss-1', school: 'Mpigi Central Primary', district: 'Mpigi', subject: 'Social Studies', required: 3, available: 2, km: 4, studentCount: 360, coordinates: { x: 22, y: 62 } },
  { id: 'm-ss-2', school: 'Buwama Primary', district: 'Mpigi', subject: 'Social Studies', required: 3, available: 3, km: 21, studentCount: 310, coordinates: { x: 14, y: 74 } },

  // Mukono District - Science
  { id: 'mu-s-1', school: 'Mukono Town Primary', district: 'Mukono', subject: 'Science', required: 5, available: 3, km: 5, studentCount: 520, coordinates: { x: 72, y: 36 } },
  { id: 'mu-s-2', school: 'Seeta Primary', district: 'Mukono', subject: 'Science', required: 4, available: 6, km: 11, studentCount: 430, coordinates: { x: 62, y: 32 } },
  { id: 'mu-s-3', school: 'Nakisunga Primary', district: 'Mukono', subject: 'Science', required: 4, available: 3, km: 24, studentCount: 370, coordinates: { x: 80, y: 46 } },
  { id: 'mu-s-4', school: 'Kyetume Memorial', district: 'Mukono', subject: 'Science', required: 3, available: 4, km: 15, studentCount: 340, coordinates: { x: 76, y: 30 } },

  // Mukono District - English
  { id: 'mu-e-1', school: 'Mukono Town Primary', district: 'Mukono', subject: 'English', required: 5, available: 4, km: 5, studentCount: 520, coordinates: { x: 72, y: 36 } },
  { id: 'mu-e-2', school: 'Seeta Primary', district: 'Mukono', subject: 'English', required: 4, available: 3, km: 11, studentCount: 430, coordinates: { x: 62, y: 32 } },
  { id: 'mu-e-3', school: 'Nakisunga Primary', district: 'Mukono', subject: 'English', required: 4, available: 5, km: 24, studentCount: 370, coordinates: { x: 80, y: 46 } },

  // Mukono District - Mathematics
  { id: 'mu-m-1', school: 'Mukono Town Primary', district: 'Mukono', subject: 'Mathematics', required: 5, available: 3, km: 5, studentCount: 520, coordinates: { x: 72, y: 36 } },
  { id: 'mu-m-2', school: 'Seeta Primary', district: 'Mukono', subject: 'Mathematics', required: 4, available: 5, km: 11, studentCount: 430, coordinates: { x: 62, y: 32 } },
  { id: 'mu-m-3', school: 'Kyetume Memorial', district: 'Mukono', subject: 'Mathematics', required: 4, available: 2, km: 15, studentCount: 340, coordinates: { x: 76, y: 30 } },

  // Luweero District - Mathematics & Science
  { id: 'lu-m-1', school: 'Wobulenzi Public', district: 'Luweero', subject: 'Mathematics', required: 4, available: 2, km: 12, studentCount: 410, coordinates: { x: 45, y: 12 } },
  { id: 'lu-m-2', school: 'Luweero Boys Primary', district: 'Luweero', subject: 'Mathematics', required: 4, available: 5, km: 8, studentCount: 430, coordinates: { x: 48, y: 8 } },
  { id: 'lu-s-1', school: 'Wobulenzi Public', district: 'Luweero', subject: 'Science', required: 4, available: 3, km: 12, studentCount: 410, coordinates: { x: 45, y: 12 } },
  { id: 'lu-s-2', school: 'Luweero Boys Primary', district: 'Luweero', subject: 'Science', required: 3, available: 4, km: 8, studentCount: 430, coordinates: { x: 48, y: 8 } },
  { id: 'lu-e-1', school: 'Bombo Common Ground', district: 'Luweero', subject: 'English', required: 5, available: 3, km: 20, studentCount: 480, coordinates: { x: 42, y: 18 } },
  { id: 'lu-e-2', school: 'Luweero Boys Primary', district: 'Luweero', subject: 'English', required: 4, available: 4, km: 8, studentCount: 430, coordinates: { x: 48, y: 8 } }
];

export const DISTRICT_METADATA: Record<string, { centerName: string; region: string; targetRatio: number }> = {
  Wakiso: { centerName: 'Wakiso Headquarters', region: 'Central Buganda', targetRatio: 1.0 },
  Mpigi: { centerName: 'Mpigi Boma Ground', region: 'South Central', targetRatio: 1.0 },
  Mukono: { centerName: 'Mukono Municipal Council', region: 'East Central', targetRatio: 1.0 },
  Luweero: { centerName: 'Luweero District Complex', region: 'North Central', targetRatio: 1.0 },
};
