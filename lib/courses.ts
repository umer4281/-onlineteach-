import type { Course, Lesson } from "./types";
import coursesData from "../content/courses.json";

export const courses: Course[] = coursesData as Course[];

export function getCourse(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}

export function getCourseByLesson(
  courseSlug: string,
  lessonId: string
): { course: Course; lesson: Lesson; index: number } | undefined {
  const course = getCourse(courseSlug);
  if (!course) return undefined;
  const index = course.lessons.findIndex((l) => l.id === lessonId);
  if (index === -1) return undefined;
  return { course, lesson: course.lessons[index], index };
}

export function pluralize(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

export function initial(name: string): string {
  return name.trim().charAt(0).toUpperCase();
}
