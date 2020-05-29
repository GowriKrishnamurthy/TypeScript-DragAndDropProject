import { Draggable } from '../models/drag-drop';
import { Project } from '../models/project';
import { Component } from './base-component';
import { AutoBind } from '../decorators/autobind';

export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement>
    implements Draggable {
    private project: Project;

    constructor(hostID: string, project: Project) {
        super('project-item', hostID, false, project.projectId);
        this.project = project;
        this.configure();
        this.renderContent();
    }

    @AutoBind
    dragStartHandler(event: DragEvent) {
        event.dataTransfer!.setData('text/plain', this.project.projectId);
        event.dataTransfer!.effectAllowed = 'move';
    }

    dragEndHandler(_: DragEvent) {
        console.log('DragEnd');
    }

    configure() {
        this.element.addEventListener('dragstart', this.dragStartHandler);
        this.element.addEventListener('dragend', this.dragEndHandler);
    }
    renderContent(): void {
        this.element.querySelector('h2')!.textContent = this.project.projectTitle;
        this.element.querySelector('h3')!.textContent = this.project.numberOfPeople.toString();
        this.element.querySelector('p')!.textContent = this.project.projectDescription;
    }
}
