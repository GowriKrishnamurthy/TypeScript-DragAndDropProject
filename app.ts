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

        //If the values are not entered
        if (titleInputValue.trim().length === 0 ||
            descriptionInputValue.trim().length === 0 ||
            peopleInputValue.trim().length === 0) {
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
const projInput = new ProjectInput();