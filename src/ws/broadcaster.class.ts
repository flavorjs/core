import { Reflector } from '../utils/reflector.class.ts';

export abstract class Broadcaster {
  public readonly activeSockets = new Map<string, WebSocket>();

  protected broadcast(channel: string, payload: unknown): void {
    for (const socket of this.activeSockets.values()) {
      const pattern = Reflector.getMetadata<URLPattern>('pattern', this);

      if (
        pattern?.test({ pathname: `${channel[0] === '/' ? '' : '/'}${channel}` })
      ) {
        socket?.send(JSON.stringify(payload));
      }
    }
  }
}
