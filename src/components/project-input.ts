import { Component } from './base-component';
import * as Validation from '../util/validation';
import { AutoBind } from '../decorators/autobind';
import { projectState } from '../state/project-state';

export class NewProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
    //Input Controls on the form 
    projectTitleInputElement: HTMLInputElement;
    projectDescriptionInputElement: HTMLInputElement;
    numberOfPeopleInputElement: HTMLInputElement;

    constructor() {
        super('new-project', 'app', true, 'user-input');

        //Input Controls on the form    
        this.projectTitleInputElement = this.element.querySelector('#projectTitle') as HTMLInputElement;
        this.projectDescriptionInputElement = this.element.querySelector('#projectDescription') as HTMLInputElement;
        this.numberOfPeopleInputElement = this.element.querySelector('#numberOfPeople') as HTMLInputElement;

        this.configure();
    }

    configure(): void {
        //Add submit event handler ot form
        this.element.addEventListener('submit', this.submitEventHandler.bind(this));
    }
    renderContent(): void { }

    private getUserInputs(): [string, string, number] | void {
        const projectTitleInputValue = this.projectTitleInputElement.value;
        const projectDescriptionInputValue = this.projectDescriptionInputElement.value;
        const numberOfPeopleInputValue = this.numberOfPeopleInputElement.value;

        const projectTitleValidate: Validation.IValidatable = {
            value: projectTitleInputValue,
            required: true
        };
        const projectDescriptionValidate: Validation.IValidatable = {
            value: projectDescriptionInputValue,
            required: true,
            minLength: 5
        };
        const numberOfPeopleValidate: Validation.IValidatable = {
            value: + numberOfPeopleInputValue,
            required: true,
            min: 1,
            max: 100

        };
        //If any of the values is not entered correctly
        if (!Validation.validate(projectTitleValidate) || 
            !Validation.validate(projectDescriptionValidate) || 
            !Validation.validate(numberOfPeopleValidate)) {
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