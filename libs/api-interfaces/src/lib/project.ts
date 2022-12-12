

export enum ProjectType {
  Blockly = 'Blockly',
  TypeScript = 'TypeScript'
}

export class ProjectsDTO {
  constructor(public readonly projects: ProjectDTO[]) { };
}

export class ProjectDTO {
  public readonly id: string;
  public readonly name: string;
  public readonly type: ProjectType;

  constructor(id: string, name: string, type: ProjectType) {
    this.id = id;
    this.name = name;
    this.type = type;
  }
}

export class ProjectCreateDTO {
  public readonly name: string;
  public readonly type: ProjectType;

  constructor(name: string, type: ProjectType) {
    this.name = name;
    this.type = type;
  }
}

export class ProjectFilesDTO {
  constructor(public readonly files: FileDTO[]) { };
}

export class FileDTO {
  constructor(public readonly name: string, public readonly data: string) { };
}

export class FileContentDTO {
  constructor(public readonly data: string) { };
}
