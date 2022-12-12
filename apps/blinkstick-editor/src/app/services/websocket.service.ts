
import { Injectable } from '@angular/core';
import { BlinkstickCommand, BlinkstickCommandResponse } from '@blinkstick-editor/api-interfaces';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable()
export class WebSocketService {
  public constructor(private readonly socket: Socket) {
  }

  public sendCommand(command: BlinkstickCommand) {
    this.socket.emit('blinkstick', command);
  }

  public getCommandResponses(): Observable<BlinkstickCommandResponse> {
    return this.socket.fromEvent<BlinkstickCommandResponse>('blinkstick');
  }
}
