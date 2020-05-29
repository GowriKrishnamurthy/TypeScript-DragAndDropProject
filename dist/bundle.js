"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var App;
(function (App) {
    /// < reference path="drag-drop-interfaces.ts/>
    //Project type
    let ProjectStatus;
    (function (ProjectStatus) {
        ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
        ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
    })(ProjectStatus = App.ProjectStatus || (App.ProjectStatus = {}));
    class Project {
        constructor(projectId, projectTitle, projectDescription, numberOfPeople, projectStatus) {
            this.projectId = projectId;
            this.projectTitle = projectTitle;
            this.projectDescription = projectDescription;
            this.numberOfPeople = numberOfPeople;
            this.projectStatus = projectStatus;
        }
    }
    App.Project = Project;
})(App || (App = {}));
///<reference path="drag-drop-interfaces.ts"/>
/// <reference path="project-model.ts"/>
var App;
(function (App) {
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
        addProject(projectTitle, projectDescription, numberOfPeople) {
            const newproject = new App.Project(Math.random().toString(), projectTitle, projectDescription, numberOfPeople, App.ProjectStatus.Active);
            this.projects.push(newproject);
            this.updateSubscribers();
        }
        moveProject(projectID, newProjectStatus) {
            const selectedProject = this.projects.find(proj => proj.projectId === projectID);
            if (selectedProject && selectedProject.projectStatus !== newProjectStatus) {
                selectedProject.projectStatus = newProjectStatus;
                this.updateSubscribers();
            }
        }
        updateSubscribers() {
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
        if (validatableInput.minLength != null && typeof validatableInput.value === 'string') {
            isValid =
                isValid && (validatableInput.value.length >= validatableInput.minLength);
        }
        // max length makes sense only for string input
        if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
            isValid =
                isValid && (validatableInput.value.length <= validatableInput.maxLength);
        }
        // min  makes sense only for number input
        if (validatableInput.min != null && typeof validatableInput.value === 'number') {
            isValid =
                isValid && (validatableInput.value >= validatableInput.min);
        }
        // max  makes sense only for number input
        if (validatableInput.max != null && typeof validatableInput.value === 'number') {
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
    //Generic Component base class
    class Component {
        constructor(templateElementID, hostElementID, insertAtStart, newElementID) {
            this.templateElement = document.getElementById(templateElementID);
            this.hostElement = document.getElementById(hostElementID);
            const importedNode = document.importNode(this.templateElement.content, true);
            this.element = importedNode.firstElementChild;
            if (newElementID)
                this.element.id = newElementID;
            this.attachElement(insertAtStart);
        }
        attachElement(insertAtStart) {
            //Attach element
            this.hostElement.insertAdjacentElement(insertAtStart ? 'afterbegin' : 'beforeend', this.element);
        }
    }
    class ProjectItem extends Component {
        constructor(hostID, project) {
            super('project-item', hostID, false, project.projectId);
            this.project = project;
            this.configure();
            this.renderContent();
        }
        dragStartHandler(event) {
            event.dataTransfer.setData('text/plain', this.project.projectId);
            event.dataTransfer.effectAllowed = 'move';
        }
        dragEndHandler(_) {
            console.log('DragEnd');
        }
        configure() {
            this.element.addEventListener('dragstart', this.dragStartHandler);
            this.element.addEventListener('dragend', this.dragEndHandler);
        }
        renderContent() {
            this.element.querySelector('h2').textContent = this.project.projectTitle;
            this.element.querySelector('h3').textContent = this.project.numberOfPeople.toString();
            this.element.querySelector('p').textContent = this.project.projectDescription;
        }
    }
    __decorate([
        AutoBind
    ], ProjectItem.prototype, "dragStartHandler", null);
    //Project list class
    class ProjectList extends Component {
        constructor(type) {
            //beforeend - false
            super('project-list', 'app', false, `${type}-projects`);
            this.type = type;
            this.assignedProjects = [];
            this.configure();
            this.renderContent();
        }
        dragOverHandler(event) {
            if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
                event.preventDefault();
                const listEl = this.element.querySelector('ul');
                if (listEl)
                    listEl.classList.add('droppable');
            }
        }
        dropHandler(event) {
            const projectId = event.dataTransfer.getData('text/plain');
            projectState.moveProject(projectId, this.type === 'active' ? App.ProjectStatus.Active : App.ProjectStatus.Finished);
        }
        dragLeaveHandler(event) {
            const listEl = this.element.querySelector('ul');
            if (listEl) {
                listEl.classList.remove('droppable');
                console.log(event);
            }
        }
        configure() {
            this.element.addEventListener('dragover', this.dragOverHandler);
            this.element.addEventListener('drop', this.dropHandler);
            this.element.addEventListener('dragleave', this.dragLeaveHandler);
            projectState.addSubscribers((projects) => {
                const relevantProjects = projects.filter(proj => {
                    if (this.type === 'active')
                        return proj.projectStatus === App.ProjectStatus.Active;
                    else
                        return proj.projectStatus === App.ProjectStatus.Finished;
                });
                this.assignedProjects = relevantProjects;
                this.renderAllProjects();
            });
        }
        renderContent() {
            const listId = `${this.type}-projects-list`;
            this.element.querySelector('ul').id = listId;
            this.element.querySelector('h2').textContent = this.type.toUpperCase() + ' PROJECTS';
        }
        renderAllProjects() {
            const listProjectListElement = document.getElementById(`${this.type}-projects-list`);
            //Avoiding project duplication, render always from the scratch
            listProjectListElement.innerHTML = '';
            this.assignedProjects.forEach(project => {
                new ProjectItem(this.element.querySelector('ul').id, project);
            });
        }
    }
    __decorate([
        AutoBind
    ], ProjectList.prototype, "dragOverHandler", null);
    __decorate([
        AutoBind
    ], ProjectList.prototype, "dropHandler", null);
    __decorate([
        AutoBind
    ], ProjectList.prototype, "dragLeaveHandler", null);
    class NewProjectInput extends Component {
        constructor() {
            super('new-project', 'app', true, 'user-input');
            //Input Controls on the form    
            this.projectTitleInputElement = this.element.querySelector('#projectTitle');
            this.projectDescriptionInputElement = this.element.querySelector('#projectDescription');
            this.numberOfPeopleInputElement = this.element.querySelector('#numberOfPeople');
            this.configure();
        }
        configure() {
            //Add submit event handler ot form
            this.element.addEventListener('submit', this.submitEventHandler.bind(this));
        }
        renderContent() { }
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
            if (!validate(projectTitleValidate) || !validate(projectDescriptionValidate) || !validate(numberOfPeopleValidate)) {
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
    new NewProjectInput();
    new ProjectList('active');
    new ProjectList('finished');
})(App || (App = {}));
