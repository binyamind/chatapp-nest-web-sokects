import { Redis } from 'ioredis';
import {
  Inject,
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { IO_REDIS } from './chat.redis.module';
import { ChatRoom, Participant, User } from './dtos/types/user.type.repo';
import { CreateChatDTO } from './dtos/chat.dtos';
import { RepositoryInterface } from './dtos/repository.interface';

@Injectable()
export class ChatRepository implements RepositoryInterface {
  constructor(@Inject(IO_REDIS) private readonly redisClient: Redis) {}

  private logger = new Logger(ChatRepository.name);
  private participants: Array<Participant> = []; // TODO initilize list of participants from Redis...
  // TODO retrive messages from Redis
  // TODO get list of participants from Redis...

  addSingelParticipant(user: User): Participant {
    const newuser = {};
    newuser[user.email] = user;
    return newuser;
  }

  addParticipantsToRoom(user: User) {
    return [];
  }
  async addChat(body: CreateChatDTO): Promise<ChatRoom> {
    this.logger.log(`creating a new Chat`);

    this.participants = [
      this.addSingelParticipant(body.sender),
      this.addSingelParticipant(body.recipient),
    ];
    this.logger.log(
      `creating a new Chat users are  ${body.sender} and ${body.recipient}`,
    );

    const chat: ChatRoom = {
      id: Math.floor(Math.random() * 100),
      participants: this.participants,
      roomName: body.isGroup ? body.roomName : body.recipient.email,
      isAGroupChat: body.isGroup ? true : false,
      messages: [],
    };
    try {
      const key = `chat:${chat.id}`;
      await this.redisClient
        .multi([
          ['send_command', 'JSON.SET', key, '.', JSON.stringify(chat)],
          ['expire', key, 7200],
        ])
        .exec();
      return chat;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getRoom(roomID: string|number): Promise<ChatRoom> {
    this.logger.log(`Attempting to get poll with: ${roomID}`);
    const key = `chat:${roomID}`;
    try {
      const chatRoom = await this.redisClient.send_command(
        'JSON.GET',
        key,
        '.',
      );
      this.logger.verbose(chatRoom);
      return JSON.parse(chatRoom);
    } catch (e) {
      this.logger.error(`Failed to get pollID ${roomID}`);
      throw new InternalServerErrorException(`Failed to get pollID ${roomID}`);
    }
  }
}
