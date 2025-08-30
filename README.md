# DocuMind

A modern, full-stack web application that uses AI to extract text from documents and generate intelligent summaries with improvement suggestions.

## Features

### Core Functionality
- **Document Upload**: Drag-and-drop support for PDF and image files (up to 10MB)
- **Text Extraction**: Advanced PDF parsing and OCR for scanned documents
- **AI Summarization**: Google Gemini-powered summaries with customizable length options
- **Improvement Suggestions**: AI-generated recommendations for document enhancement
- **Document Management**: Persistent storage with full history and search capabilities

### User Experience
- **Real-time Processing**: Live progress indicators and status updates
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Intuitive Interface**: Clean, modern UI with smooth animations

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Lucide React** for icons
- **React Dropzone** for file uploads

### AI & Processing
- **Google Gemini API** for text summarization and suggestions
- **PDF.js** for PDF text extraction
- **Tesseract.js** for OCR on images


## Setup Instructions

### Prerequisites
1. **Google AI API Key**: Get your key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Environment Variables
Create a `.env` file:

```bash
# Google Gemini API Configuration  
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Start development server: `npm run dev`

## Architecture

### Processing Pipeline
1. **File Upload**: Validate file type and size
2. **Text Extraction**: PDF.js or Tesseract.js based on file type
3. **AI Processing**: Gemini API for summary generation
4. **Suggestion Generation**: AI-powered improvement recommendations
5. **Storage**: Save to Supabase with user association

### Security Features
- **File Validation**: Type and size restrictions
- **API Protection**: Environment variable configuration

## Usage

## Usage
1. **Upload Document**: Drag and drop a PDF or image file
2. **Configure Options**: Choose summary length (short/medium/long)
3. **Generate Summary**: AI processes the document automatically
4. **Review Results**: View summary, suggestions, and original text
5. **Manage History**: Access all previously processed documents

## Development

### Project Structure
```
src/
├── components/          # Reusable UI components
├── lib/                # Utilities and API clients
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

### Key Components
- **FileUpload**: Drag-and-drop file upload with validation
- **ProcessingStatus**: Real-time processing feedback
- **DocumentViewer**: Tabbed interface for viewing results

## API Integration

### Google Gemini API
- **Model**: gemini-pro for text generation
- **Rate Limits**: Free tier limitations apply
- **Error Handling**: Comprehensive error messages and fallbacks

## Contributing

This project follows modern React development practices with TypeScript, comprehensive error handling, and responsive design principles. All components are built with accessibility and performance in mind.
