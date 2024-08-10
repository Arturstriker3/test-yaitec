<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useForm } from 'vuestic-ui';
import { useRouter } from 'vue-router';
import { createToaster } from "@meforma/vue-toaster";
import EmailUtils from '../../utils/email.utils';
import { userAuthStore } from '../../stores/auth';
import autenticationService from "../../services/autentication";

const toaster = createToaster();

const store = userAuthStore();

const isLoading = ref(false);

const isPasswordVisible = ref(false);

const { isValid, validate, reset, resetValidation } = useForm('formRef')
const router = useRouter();
const form = ref({
    email: 'eve.holt@reqres.in',
    password: 'cityslicka',
})

const maxLengthToInputs = 50
type FormField = 'email' | 'password';

const submit = () => {
  isLoading.value = true;
  autenticationService.login({email: form.value.email, password: form.value.password})
    .then((response) => {
        const { token } = response.data;

        store.login(token);

        toaster.success(`Usuário logado com sucesso!`);
        router.push('/');
    })
    .catch(() => {
        toaster.error('Falha no login. Verifique suas credenciais e tente novamente.');
        resetValidation()
        reset()
    })
    .finally(() => {isLoading.value = false});
}

const validateEmail = (value: string) => {
  if (value.length === 0) return 'Digite o seu email!';
  if (!EmailUtils.isValid(value)) return 'Email inválido!';
  return true;
}

watch(form, () => {
  (Object.keys(form.value) as FormField[]).forEach((field) => {
    truncateInput(field);
  });
});

const truncateInput = (field: FormField) => {
  if (form.value[field].length > maxLengthToInputs) {
    form.value[field] = form.value[field].substring(0, maxLengthToInputs);
  }
};

onMounted(() => {
  store.initializeFromLocalStorage();
});

</script>

<template>
    <div class="flex items-center justify-center min-h-screen" >
      <VaCard class="p-4 rounded-lg w-full max-w-sm mx-auto" >
        <div class="flex flex-col items-center justify-center" >
          <p class="text-center text-lg font-semibold" >Login</p>
        </div>
        <div class="mb-6">
          <VaDivider />
        </div>
        <VaForm ref="formRef" class="flex flex-col w- gap-2">
            <VaInput
                v-model="form.email"
                :rules="[validateEmail]"
                label="Email"
                :disabled="isLoading"
                :max-length="50"
                @input="truncateInput('email')"
                counter
            />
            <VaInput
                v-model="form.password"
                :type="isPasswordVisible ? 'text' : 'password'"
                :rules="[(value: any) => (value && value.length > 0) || 'Digite a sua senha!']"
                label="Senha"
                :disabled="isLoading"
                :max-length="50"
                counter
                @input="truncateInput('password')"
                @click-append-inner="isPasswordVisible = !isPasswordVisible"
            >
              <template #appendInner>
                  <VaIcon
                    :name="isPasswordVisible ? 'visibility_off' : 'visibility'"
                    size="small"
                    color="primary"
                  />
              </template>
            </VaInput>
  
            <div class="flex flex-row justify-between">
              <VaButton :disabled="!isValid || isLoading" @click="validate() && submit()" class="w-28 ml-auto">
                <div>
                  <VaIcon v-if="isLoading" class="" name="refresh" spin />
                  <p v-else >Entrar</p>
                </div>
              </VaButton>
            </div>
        </VaForm>
      </VaCard>
    </div>
  </template>