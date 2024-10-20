import { Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { ChatComponent } from './components/chat/chat.component';
import { GroupChatComponent } from './components/group-chat/group-chat.component';
import { RedirectComponent } from './components/redirect/redirect.component';
import { publicGuard } from './guard/public.guard';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
  {
    path:'auth',
    component:AuthComponent,
    canActivate:[publicGuard]
  },
  {
    path:'chat',
    component:ChatComponent,
    canActivate: [authGuard] 
  },
  {
    path:'group-chat',
    component:GroupChatComponent,
    canActivate: [authGuard] 
  },
  {
    path:'',
    pathMatch:'full',
    redirectTo:'auth'
  },
  {
    path: '**',
    component:RedirectComponent,
    canActivate:[publicGuard]
  }
];
