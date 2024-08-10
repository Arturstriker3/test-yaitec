<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const pathMatch = route.params.pathMatch as string

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="container lg:max-w-7xl mx-auto text-center mt-40">
    <div class="space-y-8">
      <h1 class="text-9xl text-gray-800 font-bold">404</h1>
      <h2 class="text-4xl text-gray-800">
        Página não encontrada
      </h2>
      <p class="text-gray-800">
        Desculpe, mas a página
        '{{ pathMatch }}' não foi encontrada
      </p>
      <button @click="goHome" class="bg-gray-800 rounded text-white py-3 px-5">
        Voltar para o Início
      </button>
    </div>
  </div>
</template>