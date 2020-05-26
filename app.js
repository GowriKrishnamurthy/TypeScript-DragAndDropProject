var ProjectInput = /** @class */ (function () {
    function ProjectInput() {
        this.templateElement = document.getElementById('project-input');
        this.hostElement = document.getElementById('app');
        var importedNode = document.importNode(this.templateElement.content, true);
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
    ProjectInput.prototype.submitEventHandler = function (event) {
        //prevent the default form submission
        event.preventDefault();
        console.log(this.titleInputElement.value);
    };
    return ProjectInput;
}());
var projInput = new ProjectInput();
