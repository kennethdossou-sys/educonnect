import { Injectable } from '@angular/core';
import { getDatabase, ref, get, set,remove } from 'firebase/database';
import { Course, Chapitre } from '../../shared/models/course.model';
import { getApp } from 'firebase/app';
@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private db = getDatabase();

  private parseCourse(data: any, id: string): Course {
    return {
      ...data,
      id,
      chapitres: data.chapitres
        ? Object.values(data.chapitres) as Chapitre[]
        : []
    };
  }

async getCoursesByTeacher(uid: string): Promise<Course[]> {
  const db = getDatabase(getApp());
  const snapshot = await get(ref(db, 'courses'));
  if (!snapshot.exists()) return [];
  const data = snapshot.val();
  return Object.entries(data)
    .map(([id, val]) => this.parseCourse(val, id))
    .filter(c => c.enseignantId === uid || c.enseignant === uid);
}

  async getCourseById(id: string): Promise<Course | null> {
    const snapshot = await get(ref(this.db, `courses/${id}`));
    if (!snapshot.exists()) return null;
    return this.parseCourse(snapshot.val(), id);
  }

  async getAllCourses(): Promise<Course[]> {
    const snapshot = await get(ref(this.db, 'courses'));
    if (!snapshot.exists()) return [];
    const data = snapshot.val();
    return Object.entries(data)
      .map(([id, val]) => this.parseCourse(val, id));
  }

  async createCourse(course: Course): Promise<void> {
    await set(ref(this.db, `courses/${course.id}`), course);
  }

  async deleteCourse(courseId: string): Promise<void> {
  const db = getDatabase(getApp());
  await remove(ref(db, `courses/${courseId}`))
  }
  
}