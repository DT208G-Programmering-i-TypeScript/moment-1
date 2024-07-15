// definierar en interface för kursinformation
interface CourseInfo {
    code: string;
    name: string;
    progression: 'A' | 'B' | 'C';
    syllabus: string;
}

// definierar en klass för att hantera kursinformation
class CourseManager {
    private courses: Map<string, CourseInfo>;
    private readonly STORAGE_KEY: string = 'courses';

    constructor() {
        this.courses = new Map<string, CourseInfo>();
        this.loadFromStorage();
    }

    // laddar kursinformation från localStorage
    private loadFromStorage(): void {
        const storedCourses = localStorage.getItem(this.STORAGE_KEY);
        if (storedCourses) {
            const coursesArray: CourseInfo[] = JSON.parse(storedCourses);
            coursesArray.forEach(course => {
                this.courses.set(course.code, course);
            });
        }
    }

    // sparar kursinformation till localStorage
    private saveToStorage(): void {
        const coursesArray = Array.from(this.courses.values());
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(coursesArray));
    }

    // lägger till eller uppdaterar en kurs
    public addOrUpdateCourse(course: CourseInfo): boolean {
        this.courses.set(course.code, course);
        this.saveToStorage();
        return true;
    }

    // hämtar en kurs baserat på kurskod
    public getCourse(code: string): CourseInfo | undefined {
        return this.courses.get(code);
    }

    // hämtar alla kurser
    public getAllCourses(): CourseInfo[] {
        return Array.from(this.courses.values());
    }
}


// Initialisering
const courseManager = new CourseManager();
