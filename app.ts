//Project type
enum ProjectStatus {
    Active,
    Finished
}

class Project {
    constructor(
        public projectId: string,
        public projectTitle: string,
        public projectDescription: string,
        public numberOfPeople: number,
        public projectStatus: ProjectStatus) { }
}
//Project state management
type Subscribers = (items: Project[]) => void;

class ProjectState {

    private projects: Project[] = [];
    private subscribers: Subscribers[] = [];
    private static projectStateInstance: ProjectState;

    private constructor() { }

    addSubscribers(subscriberFunction: Subscribers) {
        this.subscribers.push(subscriberFunction);
    }
    // Only one instance of project state class maintained
    static getProjectStateInstance() {
        if (this.projectStateInstance)
            return this.projectStateInstance;
        else
            return new ProjectState();
    }

    addProject(projectTitle: string, projectDescription: string, numberOfPeople: number) {
        const newproject = new Project(
            Math.random().toString(),
            projectTitle,
            projectDescription,
            numberOfPeople,
            ProjectStatus.Active);

        this.projects.push(newproject);

        // Loop through all subscribers
        this.subscribers.forEach(subscriberFunction => {
            subscriberFunction(this.projects.slice());
        });
    }
}
// Singleton object - global state management object
const projectState = ProjectState.getProjectStateInstance();

interface IValidatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

function validate(validatableInput: IValidatable) {
    let isValid = true;

    if (validatableInput.required) {
        isValid =
            isValid && (validatableInput.value.toString().length !== 0)
    }

    // min length makes sense only for string input
    if (validatableInput.minLength != null && typeof validatableInput.value === 'string') {
        isValid =
            isValid && (validatableInput.value.length >= validatableInput.minLength)
    }

    // max length makes sense only for string input
    if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
        isValid =
            isValid && (validatableInput.value.length <= validatableInput.maxLength)
    }

    // min  makes sense only for number input
    if (validatableInput.min != null && typeof validatableInput.value === 'number') {
        isValid =
            isValid && (validatableInput.value >= validatableInput.min)
    }

    // max  makes sense only for number input
    if (validatableInput.max != null && typeof validatableInput.value === 'number') {
        isValid =
            isValid && (validatableInput.value <= validatableInput.max)
    }
    return isValid;
}

// AutoBind decorator
function AutoBind(
    _: any,
    _2: string,
    descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
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
    templateElement: HTMLTemplateElement; //template
    hostElement: HTMLDivElement; //div
    element: HTMLElement; //section element
    assignedProjects: Project[] = [];
    constructor(private type: 'active' | 'finished') {
        this.templateElement = document.getElementById('project-list')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;

        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild! as HTMLElement;
        this.element.id = `${this.type}-projects`;

        projectState.addSubscribers((projects: Project[]) => {
            const relevantProjects = projects.filter(proj => {
                if (this.type === 'active')
                    return proj.projectStatus === ProjectStatus.Active;
                else
                    return proj.projectStatus === ProjectStatus.Finished;
            });
            this.assignedProjects = relevantProjects;
            this.renderAllProjects();
        });

        //Attach element
        this.hostElement.insertAdjacentElement('beforeend', this.element);
        this.renderContent();
    }

    private renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
    }
    private renderAllProjects() {
        const listProjectListElement = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
        //Avoiding project duplication, render always from the scratch
        listProjectListElement.innerHTML = '';
        this.assignedProjects.forEach(project => {
            const listItem = document.createElement('li');
            listItem.textContent = project.projectTitle;
            listProjectListElement.appendChild(listItem);
        });
    }
}
class NewProjectInput {
    templateElement: HTMLTemplateElement; //template
    hostElement: HTMLDivElement; //div
    element: HTMLFormElement; //form

    //Input Controls on the form 
    projectTitleInputElement: HTMLInputElement;
    projectDescriptionInputElement: HTMLInputElement;
    numberOfPeopleInputElement: HTMLInputElement;

    constructor() {
        this.templateElement = document.getElementById('new-project')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;

        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild! as HTMLFormElement;
        this.element.id = "user-input";

        //Input Controls on the form    
        this.projectTitleInputElement = this.element.querySelector('#projectTitle') as HTMLInputElement;
        this.projectDescriptionInputElement = this.element.querySelector('#projectDescription') as HTMLInputElement;
        this.numberOfPeopleInputElement = this.element.querySelector('#numberOfPeople') as HTMLInputElement;

        //Add submit event handler ot form
        this.element.addEventListener('submit', this.submitEventHandler.bind(this));

        //Attach element
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }
    private getUserInputs(): [string, string, number] | void {
        const projectTitleInputValue = this.projectTitleInputElement.value;
        const projectDescriptionInputValue = this.projectDescriptionInputElement.value;
        const numberOfPeopleInputValue = this.numberOfPeopleInputElement.value;

        const projectTitleValidate: IValidatable = {
            value: projectTitleInputValue,
            required: true
        };
        const projectDescriptionValidate: IValidatable = {
            value: projectDescriptionInputValue,
            required: true,
            minLength: 5
        };
        const numberOfPeopleValidate: IValidatable = {
            value: + numberOfPeopleInputValue,
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
            return [projectTitleInputValue, projectDescriptionInputValue, + numberOfPeopleInputValue];
        }
    }

    //Clear input field values
    private clearInputs() {
        this.projectTitleInputElement.value = '';
        this.projectDescriptionInputElement.value = '';
        this.numberOfPeopleInputElement.value = '';
    }

    @AutoBind
    private submitEventHandler(event: Event) {

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

const newprojectInput = new NewProjectInput();
const activeProjectList = new ProjectList('active');
const finishedProjectList = new ProjectList('finished'); 
