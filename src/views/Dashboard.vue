<template>
  <div>
    <!-- Loading State -->
    <v-row v-if="loading" class="mt-4">
      <v-col cols="12" class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        ></v-progress-circular>
        <div class="mt-4 text-h6">Loading dashboard data...</div>
      </v-col>
    </v-row>

    <!-- Statistics Cards - 2 columns on mobile, 4 on desktop -->
    <v-row v-else>
      <v-col cols="6" md="3" v-for="stat in stats" :key="stat.title">
        <v-card elevation="2" class="stat-card">
          <v-card-text>
            <div class="d-flex align-center flex-column flex-md-row">
              <v-icon :color="stat.color" :size="$vuetify.display.mobile ? 36 : 48" class="mb-2 mb-md-0 mr-md-4">
                {{ stat.icon }}
              </v-icon>
              <div class="text-center text-md-left">
                <div :class="$vuetify.display.mobile ? 'text-h5' : 'text-h4'">{{ stat.value }}</div>
                <div :class="$vuetify.display.mobile ? 'text-caption' : 'text-subtitle-1'" class="text-grey">{{ stat.title }}</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Live Lottery Data -->
    <v-row class="mt-4" v-if="!loading">
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2" color="error">mdi-cards-playing</v-icon>
            Live Lottery Data
            <v-spacer></v-spacer>
            <v-chip color="success" variant="flat" v-if="lotteryData">
              <v-icon left size="small">mdi-circle</v-icon>
              {{ lotteryData.service_status }}
            </v-chip>
          </v-card-title>
          <v-card-text v-if="lotteryData">
            <v-row>
              <v-col cols="12" md="4">
                <div class="text-center">
                  <div class="text-caption text-grey">Draw Date</div>
                  <div class="text-h6">{{ lotteryData.draw_date }}</div>
                </div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="text-center">
                  <div class="text-caption text-grey">Live Number</div>
                  <div class="text-h4 font-weight-bold text-primary">{{ lotteryData.live_number }}</div>
                </div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="text-center">
                  <div class="text-caption text-grey">Active Viewers</div>
                  <div class="text-h6">👁 {{ lotteryData.active_viewers }}</div>
                </div>
              </v-col>
            </v-row>
            <v-divider class="my-4"></v-divider>
            <v-row>
              <v-col cols="6">
                <div class="text-center">
                  <div class="text-subtitle-2 text-grey">☀️ 12:01 PM</div>
                  <div class="text-h5 font-weight-bold">{{ lotteryData.noon_result }}</div>
                  <div class="text-caption">Set: {{ lotteryData.noon_set }}</div>
                </div>
              </v-col>
              <v-col cols="6">
                <div class="text-center">
                  <div class="text-subtitle-2 text-grey">🌙 4:30 PM</div>
                  <div class="text-h5 font-weight-bold">{{ lotteryData.evening_result }}</div>
                  <div class="text-caption">Set: {{ lotteryData.evening_set }}</div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Recent 2D History & Quick Actions -->
    <v-row class="mt-4" v-if="!loading">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-history</v-icon>
            Recent 2D History
          </v-card-title>
          <v-card-text>
            <v-list v-if="historyData.length > 0">
              <v-list-item v-for="history in historyData.slice(0, 5)" :key="history.history_id">
                <template v-slot:prepend>
                  <v-avatar color="primary" size="40">
                    <span class="text-white">{{ history.draw_date.split('/')[2] }}</span>
                  </v-avatar>
                </template>
                <v-list-item-title>{{ history.draw_date }}</v-list-item-title>
                <v-list-item-subtitle>
                  12:01 → {{ history.noon_result }} | 4:30 → {{ history.evening_result }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
            <div v-else class="text-center text-grey py-4">
              No history data available
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-lightning-bolt</v-icon>
            Quick Actions
          </v-card-title>
          <v-card-text>
            <v-btn
              block
              color="primary"
              class="mb-2"
              @click="$router.push('/gifts')"
            >
              <v-icon left>mdi-gift</v-icon>
              Manage Gifts ({{ stats.find(s => s.title === 'Total Gifts')?.value || 0 }})
            </v-btn>
            <v-btn
              block
              color="secondary"
              class="mb-2"
              @click="$router.push('/sliders')"
            >
              <v-icon left>mdi-image-multiple</v-icon>
              Manage Sliders ({{ stats.find(s => s.title === 'Active Sliders')?.value || 0 }})
            </v-btn>
            <v-btn
              block
              color="info"
              class="mb-2"
              @click="$router.push('/papers')"
            >
              <v-icon left>mdi-newspaper</v-icon>
              Manage Papers ({{ stats.find(s => s.title === 'Total Papers')?.value || 0 }})
            </v-btn>
            <v-btn
              block
              color="success"
              @click="$router.push('/threed')"
            >
              <v-icon left>mdi-dice-3</v-icon>
              Manage 3D Results ({{ stats.find(s => s.title === '3D Results')?.value || 0 }})
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const loading = ref(true)
const stats = ref([
  { title: 'Total Gifts', value: '0', icon: 'mdi-gift', color: 'primary' },
  { title: 'Active Sliders', value: '0', icon: 'mdi-image-multiple', color: 'secondary' },
  { title: 'Total Papers', value: '0', icon: 'mdi-newspaper', color: 'info' },
  { title: '3D Results', value: '0', icon: 'mdi-dice-3', color: 'success' }
])
const lotteryData = ref(null)
const historyData = ref([])

const fetchDashboardData = async () => {
  loading.value = true
  
  try {
    // Fetch gifts count
    const giftsResponse = await axios.get('/api/burma2d/gifts')
    const giftsCount = Object.values(giftsResponse.data).flat().length
    stats.value[0].value = giftsCount.toString()

    // Fetch sliders count
    const slidersResponse = await axios.get('/api/burma2d/sliders')
    const slidersCount = slidersResponse.data.filter(s => s.is_visible).length
    stats.value[1].value = slidersCount.toString()

    // Fetch papers count
    try {
      const paperTypesResponse = await axios.get('/api/burma2d/papers/types')
      let totalPapers = 0
      for (const type of paperTypesResponse.data) {
        const papersResponse = await axios.get(`/api/burma2d/papers/types/${type.type_id}/images`)
        totalPapers += papersResponse.data.length
      }
      stats.value[2].value = totalPapers.toString()
    } catch (error) {
      console.error('Error fetching papers:', error)
    }

    // Fetch 3D results count
    const threedResponse = await axios.get('/api/burma2d/3d')
    stats.value[3].value = threedResponse.data.length.toString()

    // Fetch live lottery data
    const liveResponse = await axios.get('/api/burma2d/live')
    lotteryData.value = liveResponse.data

    // Fetch recent 2D history
    const historyResponse = await axios.get('/api/burma2d/history')
    historyData.value = historyResponse.data

  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDashboardData()
  // Refresh data every 30 seconds
  setInterval(fetchDashboardData, 30000)
})
</script>

<style scoped>
.stat-card {
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
}
</style>
