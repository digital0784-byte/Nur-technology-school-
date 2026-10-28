import { GradeLevel } from '../types';
import { CURRICULUM_DATA } from '../data/curriculum';

export interface SearchRecommendationResult {
  title: string;
  subject: string;
  grade: GradeLevel;
  unit: string;
  summary: string;
  pageRef: string;
  relevanceScore: number;
}

export class SearchRecommendationEngine {
  static searchLocal(query: string, grade?: GradeLevel): SearchRecommendationResult[] {
    if (!query.trim()) return [];
    const normalized = query.toLowerCase();
    const results: SearchRecommendationResult[] = [];

    const targetSubjects = grade ? CURRICULUM_DATA.filter((s) => s.grade === grade) : CURRICULUM_DATA;

    for (const sub of targetSubjects) {
      for (const unit of sub.units) {
        for (const topic of unit.topics) {
          let score = 0;
          if (topic.title.toLowerCase().includes(normalized)) score += 5;
          if (topic.summary.toLowerCase().includes(normalized)) score += 3;
          if (topic.competencyObjectives.some((c) => c.toLowerCase().includes(normalized))) score += 4;
          if (topic.ethiopianExample?.toLowerCase().includes(normalized)) score += 2;

          if (score > 0) {
            results.push({
              title: topic.title,
              subject: sub.name.en,
              grade: sub.grade,
              unit: unit.title,
              summary: topic.summary,
              pageRef: topic.pageReference,
              relevanceScore: score,
            });
          }
        }
      }
    }

    return results.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 5);
  }

  static getRecommendedTopicsForStudent(completedTopicIds: string[], grade: GradeLevel) {
    const subjects = CURRICULUM_DATA.filter((s) => s.grade === grade);
    const uncompleted: Array<{ title: string; subject: string; unit: string; minutes: number }> = [];

    for (const s of subjects) {
      for (const u of s.units) {
        for (const t of u.topics) {
          if (!completedTopicIds.includes(t.id)) {
            uncompleted.push({
              title: t.title,
              subject: s.name.en,
              unit: u.title,
              minutes: t.estimatedStudyMinutes,
            });
          }
        }
      }
    }

    return uncompleted.slice(0, 4);
  }
}
