import { User } from "./user.interface";

export interface Message{
    sender: string;
    receiver: User 
    content: string;
    timestamp: Date;
    type: 'image' | 'video' | 'pdf' | 'text'
}