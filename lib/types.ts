export interface Lesson {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  duration: string;
}

export interface Course {
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
