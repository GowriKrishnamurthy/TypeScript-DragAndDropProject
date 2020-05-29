//Project state management
namespace App
{    
    type Subscribers = (items: Project[]) => void;

    export class ProjectState {

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
            this.updateSubscribers();
        }

        moveProject(projectID: string, newProjectStatus: ProjectStatus) {
            const selectedProject = this.projects.find(proj => proj.projectId === projectID);

            if (selectedProject && selectedProject.projectStatus !== newProjectStatus) {
                selectedProject.projectStatus = newProjectStatus;
                this.updateSubscribers();
            }
        }

        private updateSubscribers() {
            // Loop through all subscribers
            this.subscribers.forEach(subscriberFunction => {
                subscriberFunction(this.projects.slice());
            });
        }
    }
    // Singleton object - global state management object
    export const projectState = ProjectState.getProjectStateInstance();

}