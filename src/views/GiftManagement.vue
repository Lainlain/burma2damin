<template>
  <div>
    <!-- Gift Types Management -->
    <v-card class="mb-4">
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2">mdi-shape</v-icon>
        Gift Types
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="openTypeDialog()">
          <v-icon left>mdi-plus</v-icon>
          Add Type
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col 
            v-for="type in giftTypes" 
            :key="type.type_id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card>
              <v-card-text class="text-center">
                <div class="text-h6 mb-2">{{ type.type_name }}</div>
                <div class="text-caption text-grey">
                  {{ getGiftCountByType(type.type_name) }} gifts
                </div>
              </v-card-text>
              <v-card-actions class="justify-center">
                <v-btn 
                  icon 
                  size="small" 
                  color="primary"
                  @click="openTypeDialog(type)"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn 
                  icon 
                  size="small" 
                  color="error"
                  @click="deleteType(type)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Gift Type Tabs -->
    <v-card>
      <v-tabs v-model="selectedType" bg-color="primary" show-arrows>
        <v-tab 
          v-for="type in giftTypes" 
          :key="type.type_id"
          :value="type.type_name"
        >
          {{ type.type_name }} ({{ getGiftCountByType(type.type_name) }})
        </v-tab>
      </v-tabs>

      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2">mdi-gift</v-icon>
        {{ selectedType }} Gifts
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="openGiftDialog()">
          <v-icon left>mdi-plus</v-icon>
          Add Gift
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col 
            v-for="gift in filteredGifts" 
            :key="gift.gift_id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card>
              <v-img
                :src="gift.image_url"
                height="200"
                cover
              >
                <v-chip
                  :color="gift.is_available ? 'success' : 'error'"
                  class="ma-2"
                  size="small"
                >
                  {{ gift.is_available ? 'Active' : 'Inactive' }}
                </v-chip>
              </v-img>
              <v-card-title>{{ gift.gift_name }}</v-card-title>
              <v-card-subtitle>
                <v-chip size="small" color="primary" class="mr-2">
                  {{ gift.required_points }} pts
                </v-chip>
                <v-chip size="small" color="secondary">
                  Stock: {{ gift.available_stock }}
                </v-chip>
              </v-card-subtitle>
              <v-card-text v-if="gift.gift_description">
                {{ gift.gift_description }}
              </v-card-text>
              <v-card-actions>
                <v-btn 
                  color="primary" 
                  variant="text"
                  @click="openGiftDialog(gift)"
                >
                  <v-icon left>mdi-pencil</v-icon>
                  Edit
                </v-btn>
                <v-btn 
                  color="error" 
                  variant="text"
                  @click="deleteGift(gift)"
                >
                  <v-icon left>mdi-delete</v-icon>
                  Delete
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Gift Type Dialog -->
    <v-dialog v-model="typeDialog" max-width="500px">
      <v-card>
        <v-card-title>
          {{ typeEditMode ? 'Edit Gift Type' : 'Create Gift Type' }}
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="typeFormData.type_name"
            label="Type Name"
            required
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="typeDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="saveType">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Gift Dialog -->
    <v-dialog v-model="giftDialog" max-width="600px">
      <v-card>
        <v-card-title>
          {{ giftEditMode ? 'Edit Gift' : 'Create Gift' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="giftFormData.gift_name"
              label="Gift Name"
              required
            ></v-text-field>

            <!-- Image Upload -->
            <v-file-input
              v-model="imageFile"
              label="Upload Gift Image"
              accept="image/*"
              prepend-icon="mdi-camera"
              @change="previewImage"
              :disabled="uploading"
            ></v-file-input>

            <!-- Image Preview -->
            <v-card v-if="imagePreview" class="mb-4">
              <v-img
                :src="imagePreview"
                max-height="200"
                contain
              ></v-img>
            </v-card>

            <!-- Upload Progress -->
            <v-progress-linear
              v-if="uploading"
              :model-value="uploadProgress"
              color="primary"
              height="25"
              striped
            >
              <template v-slot:default>
                <strong>{{ Math.ceil(uploadProgress) }}%</strong>
              </template>
            </v-progress-linear>

            <!-- Gift Type Selection -->
            <v-select
              v-model="giftFormData.reward_type"
              :items="giftTypes.map(t => t.type_name)"
              label="Gift Type"
              required
            ></v-select>

            <v-textarea
              v-model="giftFormData.gift_description"
              label="Description"
              rows="3"
            ></v-textarea>

            <v-text-field
              v-model.number="giftFormData.required_points"
              label="Required Points"
              type="number"
              required
            ></v-text-field>

            <v-text-field
              v-model.number="giftFormData.available_stock"
              label="Available Stock"
              type="number"
              required
            ></v-text-field>

            <v-switch
              v-model="giftFormData.is_available"
              label="Active"
              color="success"
            ></v-switch>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="giftDialog = false" :disabled="uploading">Cancel</v-btn>
          <v-btn color="primary" @click="saveGift" :loading="uploading">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const loading = ref(false)
const gifts = ref([])
const giftTypes = ref([])
const selectedType = ref('')

// Gift Type Management
const typeDialog = ref(false)
const typeEditMode = ref(false)
const typeFormData = ref({
  type_id: null,
  type_name: ''
})

// Gift Management
const giftDialog = ref(false)
const giftEditMode = ref(false)
const imageFile = ref(null)
const imagePreview = ref('')
const uploading = ref(false)
const uploadProgress = ref(0)

const giftFormData = ref({
  gift_name: '',
  image_url: '',
  reward_type: '',
  gift_description: '',
  required_points: 0,
  available_stock: 0,
  is_available: true
})

const filteredGifts = computed(() => {
  return gifts.value.filter(g => g.reward_type === selectedType.value)
})

const getGiftCountByType = (typeName) => {
  return gifts.value.filter(g => g.reward_type === typeName).length
}

const fetchGifts = async () => {
  loading.value = true
  try {
    const response = await axios.get('/api/burma2d/gifts')
    gifts.value = Object.values(response.data).flat()
  } catch (error) {
    console.error('Error fetching gifts:', error)
  } finally {
    loading.value = false
  }
}

const fetchGiftTypes = async () => {
  try {
    const response = await axios.get('/api/admin/gift-types')
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      giftTypes.value = response.data
      if (giftTypes.value.length > 0 && !selectedType.value) {
        selectedType.value = giftTypes.value[0].type_name
      }
    } else {
      // Fallback: Get types from existing gifts
      const distinctTypes = [...new Set(gifts.value.map(g => g.reward_type))].filter(Boolean)
      giftTypes.value = distinctTypes.map((name, index) => ({
        type_id: index + 1,
        type_name: name
      }))
      if (giftTypes.value.length > 0 && !selectedType.value) {
        selectedType.value = giftTypes.value[0].type_name
      }
    }
  } catch (error) {
    console.error('Error fetching gift types:', error)
    // Fallback on error: Get types from existing gifts
    const distinctTypes = [...new Set(gifts.value.map(g => g.reward_type))].filter(Boolean)
    giftTypes.value = distinctTypes.map((name, index) => ({
      type_id: index + 1,
      type_name: name
    }))
    if (giftTypes.value.length > 0 && !selectedType.value) {
      selectedType.value = giftTypes.value[0].type_name
    }
  }
}

// Gift Type CRUD
const openTypeDialog = (type = null) => {
  if (type) {
    typeEditMode.value = true
    typeFormData.value = { ...type }
  } else {
    typeEditMode.value = false
    typeFormData.value = { type_id: null, type_name: '' }
  }
  typeDialog.value = true
}

const saveType = async () => {
  try {
    if (typeEditMode.value) {
      await axios.put(`/api/admin/gift-types/${typeFormData.value.type_id}`, typeFormData.value)
    } else {
      await axios.post('/api/admin/gift-types', typeFormData.value)
    }
    typeDialog.value = false
    await fetchGiftTypes()
  } catch (error) {
    console.error('Error saving gift type:', error)
    alert('Error: ' + (error.response?.data?.error || error.message))
  }
}

const deleteType = async (type) => {
  const giftCount = getGiftCountByType(type.type_name)
  if (giftCount > 0) {
    alert(`Cannot delete type "${type.type_name}" because it has ${giftCount} gifts. Please delete or reassign the gifts first.`)
    return
  }
  
  if (confirm(`Are you sure you want to delete type "${type.type_name}"?`)) {
    try {
      await axios.delete(`/api/admin/gift-types/${type.type_id}`)
      await fetchGiftTypes()
    } catch (error) {
      console.error('Error deleting gift type:', error)
      alert('Error: ' + (error.response?.data?.error || error.message))
    }
  }
}

const previewImage = () => {
  if (imageFile.value) {
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(imageFile.value)
  }
}

const uploadImage = async () => {
  if (!imageFile.value) return null

  const formDataUpload = new FormData()
  formDataUpload.append('image', imageFile.value)

  try {
    uploading.value = true
    const response = await axios.post('/api/admin/upload-image', formDataUpload, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        uploadProgress.value = (progressEvent.loaded / progressEvent.total) * 100
      }
    })
    return response.data.image_url
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  } finally {
    uploading.value = false
    uploadProgress.value = 0
  }
}

const openGiftDialog = (gift = null) => {
  if (gift) {
    giftEditMode.value = true
    imageFile.value = null
    imagePreview.value = gift.image_url
    giftFormData.value = { ...gift }
  } else {
    giftEditMode.value = false
    imageFile.value = null
    imagePreview.value = ''
    giftFormData.value = {
      gift_name: '',
      image_url: '',
      reward_type: selectedType.value,
      gift_description: '',
      required_points: 0,
      available_stock: 0,
      is_available: true
    }
  }
  giftDialog.value = true
}

const saveGift = async () => {
  try {
    // Upload image if new file selected
    if (imageFile.value) {
      const uploadedUrl = await uploadImage()
      if (uploadedUrl) {
        giftFormData.value.image_url = uploadedUrl
      }
    }

    if (giftEditMode.value) {
      await axios.put(`/api/admin/gifts/${giftFormData.value.gift_id}`, giftFormData.value)
    } else {
      await axios.post('/api/admin/gifts', giftFormData.value)
    }
    giftDialog.value = false
    await fetchGifts()
  } catch (error) {
    console.error('Error saving gift:', error)
    alert('Error: ' + (error.response?.data?.error || error.message))
  }
}

const deleteGift = async (item) => {
  if (confirm('Are you sure you want to delete this gift?')) {
    try {
      await axios.delete(`/api/admin/gifts/${item.gift_id}`)
      fetchGifts()
    } catch (error) {
      console.error('Error deleting gift:', error)
    }
  }
}

onMounted(async () => {
  await fetchGifts()
  await fetchGiftTypes()
})
</script>
