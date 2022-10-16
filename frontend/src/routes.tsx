import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import { FC } from 'react';

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
        key: 'deafult-route',
        title: 'SignIn',
        path: '/',
        enabled: true,
        component: SignIn
    },
    {
        key: 'signin-route',
        title: 'SignIn',
        path: '/signin',
        enabled: true,
        component: SignIn
    },
    {
        key: 'signup-route',
        title: 'SignUp',
        path: '/signup',
        enabled: true,
        component: SignUp
    }
]