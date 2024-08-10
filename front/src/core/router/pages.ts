import { userAuthStore } from '../stores/auth';
import { interfacePages } from '../interface/interface';

import pageNotFound from "@/core/pages/errors/404.vue"
import Login from "@/core/pages/login/login.vue";
import Register from "@/core/pages/register/register.vue"
import Home from "@/core/pages/home/home.vue"
import Users from "@/core/pages/users/users.vue"

import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/login", component: Login },
        { path: "/register", component: Register },
        { path: "/:pathMatch(.*)", component: pageNotFound },
        { path: "/", component: Home },
        { path: "/users", component: Users },
    ]
});

router.beforeEach((to: any, _: any, next: any) => {
    const authStore = userAuthStore();
    const targetPage = interfacePages.find(page => page.path === to.path);

    if (targetPage && targetPage.showWhenAuth && !authStore.GetIsAuth) {
        next('/login');
    } else {
        next();
    }
});

export default router;