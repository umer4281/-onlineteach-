export interface Resource {
  id: string;
  lessonId: string;
  sequence: number;
  title: string;
  type: string; // pdf | image | video | audio | file
  filePath: string;
  likes: number;
}

export interface Lesson {
  id: string;
  courseId: string;
  sequence: number;
  title: string;
  description: string;
  meetUrl: string;
  duration: string;
  resources: Resource[];
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
