export interface Lesson {
  id: string;
  courseId: string;
  sequence: number;
  title: string;
  description: string;
  youtubeId: string;
  duration: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  thumbnail: string;
  instructor: string;
  level: string;
  category: string;
  lessons: Lesson[];
}
