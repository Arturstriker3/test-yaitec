<script setup lang="ts">

import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { RouterView ,useRouter, useRoute } from 'vue-router';
import { userAuthStore } from '../../core/stores/auth';
import { interfacePages } from '../../core/interface/interface';
import { useToast } from 'vuestic-ui'

const { notify, close } = useToast()
const router = useRouter();
const route = useRoute();
const userAuth = userAuthStore();

const navigateTo = (path: string) => {
  router.push(path);
};

const filteredPages = computed(() => {
  return interfacePages.filter(page => (page.showWhenAuth === userAuth.GetIsAuth));
});

const shouldShowNavbar = computed(() => {
  const currentPage = interfacePages.find(page => page.path === route.path);
  return currentPage ? currentPage.showNavbar : false;
});

const handleLogout = () => {
  userAuth.logout();
};

onMounted(() => {
  userAuth.initializeFromLocalStorage()
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
  closeToastIfOpen();
});

const mobileMenuVisible = ref(false);
const toggleMobileMenu = () => {
  mobileMenuVisible.value = !mobileMenuVisible.value;
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

let toastId: any = null;
const showUp = () => {
  if (!toastId) {
    toastId = notify({
      message: 'Clique aqui para voltar ao topo',
      position: 'bottom-left',
      closeable: false,
      onClick: scrollToTop,
      duration: 0,
    });
  }
};

const hideToast = () => {
  if (toastId) {
    close(toastId);
    toastId = null;
  }
};

const handleScroll = () => {
  if (window.scrollY > 800) {
    showUp();
  } else {
    hideToast();
  }
};

const closeToastIfOpen = () => {
  if (toastId) {
    close(toastId);
    toastId = null;
  }
};

const projectName = ref('Yaitec');

</script>

<template>
  <div class="w-screen h-screen ">
    <div class="sticky top-0 z-50" v-if="shouldShowNavbar">
      <div class='flex justify-between py-6 px-6 lg:px-16 items-center bg-[#151e22]'>
        <div class="w-screen bg-[#151e22] flex justify-between text-white items-center" >
          <span class='text-2xl font-sans font-bold'>
            {{ projectName }}
          </span>
          <ul class='hidden md:flex items-center space-x-5'>        
              <li v-for="page in filteredPages" :key="page.path" @click="navigateTo(page.path)">
                  <VaButton
                    color="#151e22"
                    text-color="#ffffff"
                  >
                  <p class="text-lg">{{ page.name }}</p>  
                  </VaButton>
              </li>
              <li v-if="userAuth.GetIsAuth" >
                <VaButton @click="handleLogout"
                  color="#151e22"
                >
                  <VaIcon
                    :name="'logout'"
                    color="#ffffff"
                    size="large"
                  />
                </VaButton>
              </li>
          </ul>
        </div>
        <button class='space-y-1 group md:hidden z-50 text-white'>
          <div class="space-y-1" :disabled="mobileMenuVisible" @click="toggleMobileMenu">
            <div class='w-6 h-1 bg-white'></div>
            <div class='w-6 h-1 bg-white'></div>
            <div class='w-6 h-1 bg-white'></div>
          </div>
          <ul class='bg-[#151e22] w-screen h-screen pb-10 absolute -top-full group-focus:top-0 right-0 duration-500 flex flex-col space-y-3 justify-start font-semibold text-lg' v-show="mobileMenuVisible">
            <button ref="closeMenuButton" class='px-10 py-8 relative ml-auto' @click="toggleMobileMenu">
              <div class='w-6 h-1 rotate-45 absolute bg-white'></div>
              <div class='w-6 h-1 -rotate-45 absolute bg-white'></div>
            </button>
            <li v-for="page in filteredPages" :key="page.path" class='flex items-center w-full py-4 hover:bg-slate-400' @click="() => { navigateTo(page.path); toggleMobileMenu()}">
                <VaIcon
                  class="ml-4 mr-2"
                  :name="page.pageIcon"
                  color="#ffffff"
                  size="large"
                />
                {{ page.name }}
            </li>
            <li  v-if="userAuth.GetIsAuth" class='flex items-center w-full py-4 hover:bg-slate-400' @click="handleLogout">
              <VaIcon
              class="ml-4 mr-2"
                :name="'logout'"
                color="#ffffff"
                size="large"
              />
              Sair
            </li>
          </ul>
        </button>
      </div>
    </div>
    <main v-show="!mobileMenuVisible" class="w-screen z-0" >
      <RouterView />
    </main>
  </div>
</template>