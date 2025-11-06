<template>
  <div>
    <!-- Header -->
    <v-card class="mb-4">
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2">mdi-dice-3</v-icon>
        3D Results Management
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="openCreateDialog">
          <v-icon left>mdi-plus</v-icon>
          Add Result
        </v-btn>
      </v-card-title>
    </v-card>

    <!-- Loading State -->
    <v-row v-if="loading">
      <v-col cols="12" class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        ></v-progress-circular>
      </v-col>
    </v-row>

    <!-- Results Grid -->
    <v-row v-else>
      <v-col v-if="threedResults.length === 0" cols="12">
        <v-card>
          <v-card-text class="text-center pa-8">
            <v-icon size="64" color="grey">mdi-dice-3-outline</v-icon>
            <div class="text-h6 mt-4 text-grey">No 3D results yet</div>
            <div class="text-caption text-grey">Click "Add Result" to create your first 3D result</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col
        v-for="result in threedResults"
        :key="result.result_id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card elevation="1" class="result-card">
          <v-card-text class="pa-2">
            <!-- Date -->
            <div class="text-caption text-grey mb-1">
              <v-icon size="small" class="mr-1">mdi-calendar</v-icon>
              {{ result.draw_date }}
            </div>

            <!-- Result (Large Display) -->
            <div class="text-center my-2">
              <div class="text-h3 font-weight-bold result-number">
                {{ result.winning_number }}
              </div>
              <div class="text-caption text-grey mt-1">Winning Number</div>
            </div>

            <!-- Action Buttons -->
            <v-row no-gutters class="mt-2">
              <v-col cols="6" class="pr-1">
                <v-btn
                  block
                  color="primary"
                  size="small"
                  @click="editThreeD(result)"
                >
                  <v-icon left size="small">mdi-pencil</v-icon>
                  Edit
                </v-btn>
              </v-col>
              <v-col cols="6" class="pl-1">
                <v-btn
                  block
                  color="error"
                  size="small"
                  @click="deleteThreeD(result)"
                >
                  <v-icon left size="small">mdi-delete</v-icon>
                  Delete
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Create/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <v-icon class="mr-2">mdi-dice-3</v-icon>
          {{ editMode ? 'Edit 3D Result' : 'Add 3D Result' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="formData.date"
              label="Date (YYYY-MM-DD)"
              prepend-icon="mdi-calendar"
              required
              hint="Format: YYYY-MM-DD (e.g., 2025-10-30)"
              persistent-hint
              class="mb-4"
              type="date"
            ></v-text-field>

            <v-text-field
              v-model="formData.result"
              label="Winning Number"
              prepend-icon="mdi-numeric"
              required
              hint="Enter the 3D winning number"
              persistent-hint
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="saveThreeD">
            <v-icon left>mdi-content-save</v-icon>
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/config/axios'

const loading = ref(false)
const dialog = ref(false)
const editMode = ref(false)
const threedResults = ref([])

const formData = ref({
  date: '',
  result: ''
})

const fetchThreeD = async () => {
  loading.value = true
  try {
    const response = await axios.get('/api/burma2d/3d')
    console.log('3D Results:', response.data)
    threedResults.value = response.data || []
  } catch (error) {
    console.error('Error fetching 3D results:', error)
    threedResults.value = []
  } finally {
    loading.value = false
  }
}

const openCreateDialog = () => {
  editMode.value = false
  const today = new Date().toISOString().split('T')[0]
  formData.value = {
    date: today,
    result: ''
  }
  dialog.value = true
}

const editThreeD = (item) => {
  editMode.value = true
  formData.value = {
    date: item.draw_date,
    result: item.winning_number,
    result_id: item.result_id
  }
  dialog.value = true
}

const saveThreeD = async () => {
  try {
    if (editMode.value) {
      await axios.put(`/api/admin/threed/${formData.value.result_id}`, formData.value)
    } else {
      await axios.post('/api/admin/threed', formData.value)
    }
    dialog.value = false
    await fetchThreeD()
  } catch (error) {
    console.error('Error saving 3D result:', error)
    alert('Error: ' + (error.response?.data?.error || error.message))
  }
}

const deleteThreeD = async (item) => {
  if (confirm('Are you sure you want to delete this 3D result?')) {
    try {
      await axios.delete(`/api/admin/threed/${item.result_id}`)
      await fetchThreeD()
    } catch (error) {
      console.error('Error deleting 3D result:', error)
      alert('Error: ' + (error.response?.data?.error || error.message))
    }
  }
}

onMounted(() => {
  fetchThreeD()
})
</script>

<style scoped>
.result-card {
  transition: transform 0.2s, box-shadow 0.2s;
  height: 100%;
  border: 1px solid #e0e0e0;
}

.result-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15) !important;
}

.result-card .v-card-text {
  padding: 8px !important;
}

.result-number {
  color: #FFB300;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
  line-height: 1.2;
}
</style>
