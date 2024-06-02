import * as listeners from "./scripts/handlers/index.mjs";


export default function router() {
    const path = location.pathname;

    switch (path) {
        case '/account/login/':
            listeners.setLoginFormListener()
            return;
        case '/account/register/':
            listeners.setRegisterFormListener()
            return;
        case '/post/edit/':
            listeners.setCreatePostFormListener()
            return;
        case '/post/index/': 
            listeners.setUpdatePostFormListener()
            return;
    }
}





