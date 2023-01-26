import { FileDTO, ProjectCreateDTO, ProjectDTO, ProjectFilesDTO, ProjectsDTO, ProjectType } from "@blinkstick-editor/api-interfaces";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import * as transform from 'class-transformer';
import { mkdir, opendir, readFile, rename, writeFile } from "fs/promises";
import { transpile } from 'typescript';
import * as yaml from 'yaml';
import path = require("path");
class ProjectConfiguration {
  name: string;
  type: ProjectType;
}

@Injectable()
export class ProjectService {

  private readonly logger = new Logger(ProjectService.name);
  private readonly PROJECTS_DIR = "projects";

  public async getProjects(): Promise<ProjectsDTO> {
    try {
      const dir = await opendir(this.PROJECTS_DIR);
      const projects: ProjectDTO[] = [];
      for await (const entry of dir) {
        if (entry.isDirectory() && !entry.name.startsWith('_')) {
          try {
            projects.push(await this.readProject(entry.name));
          } catch (_) {
            console.log("nothing");
          }
        }
      }
      return new ProjectsDTO(projects);
    } catch(err) {
      if (err.code === 'ENOENT') {
        throw new NotFoundException();
      }
      throw err;
    }
  }

  public async getProject(id: string): Promise<ProjectDTO> {
    return this.readProject(id);
  }

  public async createOrUpdateProject(id: string, project: ProjectCreateDTO) {
    try {
      const existing = await this.readProject(id);
      const updated = {...existing, ...project};
      this.writeProject(id, updated);
    } catch (e) {
      console.log('Caught: ', e);
      if (e instanceof NotFoundException) {
        this.writeProject(id, project);
      }
    }
  }

  public async deleteProject(id: string) {
    rename(path.join(this.PROJECTS_DIR, id), path.join(this.PROJECTS_DIR, '_' + id));
  }

  public async getProjectFiles(id: string): Promise<ProjectFilesDTO> {
    return this.readProjectFiles(id);
  }

  public async setProjectFile(id: string, name: string, content: string): Promise<void> {
    await this.writeProjectFile(id, name, content);
  }

  public async runProject(id: string): Promise<void> {
    // const program = createProgram({rootNames: [`${this.PROJECTS_DIR}/id/main.ts`], options: {}});
    // program.emit();
    this.logger.log(`Running project ${id}`);
    const files = await this.getProjectFiles(id);
    const main = files.files.find((f) => f.name == 'main.ts');
    const code = "import {Farbe, FarbeHex, setzeFarbe} from 'blinkstick-ts/dist/de';\n\n" + main.data;
    this.logger.log(code);
    eval(transpile(code, {sourceRoot: '.', rootDir: `${this.PROJECTS_DIR}/${id}`, noLib: true}, main.name));
  }


  private async readProject(id: string): Promise<ProjectDTO> {
    try {
      const projectYaml = await readFile(path.join(this.PROJECTS_DIR, id, "project.yaml"));
      const projectPlain = yaml.parseDocument(projectYaml.toString(), {});
      const project = transform.plainToInstance(ProjectConfiguration, projectPlain.toJS());
      return new ProjectDTO(id, project.name, project.type);
    } catch (err) {
      throw new NotFoundException(err);
    }
  }

  private async writeProject(id: string, project: ProjectConfiguration): Promise<void> {
      this.writeProjectFile(id, "project.yaml", yaml.stringify(project));
  }

  private async readProjectFiles(id: string): Promise<ProjectFilesDTO> {
    const dir = await opendir(path.join(this.PROJECTS_DIR, id));
    const files: FileDTO[] = [];
    for await (const entry of dir) {
      if (entry.isFile()) {
        const content = await this.readProjectFile(id, entry.name);
        files.push(new FileDTO(entry.name, content));
      }
    }
    return new ProjectFilesDTO(files);
  }

  private async readProjectFile(id: string, name: string): Promise<string> {
    const buffer = await readFile(path.join(this.PROJECTS_DIR, id, name));
    return buffer.toString();
  }

  private async writeProjectFile(id: string, name: string, content: string) {

      await mkdir(path.join(this.PROJECTS_DIR, id), {recursive:true});
      await writeFile(path.join(this.PROJECTS_DIR, id, name), content);

  }
}
