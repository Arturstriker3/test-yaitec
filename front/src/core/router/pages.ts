import { userAuthStore } from '../stores/auth';
import { interfacePages } from '../interface/interface';

import pageNotFound from "@/core/pages/errors/404.vue"
import Login from "@/core/pages/login/login.vue";
import Register from "@/core/pages/register/register.vue"
import Rag from "@/core/pages/rag/rag.vue"
import Books from "@/core/pages/books/books.vue"

import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/login", component: Login },
        { path: "/register", component: Register },
        { path: "/:pathMatch(.*)", component: pageNotFound },
        { path: "/", component: Rag },
        { path: "/books", component: Books },
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