import { Length, IsString, IsOptional } from 'class-validator';


export class CreateChatDTO {
  sender: UersDto;
  recipient: UersDto;
  @IsOptional()
  @IsString()
  @Length(0, 25)
  roomName?: string;
  isGroup?: boolean;
}

export class UersDto {
  @IsString()
  @Length(1, 25)
  name: string;

  @IsString()
  @Length(1, 25)
  email: string;
}

