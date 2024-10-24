export  interface IUserAuthentication{
    name:string,
    email:string,
    image?:string
}

export interface UserAuthenticationResponse{
    token:string
}

export interface CommonResponse{
    message:string
}

export interface Connections{
    userId:string,
    connections:User[]
}


// export User

export interface RequestResponse{
    _id:string,
    status:string,
    sender:User,
    receiver:string
}


export interface User{
    _id:string
    image:string
    username:string,
    email:string
    status?:string
}