import { FileContentDTO, ProjectCreateDTO, ProjectDTO, ProjectFilesDTO, ProjectsDTO } from '@blinkstick-editor/api-interfaces';
import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam } from "@nestjs/swagger";
import { ProjectService } from "./project.service";

@Controller('api/projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @ApiOperation({})
  @Get()
  public getProjects(): Promise<ProjectsDTO> {
    return this.projectService.getProjects();
  }

  @Get(':id')
  public getProject(@Param("id") id: string): Promise<ProjectDTO> {
    return this.projectService.getProject(id);
  }

  @ApiParam({name: "id", type: String})
  @ApiBody({type: ProjectCreateDTO})
  @Put(':id')
  public createOrUpdateProject(@Param("id") id: string, @Body() project: ProjectCreateDTO) {
    this.projectService.createOrUpdateProject(id, project);
  }

  @Delete(':id')
  public deleteProject(@Param("id") id: string) {
    this.projectService.deleteProject(id);
  }

  @Get(':id/files')
  public getFiles(@Param("id") id: string): Promise<ProjectFilesDTO> {
    return this.projectService.getProjectFiles(id);
  }

  @Put(':id/files/:name')
  public writeFile(@Param("id") id: string, @Param("name") name: string, @Body() content: FileContentDTO): Promise<void> {
    return this.projectService.setProjectFile(id, name, content.data);
  }

  @Post(':id/run')
  public runProject(@Param("id") id: string) {
    return this.projectService.runProject(id);
  }
}
