import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDTO } from './dtos/chat.dtos';
import { ChatRoom } from './dtos/types/user.type.repo';

@Controller('chat')
export class ChatController {
  constructor(private chatService:ChatService) {}
  logger = new Logger(ChatController.name);

  @Post()
  async addChat(@Body() body:CreateChatDTO) {
    this.logger.verbose(`Handling request for (creating a new chat)`);
    return this.chatService.addChat(body);
  }

  @Get('/:roomId')
  async getChatRoomById(@Param('roomId') roomId:string|number):Promise<ChatRoom>{
    return await this.chatService.getChatRoomById(roomId);
  }

  @Get('chat/userId')
  async getAllUsersRoomsByUserId(@Param('userId') userId){
    return null
  }
}
