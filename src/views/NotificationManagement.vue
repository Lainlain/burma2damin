<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="text-h5 pa-4">
            <v-icon left color="primary">mdi-bell-ring</v-icon>
            Send Push Notification
          </v-card-title>
          <v-divider></v-divider>
          
          <v-card-text class="pa-6">
            <v-alert type="info" variant="tonal" class="mb-4">
              Notifications will be sent to all users subscribed to the "gifts" topic
            </v-alert>

            <v-form ref="form" @submit.prevent="sendNotification">
              <v-text-field
                v-model="notification.title"
                label="Notification Title"
                placeholder="e.g., Gold Coin Available"
                :rules="[v => !!v || 'Title is required']"
                variant="outlined"
                required
                class="mb-4"
              ></v-text-field>

              <v-textarea
                v-model="notification.body"
                label="Notification Message"
                placeholder="e.g., Available 🎁"
                :rules="[v => !!v || 'Message is required']"
                variant="outlined"
                rows="3"
                required
                class="mb-4"
              ></v-textarea>

              <v-btn
                type="submit"
                color="primary"
                size="large"
                :loading="loading"
                :disabled="loading"
                block
              >
                <v-icon left>mdi-send</v-icon>
                Send Notification
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Success/Error Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      location="top"
    >
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">Close</v-btn>
      </template>
    </v-snackbar>

    <!-- Recent Notifications History -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card>
          <v-card-title class="text-h6 pa-4">
            <v-icon left>mdi-history</v-icon>
            Recent Notifications
          </v-card-title>
          <v-divider></v-divider>
          
          <v-card-text>
            <v-list v-if="history.length > 0">
              <v-list-item
                v-for="(item, index) in history"
                :key="index"
                class="mb-2"
              >
                <template v-slot:prepend>
                  <v-icon color="success">mdi-check-circle</v-icon>
                </template>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
                <v-list-item-subtitle>{{ item.body }}</v-list-item-subtitle>
                <template v-slot:append>
                  <v-list-item-subtitle class="text-caption">
                    {{ item.time }}
                  </v-list-item-subtitle>
                </template>
              </v-list-item>
            </v-list>
            <v-alert v-else type="info" variant="tonal">
              No notifications sent yet
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, reactive } from 'vue'
import axios from '@/config/axios'

const form = ref(null)
const loading = ref(false)

const notification = reactive({
  title: '',
  body: ''
})

const snackbar = reactive({
  show: false,
  message: '',
  color: 'success'
})

const history = ref([])

const sendNotification = async () => {
  // Validate form
  const { valid } = await form.value.validate()
  if (!valid) return

  loading.value = true

  try {
    const response = await axios.post('/api/admin/notification', {
      title: notification.title,
      body: notification.body
    })

    // Show success message
    snackbar.message = 'Notification sent successfully! 🎉'
    snackbar.color = 'success'
    snackbar.show = true

    // Add to history
    history.value.unshift({
      title: notification.title,
      body: notification.body,
      time: new Date().toLocaleTimeString()
    })

    // Keep only last 10 notifications
    if (history.value.length > 10) {
      history.value.pop()
    }

    // Clear form
    notification.title = ''
    notification.body = ''
    form.value.reset()

  } catch (error) {
    console.error('Error sending notification:', error)
    snackbar.message = error.response?.data?.message || 'Failed to send notification'
    snackbar.color = 'error'
    snackbar.show = true
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.v-card {
  border-radius: 8px;
}
</style>
