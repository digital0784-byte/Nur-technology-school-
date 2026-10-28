import { GradeLevel, Language, CurriculumSubject } from '../types';
import { CURRICULUM_DATA, getCurriculumByGrade } from '../data/curriculum';

export class CurriculumRegistryEngine {
  static getSubjectsForGrade(grade: GradeLevel): CurriculumSubject[] {
    return getCurriculumByGrade(grade);
  }

  static findTopicById(topicId: string) {
    for (const sub of CURRICULUM_DATA) {
      for (const unit of sub.units) {
        for (const topic of unit.topics) {
          if (topic.id === topicId) {
            return { topic, unit, subject: sub };
          }
        }
      }
    }
    return null;
  }

  static getCompetenciesForGrade(grade: GradeLevel): string[] {
    const competencies: string[] = [];
    const subjects = getCurriculumByGrade(grade);
    for (const sub of subjects) {
      for (const unit of sub.units) {
        for (const topic of unit.topics) {
          competencies.push(...topic.competencyObjectives);
        }
      }
    }
    return competencies;
  }

  static calculateGradeCurriculumStats(grade: GradeLevel) {
    const subjects = getCurriculumByGrade(grade);
    let totalUnits = 0;
    let totalTopics = 0;
    let totalMinutes = 0;

    for (const s of subjects) {
      totalUnits += s.units.length;
      for (const u of s.units) {
        totalTopics += u.topics.length;
        for (const t of u.topics) {
          totalMinutes += t.estimatedStudyMinutes || 30;
        }
      }
    }

    return {
      subjectsCount: subjects.length,
      unitsCount: totalUnits,
      topicsCount: totalTopics,
      totalStudyHours: Math.round(totalMinutes / 60),
    };
  }
}
