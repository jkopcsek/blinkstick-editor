import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FileContentDTO, ProjectDTO, ProjectFilesDTO, ProjectType } from '@blinkstick-editor/api-interfaces';
import { serialization } from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';
import { ConfirmationService } from 'primeng/api';
import { debounceTime, lastValueFrom, Subject } from 'rxjs';
import { BlockEditorComponent } from '../block-editor/block-editor.component';
import { CodeEditorComponent } from '../code-editor/code-editor.component';
import { ProjectService } from '../services/project.service';
import { WebSocketService } from '../services/websocket.service';

@Component({
  selector: 'blinkstick-editor-main.page',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  @ViewChild("codeEditor")
  public codeEditor?: CodeEditorComponent;

  @ViewChild("blockEditor")
  public blockEditor?: BlockEditorComponent;

  public projects?: ProjectDTO[]

  public project?: ProjectDTO;
  public files?: ProjectFilesDTO;
  public runInProgress = false;

  private codeEditorChanged = new Subject();
  private blockEditorChanged = new Subject();

  constructor(
    private readonly webSocketService: WebSocketService,
    private readonly projectService: ProjectService,
    private readonly confirmationService: ConfirmationService,
    private readonly router: Router,
    private readonly route: ActivatedRoute) {
  }

  public ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params["projectId"]) {
        this.loadProject(params['projectId']);
      }
      this.loadProjects();
    });
    this.webSocketService.sendCommand({ command: 'setColor', index: 0, color: '#ff0000' });
    this.webSocketService.getCommandResponses().subscribe((v) => console.log(v));

    this.blockEditorChanged.pipe(debounceTime(500)).subscribe(() => {
      this.saveBlockly();
      const code = javascriptGenerator.workspaceToCode(this.blockEditor?.workspace);
      if (this.codeEditor && this.codeEditor.editor) {
        this.codeEditor.editor.dispatch({ changes: { from: 0, to: this.codeEditor.editor.state.doc.length, insert: code } });
      }
    });

    this.codeEditorChanged.pipe(debounceTime(500)).subscribe(() => this.saveCode());
  }

  public async loadProjects() {
    const projects = await lastValueFrom(this.projectService.getProjects());
    this.projects = projects.sort((a, b) => a.id.localeCompare(b.id));
  }

  public async loadProject(projectId: string) {
    this.project = await lastValueFrom(this.projectService.getProject(projectId));
    this.files = await lastValueFrom(this.projectService.getProjectFiles(projectId));

    if (this.blockEditor && this.blockEditor.workspace) {
      this.blockEditor.workspace.clear();
      this.blockEditor.workspace.clearUndo();

      const blockData = this.files?.files.find((f) => f.name === 'blockly.json')?.data ?? undefined;
      if (blockData) {
        const state = JSON.parse(blockData);
        serialization.workspaces.load(state, this.blockEditor.workspace);
      }
    }

    if (this.codeEditor && this.codeEditor.editor) {
      const codeData = this.files?.files.find((f) => f.name === 'main.ts')?.data ?? '';
      this.codeEditor?.editor?.dispatch({ changes: { from: 0, to: this.codeEditor.editor.state.doc.length, insert: codeData } });
    }
  }

  public async onBlockEditorChanged(): Promise<void> {
    console.log("onBlockEditorChanged");
    this.blockEditorChanged.next(true);

  }

  public async onCodeEditorChanged(): Promise<void> {
    console.log("onCodeEditorChanged");
    this.codeEditorChanged.next(true);
  }

  public async saveCode() {
    if (this.project && this.codeEditor && this.codeEditor.editor) {
      const code = this.codeEditor.editor.state.doc.sliceString(0);
      this.projectService.putFileContent(this.project.id, "main.ts", new FileContentDTO(code)).subscribe();
    }
  }

  public async saveBlockly() {
    //this.webSocketService.sendCommand(new BlinkstickSetColorCommand(0, "#ff0000"));
    if (this.project && this.blockEditor && this.blockEditor.workspace) {
      const state = serialization.workspaces.save(this.blockEditor.workspace);
      const data = JSON.stringify(state);
      this.projectService.putFileContent(this.project.id, "blockly.json", new FileContentDTO(data)).subscribe();
    }
  }

  public async createProject(id: string, type: string) {
    await lastValueFrom(this.projectService.createProject(id, id, type as ProjectType));
    await this.loadProjects();
  }

  public async renameProject(id: string, name: string) {
    await lastValueFrom(this.projectService.updateProject(id, { name }));
    await this.loadProjects();
    if (this.project) {
      await this.loadProject(this.project?.id);
    }
  }

  public async runProject(project: ProjectDTO) {
    this.runInProgress = true;
    try {
      await lastValueFrom(this.projectService.runProject(project.id));
    } catch (error) {
      window.alert("An error occured while running the project\n"+JSON.stringify(error));
    } finally {
      this.runInProgress = false;
    }
  }

  public async stopProject(project: ProjectDTO) {
    await lastValueFrom(this.projectService.stopProject(project.id));
  }


  public async deleteProject(project: ProjectDTO) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to perform this action?',
      accept: async () => {
        await lastValueFrom(this.projectService.deleteProject(project.id));
        this.router.navigate(['/']);
      }
    });
  }

};
