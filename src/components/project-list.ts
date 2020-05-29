namespace App
{ 
     //Project list class
     export class ProjectList extends Component<HTMLDivElement, HTMLElement>
     implements DragTarget {
     assignedProjects: Project[] = [];
     constructor(private type: 'active' | 'finished') {
         //beforeend - false
         super('project-list', 'app', false, `${type}-projects`);
         this.configure();
         this.renderContent();
     }

     @AutoBind
     dragOverHandler(event: DragEvent): void {
         if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
             event.preventDefault();
             const listEl = this.element.querySelector('ul');
             if (listEl)
                 listEl.classList.add('droppable');
         }
     }
     @AutoBind
     dropHandler(event: DragEvent): void {
         const projectId = event.dataTransfer!.getData('text/plain');
         projectState.moveProject(projectId,
             this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished);
     }

     @AutoBind
     dragLeaveHandler(event: DragEvent): void {
         const listEl = this.element.querySelector('ul');
         if (listEl)
         {
             listEl.classList.remove('droppable');
             console.log(event);
         }
     }

     configure(): void {
         this.element.addEventListener('dragover', this.dragOverHandler);
         this.element.addEventListener('drop', this.dropHandler);
         this.element.addEventListener('dragleave', this.dragLeaveHandler);

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
     }

     renderContent() {
         const listId = `${this.type}-projects-list`;
         this.element.querySelector('ul')!.id = listId;
         this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
     }
     private renderAllProjects() {
         const listProjectListElement = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
         //Avoiding project duplication, render always from the scratch
         listProjectListElement.innerHTML = '';
         this.assignedProjects.forEach(project => {
             new ProjectItem(this.element.querySelector('ul')!.id, project);
         });
     }
 }
}