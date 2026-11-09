import { CurriculumSubject, CurriculumUnit, CurriculumTopic, GradeLevel } from '../types';

// Source: tables of contents of the MoE textbooks (Grade 10-12). Titles and page numbers come from the books.
// summary / content / competencyObjectives are empty on purpose: lessons are generated on demand (see /api/ai/lesson).
// estimatedStudyMinutes is a placeholder (30). Subject names in om/ti/so/ar are working translations.
// Row format: [number, title, fromPage, toPage]  (null = not available in the contents page)

type SectionRow = [string, string, number | null, number | null];
type UnitRow = [number, string, number | null, number | null, SectionRow[]];

const pageRef = (book: string, from: number | null, to: number | null): string => {
  if (from === null) return book;
  if (to === null) return `${book}, from p. ${from}`;
  return to === from ? `${book}, p. ${from}` : `${book}, pp. ${from}-${to}`;
};

export function buildSubject(
  id: string,
  code: string,
  grade: GradeLevel,
  icon: string,
  color: string,
  book: string,
  name: CurriculumSubject['name'],
  unitRows: UnitRow[]
): CurriculumSubject {
  const units = unitRows.map(([unitNumber, title, from, to, sections]): CurriculumUnit => ({
    id: `${id}-u${unitNumber}`,
    unitNumber,
    title,
    description:
      from === null
        ? `Unit ${unitNumber}`
        : to === null
        ? `Unit ${unitNumber} (starts p. ${from})`
        : `Unit ${unitNumber} (pp. ${from}-${to})`,
    topics: sections.map(
      ([number, sTitle, sFrom, sTo]): CurriculumTopic => ({
        id: `${id}-${number}`,
        title: `${number} ${sTitle}`,
        competencyObjectives: [],
        summary: '',
        content: '',
        estimatedStudyMinutes: 30,
        pageReference: pageRef(book, sFrom, sTo),
      })
    ),
  }));
  return { id, code, grade, icon, color, name, units } as CurriculumSubject;
}
