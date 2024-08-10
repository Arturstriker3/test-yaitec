<script setup lang="ts">
import { useForm } from 'vuestic-ui';
import { ref, onMounted, watch, computed } from 'vue';
import usersCrud from "@/core/services/usersCrud";
import { createToaster } from "@meforma/vue-toaster";
import { useToast } from 'vuestic-ui'
import EmailUtils from '@/core/utils/email.utils';

const toaster = createToaster();
const { notify } = useToast();
const isLoading = ref(false);
const isDeletingCard = ref(false);
const showDeleteModal = ref(false);
const showEditModal = ref(false);
const showCreateModal = ref(false);

const { reset } = useForm('formRef',)
const maxLengthToInputs = 50
type FormField = 'cardText';

const form = ref({
  cardText: '',
})

type Card = {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    avatar: string;
    loaded: boolean;
};

const cardsToShow = ref<Card[]>([]);

const currentPage = ref(1);
const totalPages = ref(2);
const resultsPerPage = ref(4);
const resultsPerPageOptions = [
    { label: '4', value: '4' },
    { label: '8', value: '8' },
    { label: '16', value: '16' },
];

const cardIdToDelete = ref('');
const cardNameToDelete = ref('');
const deleteMessage = computed(() => 
    `Você tem certeza que deseja deletar o usuário ${cardNameToDelete.value}? Essa ação não poderá ser desfeita.`
);
const cardToEdit = ref({
    id: '',
    email: '',
    first_name: '',
    last_name: '',
    avatar: '',
    loaded: false,
} as Card);

watch(form, () => {
  (Object.keys(form.value) as FormField[]).forEach((field) => {
    truncateInput(field);
  });
});

watch(resultsPerPage, () => {
  currentPage.value = 1;
  getData(currentPage.value);
});

const truncateInput = (field: FormField) => {
  if (form.value[field].length > maxLengthToInputs) {
    form.value[field] = form.value[field].substring(0, maxLengthToInputs);
  }
};

const validateLength = (value: string) => {
  return value.length <= maxLengthToInputs || '';
}

const getData = (page: number) => {
  isLoading.value = true;
  usersCrud.getUsers({page, per_page: resultsPerPage.value})
    .then((response) => {
        cardsToShow.value = response.data.data;
        currentPage.value = response.data.page;
        totalPages.value = response.data.total_pages;
    })
    .catch(() => {
        reset()
        toaster.error('Falha ao carregar os usuários.');
    })
    .finally(() => {isLoading.value = false});
}

const deleteTheUser = (cardId: string) => {
  isDeletingCard.value = true;
  usersCrud.deleteUser(cardId)
    .then(() => {
      notify({
      message: 'Usuário deletado com sucesso!',
      position: 'top-left',
      color: 'success',
      });
    })
    .catch(() => {
        reset()
        toaster.error('Falha ao deletar o usuário!');
    })
    .finally(() => {isDeletingCard.value = false});
    cardIdToDelete.value = '';
}

const createTheUser = () => {
  isDeletingCard.value = true;
  usersCrud.createUser(cardToEdit.value.first_name, cardToEdit.value.last_name, cardToEdit.value.email)
    .then(() => {
      notify({
      message: 'Usuário criado com sucesso!',
      position: 'top-left',
      color: 'success',
      });
    })
    .catch(() => {
        reset()
        toaster.error('Falha ao criar o usuário!');
    })
    .finally(() => {isDeletingCard.value = false});
    cardIdToDelete.value = '';
}

onMounted(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  getData(currentPage.value)
});

const openCardDeleteModalConfirm = (cardId: string, cardFirstName: string, cardLastName: string) => {
  showDeleteModal.value = true;
  cardIdToDelete.value = cardId;
  cardNameToDelete.value = `${cardFirstName} ${cardLastName}`;
}

const openCardEditModalConfirm = (cardId: string) => {
  showEditModal.value = true;
  const selectedCard = cardsToShow.value.find(card => card.id === cardId) as Card;
  cardToEdit.value = { ...selectedCard };
}

const openCardCreateModalConfirm = () => {
  showCreateModal.value = true;
  cardToEdit.value.id = '';
  cardToEdit.value.email = '';
  cardToEdit.value.first_name = '';
  cardToEdit.value.last_name = '';
}

const filteredCards = computed(() => {
  const searchText = form.value.cardText.toLowerCase();
  return cardsToShow.value.filter(card => 
    card.first_name.toLowerCase().includes(searchText) || 
    card.last_name.toLowerCase().includes(searchText) ||
    card.email.toLowerCase().includes(searchText)
  );
});

const changePage = (page: number) => {
  getData(page);
}

const maskedValueFirstName = computed({
  get() {
    return cardToEdit.value.first_name
  },
  set(v) {
    cardToEdit.value.first_name = v.slice(0, 25)
  }
})

const maskedValueLastName = computed({
  get() {
    return cardToEdit.value.last_name
  },
  set(v) {
    cardToEdit.value.last_name = v.slice(0, 25)
  }
})

const maskedValueEmail = computed({
  get() {
    return cardToEdit.value.email
  },
  set(v) {
    cardToEdit.value.email = v.slice(0, 50)
  }
})

const validateEmail = (value: string) => {
  if (!EmailUtils.isValid(value)) return 'Email inválido!';
  return true;
}

const updateTheUser = () => {
  isDeletingCard.value = true;
  usersCrud.editUser(cardToEdit.value.id, cardToEdit.value.first_name, cardToEdit.value.last_name, cardToEdit.value.email)
    .then(() => {
      notify({
      message: 'Usuário editado com sucesso!',
      position: 'top-left',
      color: 'success',
      });
    })
    .catch(() => {
        reset()
        toaster.error('Falha ao editar o usuário!');
    })
    .finally(() => {isDeletingCard.value = false});
}

</script>

<template>
  <div class="flex flex-col w-screen h-screen  py-4 gap-10" >
    <div class="flex justify-center items-center" >
      <VaCard class="mt-4 px-6 py-4 rounded-lg w-screen mx-auto" >
        <div class="flex flex-col items-center justify-center" >
          <p class="text-center text-lg font-semibold" >Usuários</p>
        </div>
        <div class="mb-6">
          <VaDivider />
        </div>
        <VaForm ref="formRef" class="flex flex-row w-full gap-2 justify-center items-center ">
            <VaInput
                v-model="form.cardText"
                :rules="[validateLength]"
                label="Pesquisar"
                :disabled="isLoading"
                :max-length=maxLengthToInputs
                counter
                @input="truncateInput('cardText')"
                class="w-full"
            />
            <VaButton
              round
              :disabled="isLoading || isDeletingCard"
              @click="openCardCreateModalConfirm()"
              class="h-full"
              >
              <VaIcon
                  :name="'add'"
                  color="#ffffff"
                  size="small"
              />
            </VaButton>
        </VaForm>
        <div class="flex justify-end my-6" >
          <VaButtonToggle
              v-model="resultsPerPage"
              size="small"
              :options="resultsPerPageOptions"
              :disabled="isLoading"
          />
        </div>

        <div class="flex justify-center items-center" >
          <VaPagination
              v-model="currentPage"
              :pages=totalPages
              :visible-pages="3"
              buttons-preset="primary"
              rounded
              gapped
              border-color="primary"
              class="mb-6 justify-center sm:justify-start"
              @update:modelValue="changePage"
              :disabled="isLoading"
          />
        </div>

        <VaDivider />

        <div v-if="isLoading" class="flex justify-center items-center">
          <VaProgressCircle indeterminate
          size="15rem"
          />
        </div>
        
        <div v-else>
          <VaCard class="px-6 py-4 rounded-lg w-full mx-auto" >
            <section id="Users"
            class="mt-10 w-fit mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4   justify-items-center justify-center gap-y-16 gap-x-14 mb-10">
              <div v-for="card in filteredCards" :key="card.id" class="w-72 bg-slate-50 shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl border border-gray-300 fade-in">
                <div class="text-center py-2">
                  <p class="text-lg font-bold text-black truncate block capitalize">{{ card.first_name }}</p>
                </div>

                <div class="flex gap-4 object-cover">
                  <VaImage
                    fit="scale-down"
                    class="h-60 w-72 object-cover rounded-t-xl"
                    :src="card.avatar"
                    lazy
                    @loaded="card.loaded = true"
                    >
                    <template #loader>
                      <VaProgressCircle indeterminate />
                    </template>
                  </VaImage>
                </div>
                
                <div class="px-4 py-3 w-72">
                    <div class="flex items-center">
                        <p class="text-xs font-semibold text-black cursor-auto my-3">{{card.first_name}} {{card.last_name}}</p>
                        <div class="ml-auto">
                          <div class="flex flex-row gap-4" >
                              <VaButton
                              round
                              :disabled="!card.loaded || isDeletingCard"
                              @click="openCardEditModalConfirm(card.id)"
                              >
                              <VaIcon
                                  :name="'edit'"
                                  color="#ffffff"
                                  size="small"
                              />
                              </VaButton>

                              <VaButton
                              round
                              color="danger"
                              :disabled="!card.loaded || isDeletingCard"
                              @click="openCardDeleteModalConfirm(card.id, card.first_name, card.last_name)"
                              >
                              <VaIcon
                                  :name="'delete'"
                                  color="#ffffff"
                                  size="small"
                              />
                              </VaButton>
                          </div>
                        </div>
                    </div>
                </div>
              </div>
            </section>
          <div v-if="resultsPerPage != 4" class="flex justify-center items-center pt-4 pb-6" >
              <VaPagination
                  v-model="currentPage"
                  :pages=totalPages
                  :visible-pages="3"
                  buttons-preset="primary"
                  rounded
                  gapped
                  border-color="primary"
                  class="mb-6 justify-center sm:justify-start"
                  @update:modelValue="changePage"
                  :disabled="isLoading"
              />
          </div>
          </VaCard>
        </div>
      </VaCard>
  </div>
  <VaModal
      v-model="showDeleteModal"
      ok-text="Confirmar"
      cancel-text="Cancelar"
      :message="deleteMessage"
      blur
      :mobileFullscreen=false
      @ok="deleteTheUser(cardIdToDelete)"
      >
  </VaModal>
  <VaModal
      v-model="showEditModal"
      ok-text="Confirmar"
      cancel-text="Cancelar"
      blur
      :mobileFullscreen=true
      @ok="updateTheUser()"
      >
      <div class="min-h-full bg-slate-100 border rounded-lg p-2" >
        <div class="flex justify-center items-center mb-4" >
          <h3 class="font-medium flex flex-row items-center gap-2 text-2xl">
            Editando: <p class="font-semibold" >{{cardToEdit.first_name}} {{cardToEdit.last_name}}</p>
          </h3>
        </div>
        <VaForm ref="editFormRef" class="flex flex-col w-full gap-2 justify-center items-center">
          <VaInput
            v-model="maskedValueFirstName"
            :rules="[validateLength]"
            label="Primeiro Nome"
            :disabled="isLoading"
            :max-length="25"
            counter
            class="w-full md:w-2/4"
            strict-bind-input-value
          />

          <VaInput
            v-model="maskedValueLastName"
            :rules="[validateLength]"
            label="Último Nome"
            :disabled="isLoading"
            :max-length="25"
            counter
            class="w-full md:w-2/4"
            strict-bind-input-value
          />

          <VaInput
            v-model="maskedValueEmail"
            :rules="[validateLength, validateEmail]"
            label="Email"
            :disabled="true"
            :max-length="50"
            counter
            class="w-full md:w-2/4"
            strict-bind-input-value
          />
        </VaForm>
      </div>
  </VaModal>
  <VaModal
      v-model="showCreateModal"
      ok-text="Confirmar"
      cancel-text="Cancelar"
      blur
      :mobileFullscreen=true
      @ok="createTheUser()"
      >
      <div class="min-h-full bg-slate-100 border rounded-lg p-2" >
        <div class="flex justify-center items-center mb-4" >
          <h3 class="font-medium flex flex-row items-center gap-2 text-2xl ">
            Criar Usuário
          </h3>
        </div>
        <VaForm ref="editFormRef" class="flex flex-col w-full gap-2 justify-center items-center">
          <VaInput
            v-model="maskedValueFirstName"
            :rules="[validateLength]"
            label="Primeiro Nome"
            :disabled="isLoading"
            :max-length="25"
            counter
            class="w-full md:w-2/4"
            strict-bind-input-value
          />

          <VaInput
            v-model="maskedValueLastName"
            :rules="[validateLength]"
            label="Último Nome"
            :disabled="isLoading"
            :max-length="25"
            counter
            class="w-full md:w-2/4"
            strict-bind-input-value
          />

          <VaInput
            v-model="maskedValueEmail"
            :rules="[validateLength, validateEmail]"
            label="Email"
            :disabled="isLoading"
            :max-length="50"
            counter
            class="w-full md:w-2/4"
            strict-bind-input-value
          />
        </VaForm>
      </div>
    </VaModal>
  </div>
</template>

<style scoped >

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.9s ease-out;
}

</style>