namespace App
{
    //Project type
    export enum ProjectStatus {
        Active,
        Finished
    }

    export class Project {
        constructor(
            public projectId: string,
            public projectTitle: string,
            public projectDescription: string,
            public numberOfPeople: number,
            public projectStatus: ProjectStatus) { }
    }
}