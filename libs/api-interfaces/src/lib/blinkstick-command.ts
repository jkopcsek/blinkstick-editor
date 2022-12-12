export type BlinkstickCommand = BlinkstickSetColorCommand | BlinkstickGetColorCommand;

export type BlinkstickCommandResponse = BlinkstickCommandBaseResponse | BlinkstickGetColorCommandResponse;

export class BlinkstickCommandBaseResponse {
  constructor(public error?: string) {}
}

export class BlinkstickSetColorCommand {
  command = 'setColor' as const;

  constructor(public index: number, public color: string) {}
}

export class BlinkstickGetColorCommand {
  command =  'getColor' as const;

  constructor(public index: number) {}
}

export class BlinkstickGetColorCommandResponse extends BlinkstickCommandBaseResponse {
  command = 'getColor' as const;

  constructor(public color: string) { super(); }
}
