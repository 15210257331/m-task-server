import { SubscribeMessage, WebSocketGateway, WsResponse, WebSocketServer } from '@nestjs/websockets';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cron } from '@nestjs/schedule';

export interface WebSocketUser {
  [key: string]: any;
}
@WebSocketGateway(4300, {
  cors: true,
  origins: '*'
})
export class EventsGateway {

  // 保存已经连接上websocket服务的用户集合 key是用户ID，value是socketclent实例
  socketMap: WebSocketUser = {};

  @WebSocketServer() server;

  // 新用户连接至websocket
  @SubscribeMessage('new user')
  newUser(client: any, userId: number): Observable<WsResponse<any>> | any {
    console.log(`新用户已登录用户ID为${userId}`);
    const keys = Object.keys(this.socketMap);
    if (userId) {
      this.socketMap[userId] = client;
    }
  }

  // 发送任务截止提醒消息
  sendMessage(userId: number, body: any) {
    console.log(userId, body);
    if (!userId) {
      return;
    }
    if (!this.socketMap[userId]) {
      console.log('该用户socket未登录啊！');
      return;
    }
    this.socketMap[userId].emit('reminder', body);
  }

  @SubscribeMessage('private message')
  handleEvent(client: any, payload: any): Observable<WsResponse<any>> | any {
    // 消息接收人ID
    const receiveId = String(payload.receiveId);
    // 对方在线直接发送过去
    if (this.socketMap[receiveId]) {
      console.log('在线直接发送');
      this.socketMap[receiveId].emit('private message', payload);
      // return of({
      //   event: 'private message',
      //   payload: payload
      // })
      // 如果不在线不发送存数据库等上线再发送
    } else {
      // await Message.create(msg);
    }
  }

}