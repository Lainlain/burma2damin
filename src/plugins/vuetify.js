import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

// Tree-shaking: Only import Vuetify shell, components auto-imported by vite-plugin-vuetify
export default createVuetify({
  theme: {
    defaultTheme: 'burmaTheme',
    themes: {
      burmaTheme: {
        dark: false,
        colors: {
          primary: '#732133',
          secondary: '#D4AF37',
          accent: '#FFD700',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107',
          background: '#1a1a1a',
          surface: '#2d2d2d'
        }
      }
    }
  }
})
