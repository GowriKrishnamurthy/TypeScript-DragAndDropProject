"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
//Project state management
class ProjectState {
    constructor() {
        this.projects = [];
        this.subscribers = [];
    }
    addSubscribers(subscriberFunction) {
        this.subscribers.push(subscriberFunction);
    }
    // Only one instance of project state class maintained
    static getProjectStateInstance() {
        if (this.projectStateInstance)
            return this.projectStateInstance;
        else
            return new ProjectState();
    }
    addProject(title, description, numberOfPeople) {
        const newproject = {
            id: Math.random().toString(),
            title: title,
            description: description,
            numberOfPeople: numberOfPeople
        };
        this.projects.push(newproject);
        // Loop through all subscribers
        this.subscribers.forEach(subscriberFunction => {
            subscriberFunction(this.projects.slice());
        });
    }
}
// Singleton object - global state management object
const projectState = ProjectState.getProjectStateInstance();
function validate(validatableInput) {
    let isValid = true;
    if (validatableInput.required) {
        isValid =
            isValid && (validatableInput.value.toString().length !== 0);
    }
    // min length makes sense only for string input
    if (validatableInput.minLength != null
        && typeof validatableInput.value === 'string') {
        isValid =
            isValid && (validatableInput.value.length >= validatableInput.minLength);
    }
    // max length makes sense only for string input
    if (validatableInput.maxLength != null
        && typeof validatableInput.value === 'string') {
        isValid =
            isValid && (validatableInput.value.length <= validatableInput.maxLength);
    }
    // min  makes sense only for number input
    if (validatableInput.min != null
        && typeof validatableInput.value === 'number') {
        isValid =
            isValid && (validatableInput.value >= validatableInput.min);
    }
    // max  makes sense only for number input
    if (validatableInput.max != null
        && typeof validatableInput.value === 'number') {
        isValid =
            isValid && (validatableInput.value <= validatableInput.max);
    }
    return isValid;
}
// AutoBind decorator
function AutoBind(_, _2, descriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        }
    };
    return adjDescriptor;
}
//Project list class
class ProjectList {
    constructor(type) {
        this.type = type;
        this.assignedProjects = [];
        this.templateElement = document.getElementById('project-list');
        this.hostElement = document.getElementById('app');
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        this.element.id = `${this.type}-projects`;
        projectState.addSubscribers((projects) => {
            this.assignedProjects = projects;
            this.renderAllProjects();
        });
        //Attach element
        this.hostElement.insertAdjacentElement('beforeend', this.element);
        this.renderContent();
    }
    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul').id = listId;
        this.element.querySelector('h2').textContent = this.type.toUpperCase() + ' PROJECTS';
    }
    renderAllProjects() {
        const listProjectListElement = document.getElementById(`${this.type}-projects-list`);
        this.assignedProjects.forEach(project => {
            const listItem = document.createElement('li');
            listItem.textContent = project.title;
            listProjectListElement.appendChild(listItem);
        });
    }
}
class NewProjectInput {
    constructor() {
        this.templateElement = document.getElementById('new-project');
        this.hostElement = document.getElementById('app');
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        this.element.id = "user-input";
        //Input Controls on the form    
        this.projectTitleInputElement = this.element.querySelector('#projectTitle');
        this.projectDescriptionInputElement = this.element.querySelector('#projectDescription');
        this.numberOfPeopleInputElement = this.element.querySelector('#numberOfPeople');
        //Add submit event handler ot form
        this.element.addEventListener('submit', this.submitEventHandler.bind(this));
        //Attach element
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }
    getUserInputs() {
        const projectTitleInputValue = this.projectTitleInputElement.value;
        const projectDescriptionInputValue = this.projectDescriptionInputElement.value;
        const numberOfPeopleInputValue = this.numberOfPeopleInputElement.value;
        const projectTitleValidate = {
            value: projectTitleInputValue,
            required: true
        };
        const projectDescriptionValidate = {
            value: projectDescriptionInputValue,
            required: true,
            minLength: 5
        };
        const numberOfPeopleValidate = {
            value: +numberOfPeopleInputValue,
            required: true,
            min: 1,
            max: 100
        };
        //If any of the values is not entered correctly
        if (!validate(projectTitleValidate) ||
            !validate(projectDescriptionValidate) ||
            !validate(numberOfPeopleValidate)) {
            alert('Invalid input, please try again');
            return;
        }
        else {
            return [projectTitleInputValue, projectDescriptionInputValue, +numberOfPeopleInputValue];
        }
    }
    //Clear input field values
    clearInputs() {
        this.projectTitleInputElement.value = '';
        this.projectDescriptionInputElement.value = '';
        this.numberOfPeopleInputElement.value = '';
    }
    submitEventHandler(event) {
        //prevent the default form submsion
        event.preventDefault();
        const userInputs = this.getUserInputs();
        if (Array.isArray(userInputs)) {
            const [projectTitle, projectDescription, numberOfPeople] = userInputs;
            //Add new project to global project state manager
            projectState.addProject(projectTitle, projectDescription, numberOfPeople);
            console.log(projectTitle, projectDescription, numberOfPeople);
        }
        //Clear the input fields after the form is submitted
        this.clearInputs();
    }
}
__decorate([
    AutoBind
], NewProjectInput.prototype, "submitEventHandler", null);
const newprojectInput = new NewProjectInput();
const activeProjectList = new ProjectList('active');
const finishedProjectList = new ProjectList('finished');
