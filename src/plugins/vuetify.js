import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

export default createVuetify({
  components,
  directives,
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
