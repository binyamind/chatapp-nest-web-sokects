import { CreateChatDTO } from "./chat.dtos";
import { ChatRoom, User } from "./types/user.type.repo";


export interface RepositoryInterface{
     addSingelParticipant(user: User);
     addParticipantsToRoom(user: User);
     addChat(body:CreateChatDTO): Promise<ChatRoom> ;
     getRoom(rooId:string|number) :Promise<ChatRoom>;
}