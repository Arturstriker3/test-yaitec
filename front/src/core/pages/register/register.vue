<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useForm } from 'vuestic-ui';
import { useRouter } from 'vue-router';
import autenticationService from "../../services/autentication";
import { createToaster } from "@meforma/vue-toaster";
import EmailUtils from '../../utils/email.utils';
import { userAuthStore } from '../../stores/auth';

const toaster = createToaster();

const userAuth = userAuthStore();

const isLoading = ref(false);
const isSubmited = ref(false)

const isPasswordVisible = ref(false);
const isConfirmPasswordVisible = ref(false);

const maxLengthToInputs = 50

type FormField = 'name' | 'email' | 'password' | 'confirmPassword';

const { isValid, validate, reset, resetValidation } = useForm('formRef')
const router = useRouter();
const form = ref({
    name: 'Eve',
    email: 'eve.holt@reqres.in',
    password: 'pistol',
    confirmPassword: 'pistol',
})

const goTo = (path: string) => {
  router.push(path);
};

const submit = () => {
  isLoading.value = true;
  autenticationService.register({ email: form.value.email, password: form.value.password})
    .then(() => {
        toaster.success(`Nova conta cadastrada com sucesso!`);
        isSubmited.value = true
    })
    .catch(() => {
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
  userAuth.initializeFromLocalStorage();
});

</script>

<template>
  <div class="flex items-center justify-center min-h-screen" >
    <VaCard class="p-4 rounded-lg w-full max-w-sm mx-auto" >
      <div class="flex flex-col items-center justify-center" >
        <p class="text-center text-lg font-semibold" >Registro</p>
      </div>
      <div class="mb-6">
        <VaDivider />
      </div>
      <div>
        <div v-if="!isSubmited" >
          <VaForm ref="formRef" class="flex flex-col w- gap-2">
            <VaInput
                v-model="form.name"
                :rules="[(value) => (value && value.length > 0) || 'Digite o seu nome!']"
                label="Nome"
                :disabled="isLoading"
                :max-length="50"
                counter
                @input="truncateInput('name')"
            />

            <VaInput
                v-model="form.email"
                :rules="[validateEmail]"
                label="Email"
                :disabled="isLoading"
                :max-length="50"
                counter
                @input="truncateInput('email')"
            />

            <VaInput
                v-model="form.password"
                :type="isPasswordVisible ? 'text' : 'password'"
                :rules="[(value) => (value && value.length > 0) || 'Digite a sua senha!']"
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

            <VaInput
                v-model="form.confirmPassword"
                :type="isConfirmPasswordVisible ? 'text' : 'password'"
                :rules="[(value) => (value === form.password) || 'Confirme a sua senha!']"
                label="Confirmar Senha"
                :disabled="form.password.length === 0 || isLoading"
                :max-length="50"
                counter
                @input="truncateInput('confirmPassword')"
                @click-append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible"
            >
              <template #appendInner>
                  <VaIcon
                    :name="isConfirmPasswordVisible ? 'visibility_off' : 'visibility'"
                    size="small"
                    color="primary"
                  />
              </template>
            </VaInput>

            <div class="flex flex-row justify-between">
              <VaButton :disabled="isLoading" preset="primary" @click="goTo('/')" class="w-28" >
                <div>
                  <p :disabled="isLoading" >Sair</p>
                </div>
              </VaButton>

              <VaButton :disabled="!isValid || isLoading" @click="validate() && submit()" class="w-28">
                <div>
                  <VaIcon v-if="isLoading" class="" name="refresh" spin />
                  <p v-else >Registrar</p>
                </div>
              </VaButton>
            </div>
          </VaForm>
        </div>

        <div v-else class="flex flex-col gap-4">
          <div class="flex justify-center">
            <VaBadge class="font-" text="Sua conta foi registrada!" color="success"/>
          </div>
          <VaButton :disabled="isLoading" preset="primary" @click="goTo('/login')" class="w-28" >
            <div>
              <p :disabled="isLoading" >Logar</p>
            </div>
          </VaButton>
        </div>
      </div>
    </VaCard>
  </div>
</template>