// server-b/src/websocket-client.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as WebSocket from 'ws';

@Injectable()
export class WebsocketClientService implements OnModuleInit, OnModuleDestroy {
  private ws: WebSocket;

  onModuleInit() {
    this.connectToServer();
  }

  connectToServer() {
    this.ws = new WebSocket('ws://20.2.116.72/socket/');

    this.ws.on('open', () => {
      console.log('Connected to WebSocket server on Server A');
      this.sendMessage('Hello from Server B!');
    });

    this.ws.on('message', (data) => {
      console.log(`Received from Server A: ${data}`);
    });

    this.ws.on('error', (err) => {
      console.error('WebSocket error:', err);
    });

    this.ws.on('close', () => {
      console.log('Disconnected from WebSocket server on Server A');
    });
  }

  sendMessage(message: String) {
    this.ws.send(message);
  }

  onModuleDestroy() {
    this.ws.close();
  }
}
