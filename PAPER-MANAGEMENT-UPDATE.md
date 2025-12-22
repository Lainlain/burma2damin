# Paper Management Component Update

## Date: 2024
**Component**: `Vue/src/views/PaperManagement.vue`

## Overview
Updated Paper Management component to match the correct API structure where paper types are categories that contain many images without individual titles.

## Data Structure Clarification

### Paper Structure
- **Paper Type**: A category (e.g., "Morning News", "Evening News")
  - Fields: `type_id`, `type_name`, `created_date`
- **Paper Image**: An image belonging to a type
  - Fields: `image_id`, `type_id`, `image_url`, `created_date`
  - **No individual titles** - images are identified by their URL only

### Comparison with Gifts
- **Gift**: Has both `type` (category like "Daily") AND `title` (individual name like "iPhone 15")
- **Paper**: Only has `type` (category), images don't have individual titles

## Field Mapping Changes

### Old Structure (Incorrect)
```javascript
formData: {
  Title: '',          // ❌ Papers don't have individual titles
  ImageURL: '',       // ❌ Should be image_url
  TypeID: null        // ❌ Should be type_id
}

headers: [
  { title: 'Image', key: 'ImageURL' },
  { title: 'Title', key: 'Title' },     // ❌ No title field
  { title: 'Type', key: 'TypeName' }
]
```

### New Structure (Correct)
```javascript
formData: {
  type_id: null,      // ✅ Matches Go API
  image_url: ''       // ✅ Matches Go API
}

headers: [
  { title: 'Image', key: 'image_url' },
  { title: 'Type', key: 'type_name' },
  { title: 'Created', key: 'created_date' }
]
```

## Changes Made (11 Total)

### 1. Data Table Template
- **Changed**: Display columns from `ImageURL`/`Title` to `image_url`/`type_name`
- **Added**: Type name displayed as colored chip
- **Removed**: Edit button (no individual titles to edit)

### 2. Data Table Headers
```javascript
// Before
{ title: 'Image', key: 'ImageURL' }
{ title: 'Title', key: 'Title' }
{ title: 'Type', key: 'TypeName' }

// After
{ title: 'Image', key: 'image_url' }
{ title: 'Type', key: 'type_name' }
{ title: 'Created', key: 'created_date' }
```

### 3. FormData Structure
```javascript
// Before
formData: { Title: '', ImageURL: '', TypeID: null }

// After
formData: { type_id: null, image_url: '' }
```

### 4. BulkFormData Structure
```javascript
// Before
bulkFormData: { TypeID: null }

// After
bulkFormData: { type_id: null }
```

### 5. Computed Properties
```javascript
// Before
const filteredPapers = computed(() => {
  return papers.value.filter(p => p.TypeID === selectedType.value)
})

// After
const filteredPapers = computed(() => {
  return papers.value.filter(p => p.type_id === selectedType.value)
})
```

### 6. fetchPaperTypes Function
```javascript
// Before
paperTypes.value = response.data.map(type => ({
  id: type.id,
  name: type.name
}))

// After
paperTypes.value = response.data.map(type => ({
  type_id: type.type_id,
  type_name: type.type_name
}))
```

### 7. fetchPapers Function
```javascript
// Before
const papers = await axios.get(`/api/burma2d/papers/types/${type.id}/images`)
papers.data.forEach(paper => {
  paper.TypeID = type.id
  paper.TypeName = type.name
})

// After
const response = await axios.get(`/api/burma2d/papers/types/${type.type_id}/images`)
response.data.forEach(paper => {
  paper.type_id = type.type_id
  paper.type_name = type.type_name
})
```

### 8. openCreateDialog Function
```javascript
// Before
formData.value = {
  Title: '',
  ImageURL: '',
  TypeID: selectedType.value
}

// After
formData.value = {
  type_id: selectedType.value,
  image_url: ''
}
```

### 9. savePaper Function
```javascript
// Before
await axios.post('/api/admin/papers', {
  Title: formData.value.Title,
  ImageURL: uploadedUrl,
  TypeID: formData.value.TypeID
})

// After
await axios.post('/api/admin/papers', {
  type_id: formData.value.type_id,
  image_url: uploadedUrl
})
```

### 10. deletePaper Function
```javascript
// Before
await axios.delete(`/api/admin/papers/${item.id}`)

// After
await axios.delete(`/api/admin/papers/${item.image_id}`)
```

### 11. openBulkUploadDialog Function
```javascript
// Before
bulkFormData.value = { TypeID: selectedType.value }

// After
bulkFormData.value = { type_id: selectedType.value }
```

### 12. startBulkUpload Function
```javascript
// Before
await axios.post('/api/admin/papers', {
  Title: file.name.replace(/\.[^/.]+$/, ''),
  ImageURL: uploadedUrl,
  TypeID: bulkFormData.value.TypeID
})

// After
await axios.post('/api/admin/papers', {
  type_id: bulkFormData.value.type_id,
  image_url: uploadedUrl
})
```

### 13. Bulk Upload Button Disabled Condition
```javascript
// Before
:disabled="!bulkImages || bulkImages.length === 0 || !bulkFormData.TypeID"

// After
:disabled="!bulkImages || bulkImages.length === 0 || !bulkFormData.type_id"
```

### 14. Single Paper Dialog
- **Removed**: Title text field
- **Changed**: Label from "Paper Title" to "Select Paper Type"
- **Updated**: v-select to use `item-title="type_name"` and `item-value="type_id"`

### 15. Bulk Upload Dialog
- **Updated**: v-select to use `item-title="type_name"` and `item-value="type_id"`

## API Endpoints Used

### GET `/api/burma2d/papers/types`
Returns array of paper types:
```json
[
  {
    "type_id": 1,
    "type_name": "Morning News",
    "created_date": "2024-01-01"
  }
]
```

### GET `/api/burma2d/papers/types/:id/images`
Returns array of paper images for a type:
```json
[
  {
    "image_id": 1,
    "type_id": 1,
    "image_url": "/uploads/paper123.jpg",
    "created_date": "2024-01-01"
  }
]
```

### POST `/api/admin/papers`
Create new paper image:
```json
{
  "type_id": 1,
  "image_url": "/uploads/paper123.jpg"
}
```

### DELETE `/api/admin/papers/:image_id`
Delete paper image by ID

## Features Preserved
✅ Bulk upload (100+ images)
✅ Dual progress bars (overall + per-file)
✅ Image preview before upload
✅ Type-based organization with tabs
✅ Success/failure statistics
✅ File drag-and-drop support

## Testing Checklist
- [ ] Load paper types in tabs
- [ ] Upload single paper image
- [ ] Bulk upload 10+ images
- [ ] Verify dual progress bars work
- [ ] Delete paper image
- [ ] Switch between type tabs
- [ ] Verify data table shows correct columns (image, type, created date)
- [ ] Check that no "title" field appears anywhere
- [ ] Verify paper type selection works in both dialogs

## Notes
- Paper images are now correctly treated as belonging to a type category
- No individual titles for paper images (unlike gifts which have both type and title)
- All field names now match the Go server's API structure
- Component is ready for testing with real backend API
