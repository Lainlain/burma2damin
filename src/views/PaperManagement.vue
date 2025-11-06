<template>
  <div>
    <!-- Paper Types Management -->
    <v-card class="mb-4">
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2">mdi-folder-multiple</v-icon>
        Paper Types
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="openTypeDialog()">
          <v-icon left>mdi-plus</v-icon>
          Add Type
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col 
            v-for="type in paperTypes" 
            :key="type.type_id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card 
              :color="selectedType === type.type_id ? 'primary' : ''"
              :variant="selectedType === type.type_id ? 'tonal' : 'elevated'"
              @click="selectedType = type.type_id"
              style="cursor: pointer;"
            >
              <v-card-text class="text-center">
                <div class="text-h6 mb-2">{{ type.type_name }}</div>
                <div class="text-caption">
                  {{ getPaperCountByType(type.type_id) }} images
                </div>
              </v-card-text>
              <v-card-actions class="justify-center">
                <v-btn 
                  icon 
                  size="small" 
                  color="primary"
                  @click.stop="openTypeDialog(type)"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn 
                  icon 
                  size="small" 
                  color="error"
                  @click.stop="deleteType(type)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Paper Images for Selected Type -->
    <v-card v-if="selectedType">
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2">mdi-newspaper</v-icon>
        {{ selectedTypeName }} Images
        <v-spacer></v-spacer>
        <v-btn color="secondary" @click="openBulkUploadDialog" class="mr-2">
          <v-icon left>mdi-cloud-upload</v-icon>
          Bulk Upload
        </v-btn>
        <v-btn color="error" @click="removeAllImagesFromType" :disabled="filteredPapers.length === 0">
          <v-icon left>mdi-delete-sweep</v-icon>
          Remove All Image
        </v-btn>
// Remove all images from selected type (but only delete one image)
const removeAllImagesFromType = async () => {
  if (!selectedType.value) return
  const images = papers.value.filter(p => p.type_id === selectedType.value)
  if (images.length === 0) {
    alert('No images to remove in this category.')
    return
  }
  if (confirm('Are you sure you want to remove all images from this category? (Only one image will be deleted)')) {
    // Only delete the first image in the list
    await deletePaper(images[0])
  }
}
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col 
            v-for="paper in filteredPapers" 
            :key="paper.image_id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card>
              <v-img
                :src="paper.image_url"
                height="250"
                cover
              ></v-img>
              <v-card-actions class="justify-center">
                <v-btn 
                  color="error" 
                  variant="text"
                  @click="deletePaper(paper)"
                  block
                >
                  <v-icon left>mdi-delete</v-icon>
                  Delete
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <!-- Empty State -->
        <v-alert v-if="filteredPapers.length === 0" type="info" class="mt-4">
          No images in this type yet. Click "Add Image" or "Bulk Upload" to add images.
        </v-alert>
      </v-card-text>
    </v-card>

    <!-- Empty State for No Types -->
    <v-card v-else>
      <v-card-text class="text-center py-8">
        <v-icon size="64" color="grey">mdi-folder-open-outline</v-icon>
        <div class="text-h6 mt-4 mb-2">No Paper Types</div>
        <div class="text-body-2 text-grey mb-4">Create a paper type to start adding images</div>
        <v-btn color="primary" @click="openTypeDialog()">
          <v-icon left>mdi-plus</v-icon>
          Create First Type
        </v-btn>
      </v-card-text>
    </v-card>

    <!-- Paper Type Dialog -->
    <v-dialog v-model="typeDialog" max-width="500px">
      <v-card>
        <v-card-title>
          {{ typeEditMode ? 'Edit Paper Type' : 'Create Paper Type' }}
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="typeFormData.type_name"
            label="Type Name"
            placeholder="e.g., Morning News, Evening News"
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

    <!-- Paper Image Upload Dialog -->
    <v-dialog v-model="imageDialog" max-width="600px">
      <v-card>
        <v-card-title>
          Add Paper Image
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <!-- Image Upload -->
            <v-file-input
              v-model="imageFile"
              label="Upload Paper Image"
              accept="image/*"
              prepend-icon="mdi-camera"
              @change="previewImage"
              :disabled="uploading"
              required
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
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="imageDialog = false" :disabled="uploading">Cancel</v-btn>
          <v-btn color="primary" @click="savePaper" :loading="uploading" :disabled="!imageFile">Upload</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Bulk Upload Dialog -->
    <v-dialog v-model="bulkDialog" max-width="800px">
      <v-card>
        <v-card-title>
          <v-icon class="mr-2">mdi-cloud-upload</v-icon>
          Bulk Upload Papers
        </v-card-title>
        <v-card-text>
          <v-select
            v-model="bulkFormData.type_id"
            :items="paperTypes"
            item-title="type_name"
            item-value="type_id"
            label="Select Paper Type"
            required
            class="mb-4"
          ></v-select>

          <v-file-input
            v-model="bulkImages"
            label="Select Multiple Images"
            accept="image/*"
            multiple
            prepend-icon="mdi-image-multiple"
            :disabled="bulkUploading"
            chips
            counter
            show-size
          ></v-file-input>

          <v-alert v-if="bulkImages && bulkImages.length > 0" type="info" class="mt-4">
            {{ bulkImages.length }} images selected
          </v-alert>

          <!-- Overall Progress -->
          <div v-if="bulkUploading" class="mt-4">
            <div class="text-subtitle-1 mb-2">
              Uploading: {{ bulkUploadedCount }} / {{ bulkTotalCount }}
            </div>
            <v-progress-linear
              :model-value="bulkOverallProgress"
              color="primary"
              height="25"
              striped
            >
              <template v-slot:default>
                <strong>{{ Math.ceil(bulkOverallProgress) }}%</strong>
              </template>
            </v-progress-linear>

            <!-- Current File Progress -->
            <div class="text-caption mt-2">
              Current file: {{ currentFileName }}
            </div>
            <v-progress-linear
              :model-value="bulkCurrentProgress"
              color="secondary"
              height="15"
              class="mt-1"
            >
              <template v-slot:default>
                <small>{{ Math.ceil(bulkCurrentProgress) }}%</small>
              </template>
            </v-progress-linear>
          </div>

          <!-- Upload Results -->
          <v-alert v-if="bulkUploadComplete" type="success" class="mt-4">
            ✅ Successfully uploaded {{ bulkSuccessCount }} images!
            <span v-if="bulkFailedCount > 0">
              <br>❌ Failed: {{ bulkFailedCount }} images
            </span>
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="closeBulkDialog" :disabled="bulkUploading">Cancel</v-btn>
          <v-btn 
            color="primary" 
            @click="startBulkUpload" 
            :loading="bulkUploading"
            :disabled="!bulkImages || bulkImages.length === 0 || !bulkFormData.type_id"
          >
            Upload All
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import axios from '@/config/axios'

const loading = ref(false)
const papers = ref([])
const paperTypes = ref([])
const selectedType = ref(null)

// Paper Type Management
const typeDialog = ref(false)
const typeEditMode = ref(false)
const typeFormData = ref({
  type_id: null,
  type_name: ''
})

// Paper Image Management
const imageDialog = ref(false)
const imageFile = ref(null)
const imagePreview = ref('')
const uploading = ref(false)
const uploadProgress = ref(0)

// Bulk upload states
const bulkDialog = ref(false)
const bulkImages = ref([])
const bulkUploading = ref(false)
const bulkUploadedCount = ref(0)
const bulkTotalCount = ref(0)
const bulkCurrentProgress = ref(0)
const bulkSuccessCount = ref(0)
const bulkFailedCount = ref(0)
const bulkUploadComplete = ref(false)
const currentFileName = ref('')

const bulkFormData = ref({
  type_id: null
})

const filteredPapers = computed(() => {
  if (!selectedType.value) return []
  return papers.value.filter(p => p.type_id === selectedType.value)
})

const selectedTypeName = computed(() => {
  const type = paperTypes.value.find(t => t.type_id === selectedType.value)
  return type ? type.type_name : ''
})

const bulkOverallProgress = computed(() => {
  if (bulkTotalCount.value === 0) return 0
  return (bulkUploadedCount.value / bulkTotalCount.value) * 100
})

const getPaperCountByType = (typeId) => {
  // Get count from paperTypes data (already includes image_count from backend)
  const type = paperTypes.value.find(t => t.type_id === typeId)
  return type ? type.image_count : 0
}

// Paper Type CRUD
const fetchPaperTypes = async () => {
  try {
    const response = await axios.get('/api/burma2d/papers/types')
    paperTypes.value = response.data
    if (paperTypes.value.length > 0 && !selectedType.value) {
      selectedType.value = paperTypes.value[0].type_id
    }
  } catch (error) {
    console.error('Error fetching paper types:', error)
  }
}

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
    if (!typeFormData.value.type_name || typeFormData.value.type_name.trim() === '') {
      alert('Please enter a type name')
      return
    }

    if (typeEditMode.value) {
      await axios.put(`/api/admin/paper/types/${typeFormData.value.type_id}`, {
        name: typeFormData.value.type_name,
        display_order: 0,
        is_active: true
      })
    } else {
      await axios.post('/api/admin/paper/types', {
        name: typeFormData.value.type_name,
        display_order: 0
      })
    }
    typeDialog.value = false
    await fetchPaperTypes()
  } catch (error) {
    console.error('Error saving paper type:', error)
    alert('Error: ' + (error.response?.data?.error || error.message))
  }
}

const deleteType = async (type) => {
  const paperCount = getPaperCountByType(type.type_id)
  if (paperCount > 0) {
    alert(`Cannot delete type "${type.type_name}" because it has ${paperCount} images. Please delete the images first.`)
    return
  }
  
  if (confirm(`Are you sure you want to delete type "${type.type_name}"?`)) {
    try {
      await axios.delete(`/api/admin/paper/types/${type.type_id}`)
      if (selectedType.value === type.type_id) {
        selectedType.value = null
      }
      await fetchPaperTypes()
    } catch (error) {
      console.error('Error deleting paper type:', error)
      alert('Error: ' + (error.response?.data?.error || error.message))
    }
  }
}

const fetchPapers = async () => {
  // Only fetch papers when a type is selected
  if (!selectedType.value) {
    papers.value = []
    return
  }

  loading.value = true
  try {
    // Fetch papers only for the selected type (performance optimization)
    const response = await axios.get(`/api/burma2d/papers/types/${selectedType.value}/images`)
    papers.value = response.data.map(p => ({ 
      ...p, 
      type_id: selectedType.value,
      type_name: selectedTypeName.value 
    }))
  } catch (error) {
    console.error('Error fetching papers:', error)
    papers.value = []
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

const uploadImage = async (file, onProgress) => {
  const formDataUpload = new FormData()
  formDataUpload.append('image', file)

  try {
    const response = await axios.post('/api/admin/upload-image', formDataUpload, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress
    })
    console.log('Upload response:', response.data)
    return response.data.image_url
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}

const openImageDialog = () => {
  imageFile.value = null
  imagePreview.value = ''
  imageDialog.value = true
}

const savePaper = async () => {
  try {
    if (!imageFile.value) {
      alert('Please select an image to upload')
      return
    }

    if (!selectedType.value) {
      alert('Please select a paper type first')
      return
    }

    uploading.value = true
    
    // Upload image
    const uploadedUrl = await uploadImage(imageFile.value, (progressEvent) => {
      uploadProgress.value = (progressEvent.loaded / progressEvent.total) * 100
    })
    
    if (uploadedUrl) {
      // Create paper image record
      await axios.post('/api/admin/paper/images', {
        type_id: selectedType.value,
        image_url: uploadedUrl,
        display_order: 0
      })
    }
    
    imageDialog.value = false
    imageFile.value = null
    imagePreview.value = ''
    await fetchPapers()
  } catch (error) {
    console.error('Error saving paper:', error)
    alert('Error: ' + (error.response?.data?.error || error.message))
  } finally {
    uploading.value = false
    uploadProgress.value = 0
  }
}

const deletePaper = async (item) => {
  if (confirm('Are you sure you want to delete this paper image?')) {
    try {
      await axios.delete(`/api/admin/paper/images/${item.image_id}`)
      await fetchPapers()
    } catch (error) {
      console.error('Error deleting paper:', error)
    }
  }
}

const openBulkUploadDialog = () => {
  bulkImages.value = []
  bulkUploadedCount.value = 0
  bulkTotalCount.value = 0
  bulkCurrentProgress.value = 0
  bulkSuccessCount.value = 0
  bulkFailedCount.value = 0
  bulkUploadComplete.value = false
  bulkFormData.value = {
    type_id: selectedType.value
  }
  bulkDialog.value = true
}

const closeBulkDialog = () => {
  if (!bulkUploading.value) {
    bulkDialog.value = false
    if (bulkUploadComplete.value && bulkSuccessCount.value > 0) {
      fetchPapers()
    }
  }
}

const startBulkUpload = async () => {
  if (!bulkImages.value || bulkImages.value.length === 0) {
    alert('Please select images to upload')
    return
  }

  if (!bulkFormData.value.type_id) {
    alert('Please select a paper type')
    return
  }

  bulkUploading.value = true
  bulkTotalCount.value = bulkImages.value.length
  bulkUploadedCount.value = 0
  bulkSuccessCount.value = 0
  bulkFailedCount.value = 0
  bulkUploadComplete.value = false

  for (let i = 0; i < bulkImages.value.length; i++) {
    const file = bulkImages.value[i]
    currentFileName.value = file.name

    try {
      // Upload image
      const uploadedUrl = await uploadImage(file, (progressEvent) => {
        bulkCurrentProgress.value = (progressEvent.loaded / progressEvent.total) * 100
      })

      console.log('Uploaded URL:', uploadedUrl)
      console.log('Type ID:', bulkFormData.value.type_id)

      // Create paper record
      if (uploadedUrl) {
        const response = await axios.post('/api/admin/paper/images', {
          type_id: bulkFormData.value.type_id,
          image_url: uploadedUrl,
          display_order: 0
        })
        console.log('Create response:', response)
        bulkSuccessCount.value++
      } else {
        console.error('No uploaded URL returned')
        bulkFailedCount.value++
      }
    } catch (error) {
      console.error(`Error uploading ${file.name}:`, error)
      console.error('Error details:', error.response?.data)
      bulkFailedCount.value++
    }

    bulkUploadedCount.value++
    bulkCurrentProgress.value = 0
  }

  bulkUploading.value = false
  bulkUploadComplete.value = true
  currentFileName.value = ''
  await fetchPapers()
}

// Watch selectedType and fetch papers when it changes
watch(selectedType, async (newType) => {
  if (newType) {
    await fetchPapers()
  }
})

onMounted(async () => {
  await fetchPaperTypes()
  // Don't fetch papers on mount - wait for type selection or watcher
  if (selectedType.value) {
    await fetchPapers()
  }
})
</script>
