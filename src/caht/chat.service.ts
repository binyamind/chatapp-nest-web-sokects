import { Inject, Injectable, Logger } from "@nestjs/common";
import { CreateChatDTO } from "./dtos/chat.dtos";
import { RepositoryInterface } from "./dtos/repository.interface";
import { CLIENT_REPOSITORY } from "./dtos/types/constants";
import { ChatRoom } from "./dtos/types/user.type.repo";



@Injectable()
export class ChatService{

    constructor(@Inject(CLIENT_REPOSITORY) private readonly chatRepository: RepositoryInterface){}
  logger = new Logger(ChatService.name)  
  async addChat(body:CreateChatDTO){
    this.logger.log(`chat added from service`)
    return await this.chatRepository.addChat(body);
  }  

 async getChatRoomById(roomId: string|number):Promise<ChatRoom> {
    return this.chatRepository.getRoom(roomId);
  }
}