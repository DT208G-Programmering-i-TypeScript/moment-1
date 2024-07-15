"use strict";
// definierar en klass för att hantera kursinformation
class CourseManager {
    constructor() {
        this.STORAGE_KEY = 'courses';
        this.courses = new Map();
        this.loadFromStorage();
    }
    // laddar kursinformation från localStorage
    loadFromStorage() {
        const storedCourses = localStorage.getItem(this.STORAGE_KEY);
        if (storedCourses) {
            const coursesArray = JSON.parse(storedCourses);
            coursesArray.forEach(course => {
                this.courses.set(course.code, course);
            });
        }
    }
    // sparar kursinformation till localStorage
    saveToStorage() {
        const coursesArray = Array.from(this.courses.values());
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(coursesArray));
    }
    // lägger till eller uppdaterar en kurs
    addOrUpdateCourse(course) {
        this.courses.set(course.code, course);
        this.saveToStorage();
        return true;
    }
    // hämtar en kurs baserat på kurskod
    getCourse(code) {
        return this.courses.get(code);
    }
    // hämtar alla kurser
    getAllCourses() {
        return Array.from(this.courses.values());
    }
}
// definierar en klass för att hantera användargränssnittet
class UIManager {
    constructor(courseManager) {
        this.courseManager = courseManager;
        // Vänta med att hämta DOM-element tills vi vet att de finns
        const form = document.getElementById('courseForm');
        const messageElement = document.getElementById('message');
        const courseListElement = document.getElementById('courseList');
        if (!form || !messageElement || !courseListElement) {
            throw new Error('Required DOM elements not found');
        }
        this.form = form;
        this.messageElement = messageElement;
        this.courseListElement = courseListElement;
        this.initializeEventListeners();
        this.updateCourseList();
    }
    // initierar eventlisteners för formulär och kurslistan
    initializeEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });
    }
    // hanterar formulärsubmittning
    handleFormSubmit() {
        const code = document.getElementById('code').value;
        const name = document.getElementById('name').value;
        const progression = document.getElementById('progression').value;
        const syllabus = document.getElementById('syllabus').value;
        const course = { code, name, progression, syllabus };
        try {
            this.courseManager.addOrUpdateCourse(course);
            this.showMessage('Kurs sparad!', 'success');
            this.updateCourseList();
            this.form.reset();
        }
        catch (error) {
            this.showMessage(error.message, 'error');
        }
    }
    // visar ett meddelande
    showMessage(message, type) {
        this.messageElement.textContent = message;
        this.messageElement.className = type;
        setTimeout(() => {
            this.messageElement.textContent = '';
            this.messageElement.className = '';
        }, 3000);
    }
    // uppdaterar kurslistan
    updateCourseList() {
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
}
// Global function för att redigera kurs
function editCourse(code) {
    const course = courseManager.getCourse(code);
    if (course) {
        document.getElementById('code').value = course.code;
        document.getElementById('name').value = course.name;
        document.getElementById('progression').value = course.progression;
        document.getElementById('syllabus').value = course.syllabus;
    }
}
// Initialisering
const courseManager = new CourseManager();
const uiManager = new UIManager(courseManager);
