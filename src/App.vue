<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
      color="primary"
      dark
    >
      <v-list>
        <v-list-item class="px-2 py-4">
          <v-list-item-title class="text-h6 text-center">
            🎰 Burma 2D Admin
          </v-list-item-title>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list nav>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.route"
          link
        >
          <template v-slot:prepend>
            <v-icon>{{ item.icon }}</v-icon>
          </template>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Burma 2D Admin Dashboard</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'

const drawer = ref(true)

const menuItems = [
  { title: 'Dashboard', icon: 'mdi-view-dashboard', route: '/dashboard' },
  { title: 'Gift Management', icon: 'mdi-gift', route: '/gifts' },
  { title: 'Slider Management', icon: 'mdi-image-multiple', route: '/sliders' },
  { title: 'Paper Management', icon: 'mdi-newspaper', route: '/papers' },
  { title: '3D Management', icon: 'mdi-dice-3', route: '/threed' },
  { title: 'App Config', icon: 'mdi-cellphone-cog', route: '/appconfig' }
]
</script>

<style scoped>
/* Prevent horizontal scrolling */
:deep(.v-container) {
  max-width: 100%;
  overflow-x: hidden;
}

:deep(.v-main) {
  overflow-x: hidden;
}
</style>
