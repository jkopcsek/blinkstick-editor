import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { InplaceModule } from 'primeng/inplace';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ToolbarModule } from 'primeng/toolbar';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { BlockEditorComponent } from './block-editor/block-editor.component';
import { CodeEditorComponent } from './code-editor/code-editor.component';
import { MainPage } from './main.page/main.page';
import { ProjectService } from './services/project.service';
import { WebSocketService } from './services/websocket.service';

const config: SocketIoConfig = { url: 'http://localhost:2001/' };

AppComponent
@NgModule({
  declarations: [AppComponent, MainPage, BlockEditorComponent, CodeEditorComponent],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule, SocketIoModule.forRoot(config), ButtonModule, ToolbarModule, MenuModule, OverlayPanelModule, BrowserAnimationsModule, DropdownModule, InputTextModule, ConfirmDialogModule, InplaceModule],
  providers: [WebSocketService, ProjectService, ConfirmationService],
  bootstrap: [AppComponent],
})
export class AppModule { }
