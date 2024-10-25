

export interface Group{
    _id?:string
    name:string,
    image?:string
    description:string
} 


export interface GroupChat{
    _id?:string
    content: string;
  sender: {
    _id: string;
    username: string;
    image: string;
  };
  groupId: {
    _id: string;
    name: string;
  };
  timestamp: Date;
  type?: string;
} 