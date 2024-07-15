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

    // tar bort en kurs
    public deleteCourse(code: string): void {
        this.courses.delete(code);
        this.saveToStorage();
    }
}

// definierar en klass för att hantera användargränssnittet
class UIManager {
    private courseManager: CourseManager;
    private form: HTMLFormElement;
    private messageElement: HTMLDivElement;
    private courseListElement: HTMLDivElement;
    // Skiljer på om vi är i edit-läge eller inte
    private isEditing: boolean = false;
    private currentEditCode: string = '';

    constructor(courseManager: CourseManager) {
        this.courseManager = courseManager;
        
        // Vänta med att hämta DOM-element tills vi vet att de finns
        const form = document.getElementById('courseForm');
        const messageElement = document.getElementById('message');
        const courseListElement = document.getElementById('courseList');

        if (!form || !messageElement || !courseListElement) {
            throw new Error('Required DOM elements not found');
        }

        this.form = form as HTMLFormElement;
        this.messageElement = messageElement as HTMLDivElement;
        this.courseListElement = courseListElement as HTMLDivElement;
        
        this.initializeEventListeners();
        this.updateCourseList();
    }

    // initierar eventlisteners för formulär och kurslistan
    private initializeEventListeners(): void {
        this.form.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.handleFormSubmit();
        });
    }

    // hanterar formulärsubmittning
    private handleFormSubmit(): void {
        const code = (document.getElementById('code') as HTMLInputElement).value;
        const name = (document.getElementById('name') as HTMLInputElement).value;
        const progression = (document.getElementById('progression') as HTMLSelectElement).value as 'A' | 'B' | 'C';
        const syllabus = (document.getElementById('syllabus') as HTMLInputElement).value;

        const course: CourseInfo = { code, name, progression, syllabus };

        try {
            if (this.isEditing) {
                // Ta bort den gamla kursen om kurskoden har ändrats
                if (this.currentEditCode !== code) {
                    this.courseManager.deleteCourse(this.currentEditCode);
                }
            }
            
            this.courseManager.addOrUpdateCourse(course);
            this.showMessage('Kurs sparad!', 'success');
            this.updateCourseList();
            this.form.reset();
            // ser till att vi inte är i edit-läge
            this.isEditing = false;
            this.currentEditCode = '';
        } catch (error) {
            this.showMessage((error as Error).message, 'error');
        }
    }

    // visar ett meddelande
    private showMessage(message: string, type: 'success' | 'error'): void {
        this.messageElement.textContent = message;
        this.messageElement.className = type;
        setTimeout(() => {
            this.messageElement.textContent = '';
            this.messageElement.className = '';
        }, 3000);
    }

    // uppdaterar kurslistan
    private updateCourseList(): void {
        this.courseListElement.innerHTML = '';
        const courses = this.courseManager.getAllCourses();

        courses.forEach(course => {
            const courseElement = document.createElement('div');
            courseElement.className = 'course-card';
            courseElement.innerHTML = `
                <h3>${course.code} - ${course.name}</h3>
                <p><strong>Progression:</strong> ${course.progression}</p>
                <p><strong>Kursplan:</strong> <a href="${course.syllabus}" target="_blank">Öppna kursplan</a></p>
                <button onclick="editCourse('${course.code}')">Redigera</button>
            `;
            this.courseListElement.appendChild(courseElement);
        });
    }

    // startar redigering av en kurs
    public startEditing(code: string): void {
        this.isEditing = true;
        this.currentEditCode = code;
    }
}

// Global function för att redigera kurs
function editCourse(code: string): void {
    const course = courseManager.getCourse(code);
    if (course && uiManager) {
        // startar edit-läge
        uiManager.startEditing(code);
        // sätter värdena i formuläret
        (document.getElementById('code') as HTMLInputElement).value = course.code;
        (document.getElementById('name') as HTMLInputElement).value = course.name;
        (document.getElementById('progression') as HTMLSelectElement).value = course.progression;
        (document.getElementById('syllabus') as HTMLInputElement).value = course.syllabus;
    }
}

// Initialisering
const courseManager = new CourseManager();
const uiManager = new UIManager(courseManager);
