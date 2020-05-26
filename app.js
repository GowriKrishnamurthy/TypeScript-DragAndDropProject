"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
        //If the values are not entered
        if (titleInputValue.trim().length === 0 ||
            descriptionInputValue.trim().length === 0 ||
            peopleInputValue.trim().length === 0) {
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
const projInput = new ProjectInput();
