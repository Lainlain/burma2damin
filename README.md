# Burma 2D Admin Dashboard

Vue 3 + Vuetify Material Design Admin Dashboard for managing Burma 2D lottery system.

## Features

- 🎯 Dashboard with statistics and quick actions
- 🎁 Gift Management (Create, Edit, Delete)
- 🖼️ Slider Management
- 📰 Paper Management
- 🎲 3D Results Management
- 📱 Responsive Material Design UI
- 🔄 Real-time API integration

## Tech Stack

- **Vue 3** - Progressive JavaScript Framework
- **Vuetify 3** - Material Design Component Framework
- **Vue Router** - Official routing
- **Pinia** - State management
- **Axios** - HTTP client
- **Vite** - Build tool

## Installation

```powershell
# Install dependencies
npm install

# Run development server (http://localhost:3000)
npm run dev

# Build for production
npm run build
```

## Configuration

The app proxies API requests to the Go server at `http://localhost:4545`.

Edit `vite.config.js` to change the API server URL if needed.

## Usage

1. Make sure the Go server is running on port 4545
2. Start the Vue admin dashboard: `npm run dev`
3. Open browser to `http://localhost:3000`
4. Navigate using the sidebar menu

## Pages

- **Dashboard** - Overview with stats and quick actions
- **Gift Management** - Add/edit/delete gift items with custom types
- **Slider Management** - Manage homepage sliders
- **Paper Management** - Manage news/paper images
- **3D Management** - Add/edit 3D lottery results

## API Endpoints Used

- `GET /api/gifts` - List all gifts
- `POST /api/admin/gifts` - Create gift
- `PUT /api/admin/gifts/:id` - Update gift
- `DELETE /api/admin/gifts/:id` - Delete gift
- Similar endpoints for sliders, papers, and 3D results

## Development

The admin dashboard is completely separate from the Android app and runs in a web browser.

Changes are hot-reloaded during development.
# burma2damin
