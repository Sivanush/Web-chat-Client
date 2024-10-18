import { Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { HomeComponent } from './components/home/home.component';
import { ChatComponent } from './components/chat/chat.component';
import { GroupChatComponent } from './components/group-chat/group-chat.component';
import { RedirectComponent } from './components/redirect/redirect.component';
import { publicGuard } from './guard/public.guard';

export const routes: Routes = [
  {
    path:'auth',
    component:AuthComponent,
    canActivate:[publicGuard]
  },
  {
    path:'home',
    component:HomeComponent
  },
  {
    path:'chat',
    component:ChatComponent,
  },
  {
    path:'group-chat',
    component:GroupChatComponent,
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
