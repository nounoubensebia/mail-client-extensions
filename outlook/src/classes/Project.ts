export default class Project {
    id: number;
    name: string;

    static fromJson(o: Object): Project {
        let project = new Project();
        project.id = o['project_id'];
        project.name = o['name'];
        return project;
    }

}
