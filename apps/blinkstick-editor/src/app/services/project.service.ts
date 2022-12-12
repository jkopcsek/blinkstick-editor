
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FileContentDTO, ProjectDTO, ProjectFilesDTO, ProjectsDTO, ProjectType } from '@blinkstick-editor/api-interfaces';
import { map, Observable } from 'rxjs';

@Injectable()
export class ProjectService {
  public constructor(private readonly http: HttpClient) {
  }

  public getProjects(): Observable<ProjectDTO[]> {
    return this.http.get<ProjectsDTO>("http://localhost:2001/api/projects/").pipe(map((p) => p.projects));
  }

  public getProject(id: string): Observable<ProjectDTO|undefined> {
    return this.http.get<ProjectDTO>(`http://localhost:2001/api/projects/${id}`);
  }

  public getProjectFiles(id: string): Observable<ProjectFilesDTO | undefined> {
    return this.http.get<ProjectFilesDTO>(`http://localhost:2001/api/projects/${id}/files`);
  }

  public createProject(id: string, name: string, type: ProjectType) {
    return this.http.put<void>(`http://localhost:2001/api/projects/${id}`, {name, type});
  }

  public updateProject(id: string, data: { name: string; }): Observable<void> {
    return this.http.put<void>(`http://localhost:2001/api/projects/${id}`, {name: data.name});
  }

  public deleteProject(id: string): Observable<void> {
    return this.http.delete<void>(`http://localhost:2001/api/projects/${id}`);
  }

  public putFileContent(id: string, name: string, content: FileContentDTO): Observable<void> {
    return this.http.put<void>(`http://localhost:2001/api/projects/${id}/files/${name}`, content);
  }

  public runProject(id: string): Observable<void> {
    return this.http.post<void>(`http://localhost:2001/api/projects/${id}/run`, {});
  }

}
