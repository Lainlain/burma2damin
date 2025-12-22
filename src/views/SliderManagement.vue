<template>
  <div>
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2">mdi-image-multiple</v-icon>
        Slider Management
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="openCreateDialog">
          <v-icon left>mdi-plus</v-icon>
          Add Slider
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col 
            v-for="slider in sliders" 
            :key="slider.slider_id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card>
              <v-img
                :src="slider.banner_image_url"
                height="200"
                cover
              >
                <v-chip
                  :color="slider.is_visible ? 'success' : 'error'"
                  class="ma-2"
                  size="small"
                >
                  {{ slider.is_visible ? 'Active' : 'Inactive' }}
                </v-chip>
              </v-img>
              <v-card-title>Slider {{ slider.display_order }}</v-card-title>
              <v-card-subtitle v-if="slider.banner_title">
                {{ slider.banner_title }}
              </v-card-subtitle>
              <v-card-actions>
                <v-btn 
                  color="primary" 
                  variant="text"
                  @click="editSlider(slider)"
                >
                  <v-icon left>mdi-pencil</v-icon>
                  Edit
                </v-btn>
                <v-btn 
                  color="error" 
                  variant="text"
                  @click="deleteSlider(slider)"
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

    <!-- Create/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          {{ editMode ? 'Edit Slider' : 'Create Slider' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="formData.banner_title"
              label="Title"
              required
            ></v-text-field>

            <!-- Image Upload -->
            <v-file-input
              v-model="imageFile"
              label="Upload Slider Image"
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

            <v-text-field
              v-model="formData.redirect_url"
              label="Link URL (optional)"
            ></v-text-field>

            <v-text-field
              v-model.number="formData.display_order"
              label="Display Order"
              type="number"
            ></v-text-field>

            <v-switch
              v-model="formData.is_visible"
              label="Active"
              color="success"
            ></v-switch>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="dialog = false" :disabled="uploading">Cancel</v-btn>
          <v-btn color="primary" @click="saveSlider" :loading="uploading">Save</v-btn>
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
const sliders = ref([])
const imageFile = ref(null)
const imagePreview = ref('')
const uploading = ref(false)
const uploadProgress = ref(0)

const headers = [
  { title: 'Image', key: 'image_url', sortable: false },
  { title: 'Title', key: 'title' },
  { title: 'Order', key: 'display_order' },
  { title: 'Status', key: 'is_active' },
  { title: 'Actions', key: 'actions', sortable: false }
]

const formData = ref({
  banner_title: '',
  banner_image_url: '',
  redirect_url: '',
  display_order: 0,
  is_visible: true
})

const fetchSliders = async () => {
  loading.value = true
  try {
    const response = await axios.get('/api/burma2d/sliders')
    sliders.value = response.data
  } catch (error) {
    console.error('Error fetching sliders:', error)
  } finally {
    loading.value = false
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

const openCreateDialog = () => {
  editMode.value = false
  imageFile.value = null
  imagePreview.value = ''
  formData.value = {
    banner_title: '',
    banner_image_url: '',
    redirect_url: '',
    display_order: 0,
    is_visible: true
  }
  dialog.value = true
}

const editSlider = (item) => {
  editMode.value = true
  imageFile.value = null
  imagePreview.value = item.banner_image_url
  formData.value = { ...item }
  dialog.value = true
}

const saveSlider = async () => {
  try {
    // Upload image if new file selected
    if (imageFile.value) {
      const uploadedUrl = await uploadImage()
      if (uploadedUrl) {
        formData.value.banner_image_url = uploadedUrl
      }
    }

    if (editMode.value) {
      await axios.put(`/api/admin/sliders/${formData.value.slider_id}`, formData.value)
    } else {
      await axios.post('/api/admin/sliders', formData.value)
    }
    dialog.value = false
    await fetchSliders()
  } catch (error) {
    console.error('Error saving slider:', error)
    alert('Error: ' + (error.response?.data?.error || error.message))
  }
}

const deleteSlider = async (item) => {
  if (confirm('Are you sure you want to delete this slider?')) {
    try {
      await axios.delete(`/api/admin/sliders/${item.slider_id}`)
      fetchSliders()
    } catch (error) {
      console.error('Error deleting slider:', error)
    }
  }
}

onMounted(() => {
  fetchSliders()
})
</script>
