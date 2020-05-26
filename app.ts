

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
            isValid && (validatableInput.value.toString().trim.length !== 0)
    }

    // min length makes sense only for string input
    if (validatableInput.minLength != null
        && typeof validatableInput.value === 'string') {
        isValid =
            isValid && (validatableInput.value.length >= validatableInput.minLength)
    }

    // max length makes sense only for string input
    if (validatableInput.maxLength != null
        && typeof validatableInput.value === 'string') {
        isValid =
            isValid && (validatableInput.value.length <= validatableInput.maxLength)
    }

    // min  makes sense only for number input
    if (validatableInput.min != null
        && typeof validatableInput.value === 'number') {
        isValid =
            isValid && (validatableInput.value >= validatableInput.min)
    }

    // max  makes sense only for number input
    if (validatableInput.max != null
        && typeof validatableInput.value === 'number') {
        isValid =
            isValid && (validatableInput.value <= validatableInput.max)
    }
    return isValid;
}

// AutoBind decorator
function AutoBind(
    _: any,
    _2: string,
    descriptor: PropertyDescriptor
) {
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
class ProjectList{    
    templateElement: HTMLTemplateElement; //template
    hostElement: HTMLDivElement; //div
    element: HTMLElement; //section element

    constructor(private type:'active'|'finished'){
        this.templateElement = document.getElementById('project-list')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;

        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild! as HTMLElement;
        this.element.id =`${this.type}-projects`;

        //Attach element
        this.hostElement.insertAdjacentElement('beforeend', this.element);
        this.renderContent();
    }

    private renderContent(){
        const listId=`${this.type}-projects-list`; 
        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
    }
}
class ProjectInput {
    templateElement: HTMLTemplateElement; //template
    hostElement: HTMLDivElement; //div
    element: HTMLFormElement; //form

    //Input Controls on the form 
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;

        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild! as HTMLFormElement;
        this.element.id = "user-input";

        //Input Controls on the form    
        this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;

        //Add submit event handler ot form
        this.element.addEventListener('submit', this.submitEventHandler.bind(this));

        //Attach element
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }
    private getUserInputs(): [string, string, number] | void {
        const titleInputValue = this.titleInputElement.value;
        const descriptionInputValue = this.descriptionInputElement.value;
        const peopleInputValue = this.peopleInputElement.value;

        const titleValidate:IValidatable = {
            value: titleInputValue,
            required:true
        };
        const descriptionValidate:IValidatable = {
            value: descriptionInputValue,
            required:true,
            minLength:5
        };
        const peopleValidate:IValidatable = {
            value: +peopleInputValue,
            required:true,
            min:1,
            max:5

        };
        //If any of the values is not entered correctly
        if (
            !validate(titleValidate) ||
            !validate(descriptionValidate) ||
            !validate(peopleValidate)
            ) {
                alert('Invalid input, please try again');     
                return ;           
            }
            else {
                return [titleInputValue, descriptionInputValue, +peopleInputValue];            
            }
    }

    //Clear input field values
    private clearInputs(){
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.peopleInputElement.value = '';
    }

    @AutoBind
    private submitEventHandler(event: Event) {
        
        //prevent the default form submsion
        event.preventDefault();
        const userInputs = this.getUserInputs();

        if(Array.isArray(userInputs))
        {
            const [title, description, people] = userInputs;
            console.log(title, description, people);
        }
        //Clear the input fields after the form is submitted
        this.clearInputs();
    }
}

const projectInput = new ProjectInput();
const activeProjectList = new ProjectList('active');
const finishedProjectList = new ProjectList('finished');
