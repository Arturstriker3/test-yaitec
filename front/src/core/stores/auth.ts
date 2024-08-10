import { defineStore } from "pinia";
import router from '../router/pages';
import { interfacePages } from '../interface/interface';

export const userAuthStore = defineStore("auth", {
    state: () => ({
        isAuth: false,
        returnUrl: null,
        user: null as object | null,
        accessToken: null as string | null
    }),
    getters: {
        GetIsAuth: (state) => state.isAuth,
        GetUserId: (state) => state.user
    },
    actions: {
        login(token: string) {

            this.$state.accessToken = token;
            this.$state.isAuth = true;
            localStorage.setItem('accessToken', token);
        },
        logout() {

            this.$state.accessToken = null;
            localStorage.removeItem('accessToken');
            this.$state.isAuth = false;
            router.push('/login');
        },
        initializeFromLocalStorage() {
            const storedToken = localStorage.getItem('accessToken');

            if (storedToken) {
                this.$state.accessToken = storedToken;
                this.$state.isAuth = true;
                const currentRoute = router.currentRoute.value.path;
                const routeRequiresAuth = interfacePages.find(page => page.path === currentRoute && page.showWhenAuth);
                if (!routeRequiresAuth) {
                    router.push('/');
                }
            }
        }
    }
})