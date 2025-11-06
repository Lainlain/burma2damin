<template>
  <v-container fluid class="pa-6">
    <!-- Loading Overlay -->
    <v-overlay v-model="loading" class="align-center justify-center">
      <v-progress-circular
        indeterminate
        size="64"
        color="primary"
      ></v-progress-circular>
      <p class="mt-4 text-h6">Loading configuration...</p>
    </v-overlay>

    <!-- Header -->
    <v-row class="mb-4">
      <v-col>
        <h1 class="text-h4 font-weight-bold">
          <v-icon icon="mdi-cellphone-cog" size="36" class="mr-2"></v-icon>
          App Configuration Manager
        </h1>
        <p class="text-subtitle-1 text-medium-emphasis mt-2">
          Manage app updates and in-app messages for Burma 2D mobile app
        </p>
      </v-col>
      <v-col cols="auto">
        <v-btn
          color="success"
          size="large"
          prepend-icon="mdi-content-save"
          @click="saveConfiguration"
          :loading="saving"
        >
          Save Changes
        </v-btn>
      </v-col>
    </v-row>

    <!-- Alert for save status -->
    <v-alert
      v-if="saveMessage"
      :type="saveSuccess ? 'success' : 'error'"
      class="mb-4"
      closable
      @click:close="saveMessage = ''"
    >
      {{ saveMessage }}
    </v-alert>

    <!-- Main Content Tabs -->
    <v-card>
      <v-tabs v-model="tab" bg-color="primary">
        <v-tab value="version">
          <v-icon icon="mdi-update" class="mr-2"></v-icon>
          App Version
        </v-tab>
        <v-tab value="messages">
          <v-icon icon="mdi-message-alert" class="mr-2"></v-icon>
          In-App Messages
          <v-chip size="small" class="ml-2">{{ messages.length }}</v-chip>
        </v-tab>
        <v-tab value="preview">
          <v-icon icon="mdi-eye" class="mr-2"></v-icon>
          Preview
        </v-tab>
      </v-tabs>

      <v-card-text class="pa-6">
        <v-window v-model="tab">
          <!-- App Version Tab -->
          <v-window-item value="version">
            <v-row>
              <v-col cols="12" md="6">
                <v-card elevation="2">
                  <v-card-title class="bg-primary">
                    <v-icon icon="mdi-information" class="mr-2"></v-icon>
                    Version Information
                  </v-card-title>
                  <v-card-text class="pa-4">
                    <v-text-field
                      v-model="version.latest_version"
                      label="Latest Version"
                      placeholder="1.5.0"
                      prepend-icon="mdi-tag"
                      variant="outlined"
                      density="comfortable"
                      class="mb-3"
                    ></v-text-field>

                    <v-text-field
                      v-model.number="version.latest_version_code"
                      label="Latest Version Code"
                      placeholder="150"
                      prepend-icon="mdi-numeric"
                      variant="outlined"
                      density="comfortable"
                      type="number"
                      class="mb-3"
                    ></v-text-field>

                    <v-text-field
                      v-model.number="version.minimum_version_code"
                      label="Minimum Required Version Code"
                      placeholder="100"
                      prepend-icon="mdi-shield-alert"
                      variant="outlined"
                      density="comfortable"
                      type="number"
                      class="mb-3"
                      hint="Users below this version will be forced to update"
                    ></v-text-field>

                    <v-switch
                      v-model="version.force_update"
                      label="Force Update"
                      color="error"
                      hint="Block app usage if version is below minimum"
                      persistent-hint
                    ></v-switch>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" md="6">
                <v-card elevation="2">
                  <v-card-title class="bg-primary">
                    <v-icon icon="mdi-text-box" class="mr-2"></v-icon>
                    Update Dialog Content
                  </v-card-title>
                  <v-card-text class="pa-4">
                    <v-text-field
                      v-model="version.update_title"
                      label="Update Title"
                      placeholder="🎉 New Update Available!"
                      prepend-icon="mdi-format-title"
                      variant="outlined"
                      density="comfortable"
                      class="mb-3"
                    ></v-text-field>

                    <v-textarea
                      v-model="version.update_message"
                      label="Update Message"
                      placeholder="We've added exciting new features..."
                      prepend-icon="mdi-message-text"
                      variant="outlined"
                      rows="3"
                      class="mb-3"
                    ></v-textarea>

                    <v-text-field
                      v-model="version.download_url"
                      label="Download URL"
                      placeholder="https://github.com/..."
                      prepend-icon="mdi-download"
                      variant="outlined"
                      density="comfortable"
                      type="url"
                      class="mb-3"
                    ></v-text-field>

                    <v-text-field
                      v-model="version.release_date"
                      label="Release Date"
                      prepend-icon="mdi-calendar"
                      variant="outlined"
                      density="comfortable"
                      type="date"
                    ></v-text-field>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12">
                <v-card elevation="2">
                  <v-card-title class="bg-primary">
                    <v-icon icon="mdi-star-circle" class="mr-2"></v-icon>
                    What's New (Features List)
                  </v-card-title>
                  <v-card-text class="pa-4">
                    <v-list>
                      <v-list-item
                        v-for="(feature, index) in version.whats_new"
                        :key="index"
                        class="mb-2 border rounded"
                      >
                        <template v-slot:prepend>
                          <v-icon icon="mdi-checkbox-marked-circle" color="success"></v-icon>
                        </template>
                        <v-list-item-title>
                          <v-text-field
                            v-model="version.whats_new[index]"
                            variant="outlined"
                            density="compact"
                            hide-details
                          ></v-text-field>
                        </v-list-item-title>
                        <template v-slot:append>
                          <v-btn
                            icon="mdi-delete"
                            size="small"
                            color="error"
                            variant="text"
                            @click="removeFeature(index)"
                          ></v-btn>
                        </template>
                      </v-list-item>
                    </v-list>

                    <v-btn
                      color="primary"
                      prepend-icon="mdi-plus"
                      variant="outlined"
                      @click="addFeature"
                      class="mt-2"
                    >
                      Add Feature
                    </v-btn>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-window-item>

          <!-- In-App Messages Tab -->
          <v-window-item value="messages">
            <v-row class="mb-4">
              <v-col>
                <v-btn
                  color="primary"
                  prepend-icon="mdi-plus"
                  @click="openMessageDialog()"
                >
                  Add New Message
                </v-btn>
              </v-col>
            </v-row>

            <v-row>
              <v-col
                v-for="(message, index) in messages"
                :key="message.id"
                cols="12"
                md="6"
                lg="4"
              >
                <v-card elevation="2" :class="getMessageCardClass(message.type)">
                  <v-card-title class="d-flex align-center">
                    <v-chip
                      :color="getMessageTypeColor(message.type)"
                      size="small"
                      class="mr-2"
                    >
                      {{ message.type.toUpperCase() }}
                    </v-chip>
                    <span class="text-truncate">{{ message.title }}</span>
                  </v-card-title>

                  <v-card-subtitle>
                    Priority: {{ message.priority }} | ID: {{ message.id }}
                  </v-card-subtitle>

                  <v-card-text>
                    <p class="text-body-2 mb-3">{{ message.message }}</p>

                    <v-chip-group column>
                      <v-chip size="small" prepend-icon="mdi-calendar-start">
                        {{ message.start_date }}
                      </v-chip>
                      <v-chip size="small" prepend-icon="mdi-calendar-end">
                        {{ message.end_date }}
                      </v-chip>
                      <v-chip
                        v-if="message.show_once"
                        size="small"
                        color="info"
                        prepend-icon="mdi-eye-check"
                      >
                        Show Once
                      </v-chip>
                      <v-chip
                        v-if="message.dismissible"
                        size="small"
                        color="success"
                        prepend-icon="mdi-close-circle"
                      >
                        Dismissible
                      </v-chip>
                    </v-chip-group>

                    <div v-if="message.action_text" class="mt-3">
                      <v-icon icon="mdi-cursor-pointer" size="small"></v-icon>
                      <span class="text-caption ml-1">
                        Action: {{ message.action_text }}
                      </span>
                    </div>
                  </v-card-text>

                  <v-card-actions>
                    <v-btn
                      color="primary"
                      variant="text"
                      prepend-icon="mdi-pencil"
                      @click="openMessageDialog(message, index)"
                    >
                      Edit
                    </v-btn>
                    <v-btn
                      color="error"
                      variant="text"
                      prepend-icon="mdi-delete"
                      @click="deleteMessage(index)"
                    >
                      Delete
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-window-item>

          <!-- Preview Tab -->
          <v-window-item value="preview">
            <v-row>
              <v-col cols="12" md="6">
                <v-card elevation="2">
                  <v-card-title class="bg-info">
                    <v-icon icon="mdi-cellphone" class="mr-2"></v-icon>
                    Update Dialog Preview
                  </v-card-title>
                  <v-card-text class="pa-6" style="background: #1a1a2e;">
                    <div style="background: #0f3460; border-radius: 12px; padding: 24px; color: white;">
                      <div class="text-center mb-4">
                        <v-icon icon="mdi-update" size="48" color="#FFD700"></v-icon>
                      </div>
                      <h3 class="text-h5 text-center mb-2" style="color: #FFD700;">
                        {{ version.update_title }}
                      </h3>
                      <p class="text-center mb-4">{{ version.update_message }}</p>
                      
                      <div class="mb-4 pa-3" style="background: #1a1a2e; border-radius: 8px;">
                        <div class="d-flex justify-space-between mb-2">
                          <span class="text-caption">Your Version:</span>
                          <span class="text-caption font-weight-bold">1.0.0 (100)</span>
                        </div>
                        <v-icon icon="mdi-arrow-down" size="small" class="d-block mx-auto"></v-icon>
                        <div class="d-flex justify-space-between mt-2">
                          <span class="text-caption">Latest Version:</span>
                          <span class="text-caption font-weight-bold" style="color: #FFD700;">
                            {{ version.latest_version }} ({{ version.latest_version_code }})
                          </span>
                        </div>
                      </div>

                      <div class="mb-4">
                        <p class="font-weight-bold mb-2" style="color: #FFD700;">What's New:</p>
                        <ul style="padding-left: 20px;">
                          <li v-for="(feature, i) in version.whats_new" :key="i" class="mb-1">
                            {{ feature }}
                          </li>
                        </ul>
                      </div>

                      <v-btn block color="#FFD700" style="color: #1a1a2e;" size="large">
                        <v-icon icon="mdi-download" class="mr-2"></v-icon>
                        Download Update
                      </v-btn>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" md="6">
                <v-card elevation="2">
                  <v-card-title class="bg-info">
                    <v-icon icon="mdi-message" class="mr-2"></v-icon>
                    In-App Message Preview (Highest Priority)
                  </v-card-title>
                  <v-card-text class="pa-6" style="background: #1a1a2e;">
                    <div v-if="messages.length > 0" style="background: #0f3460; border-radius: 12px; padding: 24px; color: white;">
                      <div class="d-flex align-center mb-3">
                        <v-chip
                          :color="getMessageTypeColor(highestPriorityMessage.type)"
                          size="small"
                        >
                          {{ highestPriorityMessage.type.toUpperCase() }}
                        </v-chip>
                        <v-spacer></v-spacer>
                        <v-btn icon="mdi-close" size="small" variant="text"></v-btn>
                      </div>

                      <h4 class="text-h6 mb-3">{{ highestPriorityMessage.title }}</h4>
                      <p class="mb-4">{{ highestPriorityMessage.message }}</p>

                      <div v-if="highestPriorityMessage.action_text" class="text-center">
                        <v-btn
                          :color="getMessageTypeColor(highestPriorityMessage.type)"
                          block
                          size="large"
                        >
                          {{ highestPriorityMessage.action_text }}
                        </v-btn>
                      </div>
                    </div>
                    <div v-else class="text-center py-8">
                      <v-icon icon="mdi-message-off" size="64" color="grey"></v-icon>
                      <p class="text-grey mt-2">No messages to preview</p>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>

    <!-- Message Edit Dialog -->
    <v-dialog v-model="messageDialog" max-width="800px">
      <v-card>
        <v-card-title class="bg-primary">
          <v-icon icon="mdi-message-edit" class="mr-2"></v-icon>
          {{ editingMessageIndex === null ? 'Add New Message' : 'Edit Message' }}
        </v-card-title>

        <v-card-text class="pa-6">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="editingMessage.id"
                label="Message ID"
                placeholder="promo_nov_2025"
                prepend-icon="mdi-identifier"
                variant="outlined"
                density="comfortable"
                :disabled="editingMessageIndex !== null"
                hint="Unique identifier (cannot be changed after creation)"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-select
                v-model="editingMessage.type"
                label="Message Type"
                :items="['info', 'warning', 'promo', 'alert']"
                prepend-icon="mdi-tag"
                variant="outlined"
                density="comfortable"
              ></v-select>
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="editingMessage.title"
                label="Title"
                placeholder="🎉 Special Offer!"
                prepend-icon="mdi-format-title"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="editingMessage.message"
                label="Message"
                placeholder="Full message content..."
                prepend-icon="mdi-message-text"
                variant="outlined"
                rows="3"
              ></v-textarea>
            </v-col>

            <v-col cols="12">
              <v-card variant="outlined" class="mb-2">
                <v-card-text>
                  <div class="d-flex align-center justify-space-between mb-2">
                    <label class="text-subtitle-2 font-weight-bold">
                      <v-icon icon="mdi-image" size="small" class="mr-1"></v-icon>
                      Message Image (Optional)
                    </label>
                  </div>
                  
                  <!-- Image Preview -->
                  <div v-if="editingMessage.image_url" class="mb-3 text-center">
                    <v-img
                      :src="editingMessage.image_url"
                      max-height="200"
                      contain
                      class="rounded mb-2"
                    ></v-img>
                    <v-btn
                      size="small"
                      color="error"
                      variant="text"
                      prepend-icon="mdi-delete"
                      @click="editingMessage.image_url = ''"
                    >
                      Remove Image
                    </v-btn>
                  </div>

                  <!-- Upload Button -->
                  <v-file-input
                    v-model="messageImageFile"
                    label="Upload Image"
                    prepend-icon="mdi-camera"
                    variant="outlined"
                    density="comfortable"
                    accept="image/*"
                    @change="uploadMessageImage"
                    :loading="uploadingMessageImage"
                    hint="Upload an image for this message"
                    persistent-hint
                  ></v-file-input>

                  <!-- Manual URL Input -->
                  <v-text-field
                    v-model="editingMessage.image_url"
                    label="Or Enter Image URL Manually"
                    placeholder="http://localhost:4545/uploads/message.jpg"
                    prepend-icon="mdi-link"
                    variant="outlined"
                    density="comfortable"
                    type="url"
                    class="mt-3"
                  ></v-text-field>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="editingMessage.priority"
                label="Priority"
                placeholder="10"
                prepend-icon="mdi-sort-numeric-ascending"
                variant="outlined"
                density="comfortable"
                type="number"
                hint="Higher number = higher priority"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="editingMessage.start_date"
                label="Start Date"
                prepend-icon="mdi-calendar-start"
                variant="outlined"
                density="comfortable"
                type="date"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="editingMessage.end_date"
                label="End Date"
                prepend-icon="mdi-calendar-end"
                variant="outlined"
                density="comfortable"
                type="date"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="editingMessage.action_text"
                label="Action Button Text (Optional)"
                placeholder="Learn More"
                prepend-icon="mdi-cursor-pointer"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="editingMessage.action_url"
                label="Action Button URL (Optional)"
                placeholder="http://localhost:4545"
                prepend-icon="mdi-link"
                variant="outlined"
                density="comfortable"
                type="url"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-switch
                v-model="editingMessage.show_once"
                label="Show Once"
                color="info"
                hint="Message won't show again after dismissal"
              ></v-switch>
            </v-col>

            <v-col cols="12" md="6">
              <v-switch
                v-model="editingMessage.dismissible"
                label="Dismissible"
                color="success"
                hint="User can close the message"
              ></v-switch>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="messageDialog = false">
            Cancel
          </v-btn>
          <v-btn color="primary" variant="elevated" @click="saveInAppMessage">
            {{ editingMessageIndex === null ? 'Add Message' : 'Save Changes' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from '@/config/axios'

const tab = ref('version')
const saving = ref(false)
const saveMessage = ref('')
const saveSuccess = ref(false)

// App Version Data
const version = ref({
  latest_version: '1.5.0',
  latest_version_code: 150,
  minimum_version_code: 100,
  force_update: false,
  update_title: '🎉 New Update Available!',
  update_message: "We've added exciting new features and improvements to enhance your experience!",
  download_url: 'https://github.com/Lainlain/burma2daio/releases/latest',
  whats_new: [],
  release_date: new Date().toISOString().split('T')[0]
})

// In-App Messages Data
const messages = ref([])

// Message Dialog
const messageDialog = ref(false)
const editingMessage = ref({})
const editingMessageIndex = ref(null)

// Image Upload for Messages
const messageImageFile = ref(null)
const uploadingMessageImage = ref(false)

// AppConfig Server URL - ONLY use standalone server on port 8080
const CONFIG_API_URL = import.meta.env.VITE_CONFIG_SERVER_URL || 'http://localhost:8080/api/burma2d'

// Main Server URL for image uploads (port 4545)
const MAIN_SERVER_URL = import.meta.env.VITE_MAIN_SERVER_URL || 'http://localhost:4545'

// Loading state
const loading = ref(false)

// Computed
const highestPriorityMessage = computed(() => {
  if (messages.value.length === 0) return null
  return [...messages.value].sort((a, b) => b.priority - a.priority)[0]
})

// Methods
const getMessageTypeColor = (type) => {
  const colors = {
    info: 'blue',
    warning: 'orange',
    promo: 'amber',
    alert: 'red'
  }
  return colors[type] || 'grey'
}

const getMessageCardClass = (type) => {
  const classes = {
    info: 'border-s-lg border-blue',
    warning: 'border-s-lg border-orange',
    promo: 'border-s-lg border-amber',
    alert: 'border-s-lg border-red'
  }
  return classes[type] || ''
}

const addFeature = () => {
  version.value.whats_new.push('✨ New feature')
}

const removeFeature = (index) => {
  version.value.whats_new.splice(index, 1)
}

const openMessageDialog = (message = null, index = null) => {
  if (message) {
    editingMessage.value = { ...message }
    editingMessageIndex.value = index
  } else {
    editingMessage.value = {
      id: '',
      type: 'info',
      title: '',
      message: '',
      image_url: '',
      action_text: '',
      action_url: '',
      priority: 5,
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      show_once: false,
      dismissible: true
    }
    editingMessageIndex.value = null
  }
  messageDialog.value = true
}

const saveInAppMessage = () => {
  if (editingMessageIndex.value !== null) {
    messages.value[editingMessageIndex.value] = { ...editingMessage.value }
  } else {
    messages.value.push({ ...editingMessage.value })
  }
  messageDialog.value = false
}

const deleteMessage = (index) => {
  if (confirm('Are you sure you want to delete this message?')) {
    messages.value.splice(index, 1)
  }
}

// Upload message image to main server
const uploadMessageImage = async (event) => {
  const files = event.target.files || event
  if (!files || files.length === 0) return

  const file = files[0]
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file')
    return
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('Image size must be less than 5MB')
    return
  }

  uploadingMessageImage.value = true
  
  try {
    const formData = new FormData()
    formData.append('image', file)

    // Upload to main server (port 4545) - using admin upload endpoint
    const response = await axios.post(`${MAIN_SERVER_URL}/api/admin/upload-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    // Auto-fill the image URL field
    if (response.data.image_url) {
      editingMessage.value.image_url = response.data.image_url
      console.log('✅ Image uploaded successfully:', response.data.image_url)
    }
    
    // Clear the file input
    messageImageFile.value = null
    
  } catch (error) {
    console.error('❌ Failed to upload image:', error)
    alert('Failed to upload image: ' + (error.response?.data?.error || error.message))
  } finally {
    uploadingMessageImage.value = false
  }
}

const loadConfiguration = async () => {
  loading.value = true
  try {
    const response = await axios.get(`${CONFIG_API_URL}/config`)
    const config = response.data
    
    version.value = config.app_version
    messages.value = config.in_app_messages || []
    
    console.log('✅ Configuration loaded from AppConfig server (port 8080):', config)
  } catch (error) {
    console.error('❌ Failed to load from AppConfig server:', error)
    saveMessage.value = 'Failed to load configuration: ' + error.message
    saveSuccess.value = false
  } finally {
    loading.value = false
  }
}

const saveConfiguration = async () => {
  saving.value = true
  saveMessage.value = ''
  
  try {
    const config = {
      app_version: version.value,
      in_app_messages: messages.value
    }
    
    const response = await axios.post(`${CONFIG_API_URL}/config`, config)
    
    saveMessage.value = '✅ Configuration saved successfully to AppConfig server!'
    saveSuccess.value = true
    
    console.log('✅ Configuration saved to AppConfig server (port 8080):', response.data)
  } catch (error) {
    console.error('❌ Failed to save configuration:', error)
    saveMessage.value = 'Failed to save configuration: ' + error.message
    saveSuccess.value = false
  } finally {
    saving.value = false
  }
}

// Load config on mount
onMounted(() => {
  loadConfiguration()
})
</script>

<style scoped>
.border-s-lg {
  border-left: 4px solid;
}

.v-card-title {
  font-weight: bold;
}
</style>
