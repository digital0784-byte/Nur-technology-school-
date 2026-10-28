import { Language } from '../types';
import { CURRICULUM_AM } from './curriculum_am';
import { CURRICULUM_OM } from './curriculum_om';
import { CURRICULUM_TI } from './curriculum_ti';
import { CURRICULUM_AR } from './curriculum_ar';
import { CURRICULUM_SO } from './curriculum_so';
import { CURRICULUM_EN } from './curriculum_en';

export const CURRICULUM_REGISTRY: Record<Language, any[]> = {
  am: CURRICULUM_AM,
  om: CURRICULUM_OM,
  ti: CURRICULUM_TI,
  ar: CURRICULUM_AR,
  so: CURRICULUM_SO,
  en: CURRICULUM_EN,
};

export function getCurriculum(lang: Language = 'am') {
  return CURRICULUM_REGISTRY[lang] || CURRICULUM_AM;
}
