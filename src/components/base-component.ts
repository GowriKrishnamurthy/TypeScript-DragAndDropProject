 //Generic Component base class
 namespace App{
    export abstract class Component<T extends HTMLElement, U extends HTMLElement>
    {
        templateElement: HTMLTemplateElement; //template
        hostElement: T;
        element: U;
        constructor(
            templateElementID: string,
            hostElementID: string,
            insertAtStart: boolean,
            newElementID?: string | undefined) {
            this.templateElement = document.getElementById(templateElementID)! as HTMLTemplateElement;
            this.hostElement = document.getElementById(hostElementID)! as T;

            const importedNode = document.importNode(this.templateElement.content, true);
            this.element = importedNode.firstElementChild! as U;

            if (newElementID)
                this.element.id = newElementID;

            this.attachElement(insertAtStart);
        }
        private attachElement(insertAtStart: boolean) {
            //Attach element
            this.hostElement.insertAdjacentElement(insertAtStart ? 'afterbegin' : 'beforeend',
                this.element);
        }
        abstract configure(): void;
        abstract renderContent(): void;
    }
 }