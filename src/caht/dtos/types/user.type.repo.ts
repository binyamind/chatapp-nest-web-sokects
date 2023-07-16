
export type Participant = {
    [participant: string]: User;
  }

export type User= {
    name:string;
    email:string;
}

export type ChatRoom = {
    id:number
    participants?:Array<Participant>,
    roomName:string,
    isAGroupChat?:boolean;
    messages?:Array<message>;
}
export type message ={
    from:User;
    to:User;
    createdDate:string|Date;
    text:string;
}

// user could be a participant of multipule rooms
// for each room/caht we will have a list of messages