<template>
  <v-container fluid>
    <v-card class="mx-auto" max-width="1400">
      <v-card-title class="text-subtitle-1 bg-primary text-white py-2">
        <v-icon class="mr-2" color="white" size="small">mdi-history</v-icon>
        2D History Management - Manual Save
      </v-card-title>

      <v-card-text class="mt-4">
        <!-- Load Live Data Button -->
        <v-row class="mb-4">
          <v-col cols="12">
            <v-btn
              color="primary"
              prepend-icon="mdi-download"
              @click="loadLiveData"
              :loading="loadingLiveData"
              size="large"
              block
            >
              Load Current Live Data
            </v-btn>
          </v-col>
        </v-row>

        <v-divider class="my-4"></v-divider>

        <!-- Date Input -->
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.date"
              label="Date (YYYY/MM/DD)"
              prepend-icon="mdi-calendar"
              placeholder="2026/02/18"
              variant="outlined"
              density="comfortable"
            ></v-text-field>
          </v-col>
        </v-row>

        <!-- 12:00 Section -->
        <v-card class="mb-4" variant="outlined">
          <v-card-title class="bg-blue-lighten-4 text-subtitle-2 py-2">
            <v-icon class="mr-2" size="small">mdi-clock-time-twelve</v-icon>
            12:00 Noon Data
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4">
              <v-text-field
                v-model="formData.set1200"
                label="Set (12:00)"
                prepend-icon="mdi-numeric"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="formData.value1200"
                label="Value (12:00)"
                prepend-icon="mdi-currency-usd"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="formData.result1200"
                label="Result (12:00)"
                prepend-icon="mdi-trophy"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- 4:30 Section -->
      <v-card class="mb-4" variant="outlined">
        <v-card-title class="bg-orange-lighten-4 text-subtitle-2 py-2">
          <v-icon class="mr-2" size="small">mdi-clock-time-four</v-icon>
          4:30 Evening Data
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="formData.set430"
                label="Set (4:30)"
                prepend-icon="mdi-numeric"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="formData.value430"
                label="Value (4:30)"
                prepend-icon="mdi-currency-usd"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="formData.result430"
                label="Result (4:30)"
                prepend-icon="mdi-trophy"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- 9:30 Modern/Internet Section -->
      <v-card class="mb-4" variant="outlined">
        <v-card-title class="bg-green-lighten-4 text-subtitle-2 py-2">
          <v-icon class="mr-2" size="small">mdi-clock-time-nine</v-icon>
          9:30 Morning Data
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.modern930"
                label="Modern (9:30)"
                prepend-icon="mdi-star"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.internet930"
                label="Internet (9:30)"
                prepend-icon="mdi-web"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- 2:00 Modern/Internet Section -->
      <v-card class="mb-4" variant="outlined">
        <v-card-title class="bg-purple-lighten-4 text-subtitle-2 py-2">
          <v-icon class="mr-2" size="small">mdi-clock-time-two</v-icon>
          2:00 Data
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.modern200"
                label="Modern (2:00)"
                prepend-icon="mdi-star"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.internet200"
                label="Internet (2:00)"
                prepend-icon="mdi-web"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Save Button -->
      <v-row class="mt-4">
        <v-col cols="12">
          <v-btn
            color="success"
            prepend-icon="mdi-content-save"
            @click="saveHistory"
            :loading="saving"
            size="x-large"
            block
          >
            Save History to Database
          </v-btn>
        </v-col>
      </v-row>

      <!-- Alert Messages -->
      <v-alert
        v-if="successMessage"
        type="success"
        class="mt-4"
        closable
        @click:close="successMessage = ''"
      >
        {{ successMessage }}
      </v-alert>

      <v-alert
        v-if="errorMessage"
        type="error"
        class="mt-4"
        closable
        @click:close="errorMessage = ''"
      >
        {{ errorMessage }}
      </v-alert>
    </v-card-text>
  </v-card>
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://api.shwemyanmar2d.us'

const loadingLiveData = ref(false)
const saving = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const formData = reactive({
  date: '',
  set1200: '',
  value1200: '',
  result1200: '',
  set430: '',
  value430: '',
  result430: '',
  modern930: '',
  internet930: '',
  modern200: '',
  internet200: ''
})

const rules = {
  required: value => !!value || 'Required.',
  dateFormat: value => {
    const pattern = /^\d{4}\/\d{2}\/\d{2}$/
    return pattern.test(value) || 'Date must be in YYYY/MM/DD format'
  }
}

const loadLiveData = async () => {
  loadingLiveData.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    const response = await axios.get(`${API_BASE}/api/burma2d/live`)
    // Live endpoint returns nested data object
    const liveData = response.data.data || response.data
    
    // Get today's date in YYYY/MM/DD format
    const today = new Date()
    const dateStr = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`
    
    // Populate form with live data - handle both -- and --- as empty
    formData.date = (liveData.draw_date && liveData.draw_date !== '' && liveData.draw_date !== '--') ? liveData.draw_date : dateStr
    formData.set1200 = (liveData.noon_set && liveData.noon_set !== '--' && liveData.noon_set !== '---') ? liveData.noon_set : ''
    formData.value1200 = (liveData.noon_value && liveData.noon_value !== '--' && liveData.noon_value !== '---') ? liveData.noon_value : ''
    formData.result1200 = (liveData.noon_result && liveData.noon_result !== '--' && liveData.noon_result !== '---') ? liveData.noon_result : ''
    formData.set430 = (liveData.evening_set && liveData.evening_set !== '--' && liveData.evening_set !== '---') ? liveData.evening_set : ''
    formData.value430 = (liveData.evening_value && liveData.evening_value !== '--' && liveData.evening_value !== '---') ? liveData.evening_value : ''
    formData.result430 = (liveData.evening_result && liveData.evening_result !== '--' && liveData.evening_result !== '---') ? liveData.evening_result : ''
    formData.modern930 = (liveData.morning_modern && liveData.morning_modern !== '--' && liveData.morning_modern !== '---') ? liveData.morning_modern : ''
    formData.internet930 = (liveData.morning_internet && liveData.morning_internet !== '--' && liveData.morning_internet !== '---') ? liveData.morning_internet : ''
    formData.modern200 = (liveData.afternoon_modern && liveData.afternoon_modern !== '--' && liveData.afternoon_modern !== '---') ? liveData.afternoon_modern : ''
    formData.internet200 = (liveData.afternoon_internet && liveData.afternoon_internet !== '--' && liveData.afternoon_internet !== '---') ? liveData.afternoon_internet : ''
    
    successMessage.value = '✅ Live data loaded successfully! You can now edit and save.'
  } catch (error) {
    console.error('Error loading live data:', error)
    errorMessage.value = `Failed to load live data: ${error.response?.data?.error || error.message}`
  } finally {
    loadingLiveData.value = false
  }
}

const saveHistory = async () => {
  // Validate date format
  if (!rules.dateFormat(formData.date)) {
    errorMessage.value = 'Please enter date in YYYY/MM/DD format'
    return
  }
  
  if (!formData.date) {
    errorMessage.value = 'Date is required'
    return
  }
  
  saving.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    const payload = {
      date: formData.date,
      set1200: formData.set1200,
      value1200: formData.value1200,
      result1200: formData.result1200,
      set430: formData.set430,
      value430: formData.value430,
      result430: formData.result430,
      modern930: formData.modern930,
      internet930: formData.internet930,
      modern200: formData.modern200,
      internet200: formData.internet200
    }
    
    const response = await axios.post(`${API_BASE}/api/burma2d/history/check`, payload)
    
    successMessage.value = `✅ ${response.data.message} - Date: ${response.data.date}`
    
    // Clear form after successful save
    setTimeout(() => {
      Object.keys(formData).forEach(key => {
        formData[key] = ''
      })
    }, 2000)
    
  } catch (error) {
    console.error('Error saving history:', error)
    errorMessage.value = `Failed to save history: ${error.response?.data?.error || error.message}`
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadLiveData()
})
</script>

<style scoped>
.v-card-title {
  font-weight: 600;
}
</style>
