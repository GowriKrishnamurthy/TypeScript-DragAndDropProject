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
  
class ProjectInput{
    templateElement: HTMLTemplateElement; //template
    hostElement:HTMLDivElement; //div
    element:HTMLFormElement; //form

    //Input Controls on the form 
    titleInputElement:HTMLInputElement;
    descriptionInputElement:HTMLInputElement;
    peopleInputElement:HTMLInputElement;

    constructor(){
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;

        const importedNode = document.importNode(this.templateElement.content, true);        
        this.element = importedNode.firstElementChild! as HTMLFormElement;
        this.element.id="user-input";

        //Input Controls on the form    
        this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;

        //Add submit event handler ot form
        this.element.addEventListener('submit',this.submitEventHandler.bind(this));

        //Attach element
        this.hostElement.insertAdjacentElement('afterbegin',this.element);
    }
    @AutoBind
    private submitEventHandler(event:Event)
    {
        //prevent the default form submission
        event.preventDefault();    
        console.log(this.titleInputElement.value) ;
    }
}
const projInput = new ProjectInput();