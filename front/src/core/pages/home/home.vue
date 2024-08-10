<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import usersCrud from "@/core/services/usersCrud";
import { createToaster } from "@meforma/vue-toaster";

const isLoading = ref(false);
const toaster = createToaster();

const userData = ref<any[]>([]);
const firstNames = ref<Record<string, number>>({});
const lastNames = ref<Record<string, number>>({});

const getData = () => {
  isLoading.value = true;
  usersCrud.getUsers({ page: 1, per_page: 9999999 })
    .then((response) => {
      const users = response.data.data;
      userData.value = users;

      updateFirstNames(users);
      updateLastNames(users);
      updateBarChart(users);
      updatePieChartByFirstName();
      updatePieChartByLastName();
    })
    .catch(() => {
      toaster.error('Falha ao carregar os usuários.');
    })
    .finally(() => { isLoading.value = false; });
}

const updateFirstNames = (users: any[]) => {
  firstNames.value = users.reduce((acc, user) => {
    acc[user.first_name] = (acc[user.first_name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};

const updateLastNames = (users: any[]) => {
  lastNames.value = users.reduce((acc, user) => {
    acc[user.last_name] = (acc[user.last_name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};

const updateBarChart = (users: any[]) => {
  chartOptions1.value.series[0].data = [users.length];
}

const updatePieChartByFirstName = () => {
  chartOptions2.value = {
    chart: {
      type: 'pie',
      height: '100%',
      width: '100%',
      stacked: true,
    },
    series: Object.values(firstNames.value),
    labels: Object.keys(firstNames.value),
    title: {
      text: 'Distribuição de Nomes',
      align: 'center',
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#333'
      }
    },
    responsive: [{
      breakpoint: 768,
      options: {
        chart: {
          width: '90%'
        }
      }
    }, {
      breakpoint: 480,
      options: {
        chart: {
          width: '90%'
        }
      }
    }]
  };
};

const updatePieChartByLastName = () => {
  chartOptions3.value = {
    chart: {
      type: 'pie',
      height: '100%',
      width: '100%',
      stacked: true,
    },
    series: Object.values(lastNames.value),
    labels: Object.keys(lastNames.value),
    title: {
      text: 'Distribuição de Sobrenomes',
      align: 'center',
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#333'
      }
    },
    responsive: [{
      breakpoint: 768,
      options: {
        chart: {
          width: '90%'
        }
      }
    }, {
      breakpoint: 480,
      options: {
        chart: {
          width: '90%'
        }
      }
    }]
  };
};

const chartOptions1 = ref({
  chart: {
    type: 'bar',
    height: '100%',
    width: '100%',
    stacked: true,
  },
  series: [{
    name: 'Total de Usuários',
    data: [0]
  }],
  xaxis: {
    categories: ['Total de Usuários']
  },
  title: {
    text: 'Total de Usuários',
    align: 'center',
    style: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#333'
    }
  },
  responsive: [{
    breakpoint: 768,
    options: {
      chart: {
        width: '400px'
      }
    }
  }, {
    breakpoint: 480,
    options: {
      chart: {
        width: '350px'
      }
    }
  }, {
    breakpoint: 380,
    options: {
      chart: {
        width: '250px'
      }
    }
  }
  ]
});

const chartOptions2 = ref<{
  chart: {
    type: 'pie',
    height: '100%',
    width: '100%',
    stacked: true,
  };
  series: number[];
  labels: string[];
  title: {
    text: string;
    align: string;
    style: {
      fontSize: string;
      fontWeight: string;
      color: string;
    }
  };
  responsive: {
    breakpoint: number;
    options: {
      chart: {
        width: string;
      }
    }
  }[];
}>({
  chart: {
    type: 'pie',
    height: '100%',
    width: '100%',
    stacked: true,
  },
  series: [],
  labels: [],
  title: {
    text: 'Distribuição de Nomes',
    align: 'center',
    style: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#333'
    }
  },
  responsive: [{
    breakpoint: 768,
    options: {
      chart: {
        width: '600px'
      }
    }
  }, {
    breakpoint: 480,
    options: {
      chart: {
        width: '400px'
      }
    }
  }]
});

const chartOptions3 = ref<{
  chart: {
    type: 'pie',
    height: '100%',
    width: '100%',
    stacked: true,
  };
  series: number[];
  labels: string[];
  title: {
    text: string;
    align: string;
    style: {
      fontSize: string;
      fontWeight: string;
      color: string;
    }
  };
  responsive: {
    breakpoint: number;
    options: {
      chart: {
        width: string;
      }
    }
  }[];
}>({
  chart: {
    type: 'pie',
    height: '100%',
    width: '100%',
    stacked: true,
  },
  series: [],
  labels: [],
  title: {
    text: 'Distribuição de Sobrenomes',
    align: 'center',
    style: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#333'
    }
  },
  responsive: [{
    breakpoint: 768,
    options: {
      chart: {
        width: '600px'
      }
    }
  }, {
    breakpoint: 480,
    options: {
      chart: {
        width: '400px'
      }
    }
  }]
});

onMounted(() => {
  getData();
});

</script>


<template>
  <div class="flex flex-col w-screen h-screen  py-4 gap-10" >
    <div class="flex justify-center items-center" >
      <VaCard class="mt-4 px-6 py-4 rounded-lg max-w-screen w-screen mx-auto" >
        <div class="flex flex-col items-center justify-center" >
          <p class="text-center text-lg font-semibold" >Dashboard</p>
        </div>
        <div class="mb-6">
          <VaDivider />
        </div>
        <div v-if="isLoading" class="flex justify-center items-center">
          <VaProgressCircle indeterminate
          size="15rem"
          />
        </div>
        <div v-else class="mt-10 w-fit mx-auto grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-3 justify-center items-center gap-y-16 gap-x-16 mb-10" >
          <div class="w-full order-1 lg:order-2">
            <apexchart
              width="450"
              type="bar"
              :options="chartOptions1"
              :series="chartOptions1.series"
            ></apexchart>
          </div>
          <div class="w-full order-2 lg:order-1">
            <apexchart
              width="450"
              type="pie"
              :options="chartOptions2"
              :series="chartOptions2.series"
              :labels="chartOptions2.labels"
            ></apexchart>
          </div>
          <div class="w-full order-3">
            <apexchart
              width="450"
              type="pie"
              :options="chartOptions3"
              :series="chartOptions3.series"
              :labels="chartOptions3.labels"
            ></apexchart>
          </div>
        </div>
      </VaCard>
    </div>
  </div>
</template>