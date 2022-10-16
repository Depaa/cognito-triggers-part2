import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import {FC} from "react";

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
        key: 'SignIn-route',
        title: 'SignIn',
        path: '/',
        enabled: true,
        component: SignIn
    },
    {
        key: 'SignUp-route',
        title: 'SignUp',
        path: '/SignUp',
        enabled: true,
        component: SignUp
    }
]