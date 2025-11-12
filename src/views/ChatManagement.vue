<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">mdi-message-text</v-icon>
            Chat Management
            <v-spacer></v-spacer>
            <v-btn color="warning" @click="loadBannedUsers" class="mr-2">
              <v-icon left>mdi-account-cancel</v-icon>
              View Banned Users ({{ bannedUsers.length }})
            </v-btn>
            <v-btn color="primary" @click="loadMessages">
              <v-icon left>mdi-refresh</v-icon>
              Refresh
            </v-btn>
          </v-card-title>

          <v-card-text>
            <!-- Tab Selection -->
            <v-tabs v-model="tab" bg-color="primary">
              <v-tab value="messages">
                <v-icon left>mdi-message</v-icon>
                All Messages
              </v-tab>
              <v-tab value="banned">
                <v-icon left>mdi-account-cancel</v-icon>
                Banned Users ({{ bannedUsers.length }})
              </v-tab>
            </v-tabs>

            <!-- Messages Tab -->
            <v-window v-model="tab">
              <v-window-item value="messages">
                <v-card flat class="mt-4">
                  <v-card-text>
                    <!-- Loading -->
                    <div v-if="loading" class="text-center py-8">
                      <v-progress-circular indeterminate color="primary"></v-progress-circular>
                      <div class="mt-3">Loading messages...</div>
                    </div>

                    <!-- Messages List -->
                    <v-list v-else-if="messages.length > 0">
                      <v-list-item
                        v-for="message in messages"
                        :key="message.id"
                        class="mb-2"
                        rounded
                      >
                        <template v-slot:prepend>
                          <v-avatar>
                            <v-img v-if="message.photo_url" :src="message.photo_url"></v-img>
                            <v-icon v-else>mdi-account-circle</v-icon>
                          </v-avatar>
                        </template>

                        <v-list-item-title>
                          {{ message.username }}
                          <v-chip size="x-small" class="ml-2">{{ message.user_id }}</v-chip>
                        </v-list-item-title>
                        <v-list-item-subtitle class="mt-1">
                          {{ message.message }}
                        </v-list-item-subtitle>
                        <v-list-item-subtitle class="text-caption mt-1">
                          {{ formatDate(message.created_at) }}
                        </v-list-item-subtitle>

                        <template v-slot:append>
                          <v-btn
                            color="error"
                            variant="text"
                            @click="openBanDialog(message)"
                          >
                            <v-icon left>mdi-cancel</v-icon>
                            Ban User
                          </v-btn>
                        </template>
                      </v-list-item>
                    </v-list>

                    <!-- Empty State -->
                    <v-alert v-else type="info" variant="tonal">
                      No messages found
                    </v-alert>
                  </v-card-text>
                </v-card>
              </v-window-item>

              <!-- Banned Users Tab -->
              <v-window-item value="banned">
                <v-card flat class="mt-4">
                  <v-card-text>
                    <!-- Loading -->
                    <div v-if="loadingBanned" class="text-center py-8">
                      <v-progress-circular indeterminate color="warning"></v-progress-circular>
                      <div class="mt-3">Loading banned users...</div>
                    </div>

                    <!-- Banned Users List -->
                    <v-list v-else-if="bannedUsers.length > 0">
                      <v-list-item
                        v-for="banned in bannedUsers"
                        :key="banned.user_id"
                        class="mb-2"
                        rounded
                      >
                        <v-list-item-title>
                          {{ banned.username }}
                          <v-chip size="x-small" color="error" class="ml-2">BANNED</v-chip>
                        </v-list-item-title>
                        <v-list-item-subtitle class="mt-1">
                          <strong>User ID:</strong> {{ banned.user_id }}
                        </v-list-item-subtitle>
                        <v-list-item-subtitle>
                          <strong>Reason:</strong> {{ banned.reason }}
                        </v-list-item-subtitle>
                        <v-list-item-subtitle>
                          <strong>Banned by:</strong> {{ banned.banned_by }}
                        </v-list-item-subtitle>
                        <v-list-item-subtitle class="text-caption">
                          {{ formatDate(banned.banned_at) }}
                        </v-list-item-subtitle>

                        <template v-slot:append>
                          <v-btn
                            color="success"
                            variant="text"
                            @click="unbanUser(banned)"
                          >
                            <v-icon left>mdi-account-check</v-icon>
                            Unban
                          </v-btn>
                        </template>
                      </v-list-item>
                    </v-list>

                    <!-- Empty State -->
                    <v-alert v-else type="success" variant="tonal">
                      No banned users
                    </v-alert>
                  </v-card-text>
                </v-card>
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Ban Dialog -->
    <v-dialog v-model="banDialog" max-width="500">
      <v-card>
        <v-card-title class="bg-error">
          <v-icon left>mdi-cancel</v-icon>
          Ban User
        </v-card-title>
        <v-card-text class="mt-4">
          <v-alert type="warning" variant="tonal" class="mb-4">
            This will ban the user and delete ALL their messages permanently!
          </v-alert>

          <div class="mb-4">
            <strong>User:</strong> {{ selectedMessage?.username }} ({{ selectedMessage?.user_id }})
          </div>

          <v-textarea
            v-model="banReason"
            label="Ban Reason"
            rows="3"
            variant="outlined"
            hint="Enter the reason for banning this user"
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="banDialog = false">Cancel</v-btn>
          <v-btn color="error" @click="confirmBan" :loading="banning">
            <v-icon left>mdi-cancel</v-icon>
            Ban User
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for notifications -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ChatManagement',
  data() {
    return {
      tab: 'messages',
      messages: [],
      bannedUsers: [],
      loading: false,
      loadingBanned: false,
      banning: false,
      banDialog: false,
      selectedMessage: null,
      banReason: 'Violation of community guidelines',
      snackbar: false,
      snackbarText: '',
      snackbarColor: 'success',
    }
  },
  mounted() {
    this.loadMessages()
    this.loadBannedUsers()
  },
  methods: {
    async loadMessages() {
      this.loading = true
      try {
        // Note: This endpoint needs to be created or we use a dummy user_id
        // For admin purposes, we should create a GET /admin/messages endpoint
        const response = await axios.get('/api/burma2d/chat/messages', {
          params: {
            user_id: 'admin',
            limit: 100
          }
        })
        this.messages = response.data.messages || []
      } catch (error) {
        console.error('Error loading messages:', error)
        this.showSnackbar('Failed to load messages', 'error')
      } finally {
        this.loading = false
      }
    },

    async loadBannedUsers() {
      this.loadingBanned = true
      try {
        const response = await axios.get('/api/burma2d/chat/admin/banned')
        this.bannedUsers = response.data.banned_users || []
      } catch (error) {
        console.error('Error loading banned users:', error)
        this.showSnackbar('Failed to load banned users', 'error')
      } finally {
        this.loadingBanned = false
      }
    },

    openBanDialog(message) {
      this.selectedMessage = message
      this.banReason = 'Violation of community guidelines'
      this.banDialog = true
    },

    async confirmBan() {
      if (!this.selectedMessage) return

      this.banning = true
      try {
        const response = await axios.post('/api/burma2d/chat/admin/ban', {
          user_id: this.selectedMessage.user_id,
          reason: this.banReason,
          banned_by: 'admin'
        })

        this.showSnackbar(
          `User banned successfully. ${response.data.deleted_messages} messages deleted.`,
          'success'
        )

        // Refresh data
        this.loadMessages()
        this.loadBannedUsers()
        this.banDialog = false
      } catch (error) {
        console.error('Error banning user:', error)
        this.showSnackbar('Failed to ban user', 'error')
      } finally {
        this.banning = false
      }
    },

    async unbanUser(banned) {
      if (!confirm(`Unban ${banned.username}?`)) return

      try {
        await axios.post('/api/burma2d/chat/admin/unban', {
          user_id: banned.user_id
        })

        this.showSnackbar('User unbanned successfully', 'success')
        this.loadBannedUsers()
      } catch (error) {
        console.error('Error unbanning user:', error)
        this.showSnackbar('Failed to unban user', 'error')
      }
    },

    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleString()
    },

    showSnackbar(text, color = 'success') {
      this.snackbarText = text
      this.snackbarColor = color
      this.snackbar = true
    }
  }
}
</script>

<style scoped>
.v-list-item {
  border: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
