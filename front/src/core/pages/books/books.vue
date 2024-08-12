<script setup lang="ts" >
import { useForm } from 'vuestic-ui';
import { ref, onMounted, watch, computed } from 'vue';
import { createToaster } from "@meforma/vue-toaster";
import { useToast } from 'vuestic-ui'
import bookService from '@/core/services/bookService';

const toaster = createToaster();
const { notify } = useToast();
const isLoading = ref(false);
const isDeletingCard = ref(false);
const showDeleteModal = ref(false);
const showCreateModal = ref(false);

const { reset } = useForm('formRef',)
const maxLengthToInputs = 50
type FormField = 'cardText';

const form = ref({
  cardText: '',
})

type Book = {
    id: number;
    title: string;
    author: string;
    loaded: boolean;
};

const booksToShow = ref<Book[]>([]);

const currentPage = ref(1);
const totalPages = ref(2);
const resultsPerPage = ref(4);
const resultsPerPageOptions = [
    { label: '4', value: '4' },
    { label: '8', value: '8' },
    { label: '16', value: '16' },
];

const bookIdToDelete = ref(0);
const bookToDelete = ref('');
const deleteMessage = computed(() => 
    `Você tem certeza que deseja deletar o livro ${bookToDelete.value}? Essa ação não poderá ser desfeita.`
);

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
  bookService.getBooks({ page, limit: resultsPerPage.value })
    .then((response: any) => {
      booksToShow.value = response.data.books;
      currentPage.value = response.data.currentPage;
      totalPages.value = response.data.totalPages;
    })
    .catch(() => {
      reset();
      toaster.error('Falha ao carregar os livros.');
    })
    .finally(() => {
      isLoading.value = false;
    });
}

const deleteTheBook = (bookId: number) => {
  isDeletingCard.value = true;
  bookService.deleteBook(bookId)
    .then(() => {
      notify({
      message: 'Livro deletado com sucesso!',
      position: 'top-left',
      color: 'success',
      });
      getData(currentPage.value);
    })
    .catch(() => {
        reset()
        toaster.error('Falha ao deletar o livro!');
    })
    .finally(() => {isDeletingCard.value = false});
    bookIdToDelete.value = 0;
}

const createTheBook = () => {
  isDeletingCard.value = true;

  if (!selectedFile.value) {
    toaster.error('Por favor, selecione um arquivo antes de criar o livro.');
    return;
  }

  bookService.createBook( bookToEdit.value.title, bookToEdit.value.author, selectedFile.value)
    .then(() => {
      notify({
      message: 'Livro registrado com sucesso!',
      position: 'top-left',
      color: 'success',
      });
      getData(currentPage.value);
    })
    .catch(() => {
        reset()
        toaster.error('Falha ao registrar o livro!');
    })
    .finally(() => {isDeletingCard.value = false});
    bookIdToDelete.value = 0;
}

onMounted(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  getData(currentPage.value)
});

const filteredBooks = computed(() => {
  const searchText = form.value.cardText.toLowerCase();
  return booksToShow.value.filter(book => 
    book.title.toLowerCase().includes(searchText) || 
    book.author.toLowerCase().includes(searchText)
  );
});

const changePage = (page: number) => {
  getData(page);
}

type BookToSend = {
    title: string;
    author: string;
    file: any;
};

const bookToEdit = ref({
    title: '',
    author: '',
    file: File
} as BookToSend);

const openCardCreateModalConfirm = () => {
  showCreateModal.value = true;
  bookToEdit.value.author = '';
  bookToEdit.value.title = '';
  selectedFile.value = null;
}

const maskedValueTitle = computed({
  get() {
    return bookToEdit.value.title
  },
  set(v) {
    bookToEdit.value.title = v.slice(0, 50)
  }
})

const maskedValueAuthor = computed({
  get() {
    return bookToEdit.value.author
  },
  set(v) {
    bookToEdit.value.author = v.slice(0, 50)
  }
})

const selectedFile = ref<File | null>(null);

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0];
  }
}

const openCardDeleteModalConfirm = (bookId: number, bookName: string) => {
  showDeleteModal.value = true;
  bookIdToDelete.value = bookId;
  bookToDelete.value = `${bookName}`;
}

const openBookRag = (bookId: number, bookName: string) => {
  showRagModal.value = true;
  bookIdToDelete.value = bookId;
  bookToDelete.value = `${bookName}`;
}

const showRagModal = ref(false);

const ragQuestion = ref('');
const ragMessage = ref('');
const rag = ref({});

const maskedValueRag = computed({
  get() {
    return ragQuestion.value
  },
  set(v) {
    ragQuestion.value = v.slice(0, 100)
  }
})

const startBookRag = (bookId: number) => {
  isDeletingCard.value = true;
  bookService.ragBook(bookId, ragQuestion.value)
    .then((data: any) => {
      notify({
      message: 'RAG concluido com sucesso!',
      position: 'top-left',
      color: 'success',
      });
      rag.value = data.data;
      ragMessage.value = rag.value.answer.answer;
    })
    .catch(() => {
        reset()
        toaster.error('Falha ao obter RAG sobre o livro!');
    })
    .finally(() => {isDeletingCard.value = false});
    bookIdToDelete.value = 0;
}

</script>

<template>
    <div class="flex flex-col w-screen h-screen  py-4 gap-10" >
      <div class="flex justify-center items-center" >
        <VaCard class="mt-4 px-6 py-4 rounded-lg w-screen mx-auto" >
          <div class="flex flex-col items-center justify-center" >
            <p class="text-center text-lg font-semibold" >Livros</p>
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
                class="h-full"
                @click="openCardCreateModalConfirm()"
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
                <div v-for="book in filteredBooks" :key="book.id" class="w-72 bg-slate-50 shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl border border-gray-300 fade-in">
                  <div class="text-center py-2">
                    <p class="text-lg font-bold text-black truncate block capitalize">{{ book.title }}</p>
                  </div>
  
                  <div class="flex gap-4 object-cover">
                    <VaImage
                      fit="scale-down"
                      class="h-60 w-72 object-cover rounded-t-xl"
                      src="https://picsum.photos/200"
                      lazy
                      @loaded="book.loaded = true"
                      >
                      <template #loader>
                        <VaProgressCircle indeterminate />
                      </template>
                    </VaImage>
                  </div>
                  
                  <div class="px-4 py-3 w-72">
                      <div class="flex items-center">
                          <p class="text-xs font-semibold text-black cursor-auto my-3">{{ book.author }}</p>
                          <div class="ml-auto">
                            <div class="flex flex-row gap-4" >
                                <VaButton
                                round
                                :disabled="!book.loaded || isDeletingCard"
                                @click="openBookRag(book.id, book.title)"
                                >
                                <VaIcon
                                    :name="'chat'"
                                    color="#ffffff"
                                    size="small"
                                />
                                </VaButton>
  
                                <VaButton
                                round
                                color="danger"
                                :disabled="!book.loaded || isDeletingCard"
                                @click="openCardDeleteModalConfirm(book.id, book.title)"
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
        @ok="deleteTheBook(bookIdToDelete)"
        >
    </VaModal>
    <VaModal
        v-model="showCreateModal"
        ok-text="Confirmar"
        cancel-text="Cancelar"
        blur
        :mobileFullscreen=true
        @ok="createTheBook()"
        >
        <div class="min-h-full bg-slate-100 border rounded-lg p-2" >
          <div class="flex justify-center items-center mb-4" >
            <h3 class="font-medium flex flex-row items-center gap-2 text-2xl ">
              Registrar Livro
            </h3>
          </div>
          <VaForm ref="editFormRef" class="flex flex-col w-full gap-2 justify-center items-center">
            <VaInput
              v-model="maskedValueTitle"
              :rules="[validateLength]"
              label="Título"
              :disabled="isLoading"
              :max-length="50"
              counter
              class="w-full md:w-2/4"
              strict-bind-input-value
            />
  
            <VaInput
              v-model="maskedValueAuthor"
              :rules="[validateLength]"
              label="Autor"
              :disabled="isLoading"
              :max-length="50"
              counter
              class="w-full md:w-2/4"
              strict-bind-input-value
            />
            
            <input type="file" :disabled="isLoading" @change="handleFileChange">

          </VaForm>
        </div>
      </VaModal>
      <VaModal
        v-model="showRagModal"
        hide-default-actions
        blur
        :mobileFullscreen=true
        >
        <div class="min-h-full bg-slate-100 border rounded-lg p-2" >
          <div class="flex flex-col justify-center  items-center mb-4" >
            <h3 class="font-medium flex flex-row items-center gap-2 text-lg ">
              Pergunte sobre: {{ bookToDelete }}
            </h3>
            <div class="flex flex-row items-center w-full" >
              <VaForm ref="editFormRef" class="flex flex-col w-full gap-2 justify-center items-center">
                <VaInput
                    v-model="maskedValueRag"
                    label="Pergunta"
                    :disabled="isLoading"
                    :max-length="100"
                    counter
                    class="w-full md:w-2/4"
                    strict-bind-input-value
                  />
              </VaForm>
              <VaButton
                round
                :disabled="isLoading || isDeletingCard"
                class="h-full"
                @click="startBookRag(bookIdToDelete)"
                >
                <VaIcon
                    :name="'search'"
                    color="#ffffff"
                    size="small"
                />
              </VaButton>
            </div>
            <div>
              <p>{{ragMessage}}</p>
            </div>
          </div>
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