import { FC } from 'react';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

// interface
interface Route {
  key: string,
  title: string,
  path: string,
  enabled: boolean,
  component: FC<{}>
}

export const routes: Array<Route> = [
  {
    key: 'signup-route',
    title: 'SignUp',
    path: '/',
    enabled: true,
    component: SignUp
  },
  {
    key: 'signin-route',
    title: 'SignIn',
    path: '/signin',
    enabled: true,
    component: SignIn
  },
]