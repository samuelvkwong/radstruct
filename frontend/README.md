# Radiology Report Structuring - Frontend

React TypeScript application for uploading and structuring radiology reports.

## Features

- **Upload Reports**: Drag-and-drop batch upload of radiology reports
- **Template Selection**: Choose from pre-built templates or custom templates
- **Real-time Progress**: Monitor processing status of report batches
- **Results Viewer**: View structured data extracted from reports
- **Template Designer**: Create custom report templates

## Tech Stack

- React 18 with TypeScript
- Tailwind CSS for styling
- React Dropzone for file uploads
- Axios for API communication

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Configuration

Create a `.env` file in the frontend directory:

```
REACT_APP_API_URL=http://localhost:8000
```

### Running Locally

```bash
npm start
```

The app will be available at http://localhost:3000

### Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── upload/          # File upload components
│   ├── templates/       # Template designer
│   └── results/         # Results viewer
├── services/
│   └── api.ts          # API client
└── App.tsx             # Main application
```

## Usage

### Uploading Reports

1. Navigate to "Upload Reports"
2. Select a template (pre-built or custom)
3. Enter a batch name
4. Drag and drop report files or click to select
5. Click "Upload and Process Reports"

### Viewing Results

1. Navigate to "View Batches"
2. Select a batch from the list
3. View processing progress
4. Click on individual reports to see structured data

### Creating Custom Templates

1. Navigate to "Design Template"
2. Enter template information
3. Add fields and subfields
4. Click "Create Template"
