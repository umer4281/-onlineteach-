import type { Course, Lesson, Resource } from "./types";
import { supabasePublic, isSupabaseConfigured } from "./supabase";

interface CourseRow {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  thumbnail: string;
  instructor: string;
  level: string;
  category: string;
  lessons?: LessonRow[];
}

interface LessonRow {
  id: string;
  course_id: string;
  sequence: number;
  title: string;
  description: string;
  meet_url: string;
  duration: string;
  resources?: ResourceRow[];
}

interface ResourceRow {
  id: string;
  lesson_id: string;
  sequence: number;
  title: string;
  type: string;
  file_path: string;
  likes: number;
}

function mapResource(row: ResourceRow): Resource {
  return {
    id: row.id,
    lessonId: row.lesson_id,
    sequence: row.sequence,
    title: row.title,
    type: row.type,
    filePath: row.file_path,
    likes: row.likes,
  };
}

function mapLesson(row: LessonRow): Lesson {
  return {
    id: row.id,
    courseId: row.course_id,
    sequence: row.sequence,
    title: row.title,
    description: row.description,
    meetUrl: row.meet_url,
    duration: row.duration,
    resources: (row.resources ?? [])
      .slice()
      .sort((a, b) => a.sequence - b.sequence)
      .map(mapResource),
  };
}

function mapCourse(row: CourseRow): Course {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    tagline: row.tagline,
    description: row.description,
    thumbnail: row.thumbnail || "/images/smart-logo.jpg",
    instructor: row.instructor,
    level: row.level,
    category: row.category,
    lessons: (row.lessons ?? [])
      .slice()
      .sort((a, b) => a.sequence - b.sequence)
      .map(mapLesson),
  };
}

/** All courses with their lessons and resources, live from the database. */
export async function getCourses(): Promise<Course[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabasePublic!
    .from("courses")
    .select("*, lessons(*, resources(*))")
    .order("created_at", { ascending: true });
  if (error) return [];
  return (data ?? []).map(mapCourse);
}

/** A single course by slug, or undefined. */
export async function getCourse(slug: string): Promise<Course | undefined> {
  if (!isSupabaseConfigured) return undefined;
  const { data, error } = await supabasePublic!
    .from("courses")
    .select("*, lessons(*, resources(*))")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return undefined;
  return mapCourse(data as CourseRow);
}

/** Course + lesson lookup used by the lesson player page. */
export async function getCourseByLesson(
  courseSlug: string,
  lessonId: string
): Promise<{ course: Course; lesson: Lesson; index: number } | undefined> {
  const course = await getCourse(courseSlug);
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

