"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function validate(validatableInput) {
    let isValid = true;
    if (validatableInput.required) {
        isValid =
            isValid && (validatableInput.value.toString().trim.length !== 0);
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
        this.templateElement = document.getElementById('project-list');
        this.hostElement = document.getElementById('app');
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        this.element.id = `${this.type}-projects`;
        //Attach element
        this.hostElement.insertAdjacentElement('beforeend', this.element);
        this.renderContent();
    }
    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul').id = listId;
        this.element.querySelector('h2').textContent = this.type.toUpperCase() + ' PROJECTS';
    }
}
class ProjectInput {
    constructor() {
        this.templateElement = document.getElementById('project-input');
        this.hostElement = document.getElementById('app');
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        this.element.id = "user-input";
        //Input Controls on the form    
        this.titleInputElement = this.element.querySelector('#title');
        this.descriptionInputElement = this.element.querySelector('#description');
        this.peopleInputElement = this.element.querySelector('#people');
        //Add submit event handler ot form
        this.element.addEventListener('submit', this.submitEventHandler.bind(this));
        //Attach element
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }
    getUserInputs() {
        const titleInputValue = this.titleInputElement.value;
        const descriptionInputValue = this.descriptionInputElement.value;
        const peopleInputValue = this.peopleInputElement.value;
        const titleValidate = {
            value: titleInputValue,
            required: true
        };
        const descriptionValidate = {
            value: descriptionInputValue,
            required: true,
            minLength: 5
        };
        const peopleValidate = {
            value: +peopleInputValue,
            required: true,
            min: 1,
            max: 5
        };
        //If any of the values is not entered correctly
        if (!validate(titleValidate) ||
            !validate(descriptionValidate) ||
            !validate(peopleValidate)) {
            alert('Invalid input, please try again');
            return;
        }
        else {
            return [titleInputValue, descriptionInputValue, +peopleInputValue];
        }
    }
    //Clear input field values
    clearInputs() {
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.peopleInputElement.value = '';
    }
    submitEventHandler(event) {
        //prevent the default form submsion
        event.preventDefault();
        const userInputs = this.getUserInputs();
        if (Array.isArray(userInputs)) {
            const [title, description, people] = userInputs;
            console.log(title, description, people);
        }
        //Clear the input fields after the form is submitted
        this.clearInputs();
    }
}
__decorate([
    AutoBind
], ProjectInput.prototype, "submitEventHandler", null);
const projectInput = new ProjectInput();
const activeProjectList = new ProjectList('active');
const finishedProjectList = new ProjectList('finished');
