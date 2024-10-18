export  interface IUserAuthentication{
    username:string,
    email:string,
    image?:string
}

export interface UserAuthenticationResponse{
    token:string
}

export interface CommonResponse{
    message:string
}


export interface User{
    _id:string
    image:string
    username:string,
    email:string
}