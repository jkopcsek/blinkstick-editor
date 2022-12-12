import { Logger } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway({cors: {origin: "http://localhost:4200"}})
export class BlinkstickGateway {
  private readonly logger = new Logger(BlinkstickGateway.name);

  @SubscribeMessage('blinkstick')
  public handleEvent(@MessageBody() data: string): string {
    this.logger.log(`[blinkstick]: ${data}`);
    return data;
  }
}
