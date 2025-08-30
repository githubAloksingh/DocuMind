# Document Summary Assistant

A modern, full-stack web application that uses AI to extract text from documents and generate intelligent summaries with improvement suggestions.

## Features

### Core Functionality
- **Document Upload**: Drag-and-drop support for PDF and image files (up to 10MB)
- **Text Extraction**: Advanced PDF parsing and OCR for scanned documents
- **AI Summarization**: Google Gemini-powered summaries with customizable length options
- **Improvement Suggestions**: AI-generated recommendations for document enhancement
- **Document Management**: Persistent storage with full history and search capabilities

### User Experience
- **Authentication**: Secure user accounts with Supabase Auth
- **Real-time Processing**: Live progress indicators and status updates
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Document History**: Browse and manage all processed documents
- **Intuitive Interface**: Clean, modern UI with smooth animations

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Lucide React** for icons
- **React Dropzone** for file uploads

### Backend & Database
- **Supabase** for database, authentication, and real-time features
- **PostgreSQL** with Row Level Security (RLS)

### AI & Processing
- **Google Gemini API** for text summarization and suggestions
- **PDF.js** for PDF text extraction
- **Tesseract.js** for OCR on images


## Setup Instructions

### Prerequisites
1. **Supabase Account**: Create a project at [supabase.com](https://supabase.com)
2. **Google AI API Key**: Get your key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Environment Variables
Create a `.env` file based on `.env.example`:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Gemini API Configuration  
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run database migrations through Supabase Dashboard
5. Start development server: `npm run dev`

## Architecture

### Database Schema
- **documents** table stores processed documents with metadata
- **Row Level Security** ensures users only access their own documents
- **Custom types** for file formats and summary lengths

### Processing Pipeline
1. **File Upload**: Validate file type and size
2. **Text Extraction**: PDF.js or Tesseract.js based on file type
3. **AI Processing**: Gemini API for summary generation
4. **Suggestion Generation**: AI-powered improvement recommendations
5. **Storage**: Save to Supabase with user association

### Security Features
- **Authentication**: Email/password with Supabase Auth
- **Authorization**: Row Level Security for data isolation
- **File Validation**: Type and size restrictions
- **API Protection**: Environment variable configuration

## Usage

1. **Sign Up/In**: Create an account or sign in to existing account
2. **Upload Document**: Drag and drop a PDF or image file
3. **Configure Options**: Choose summary length (short/medium/long)
4. **Generate Summary**: AI processes the document automatically
5. **Review Results**: View summary, suggestions, and original text
6. **Manage History**: Access all previously processed documents

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
- **Auth**: User authentication interface
- **FileUpload**: Drag-and-drop file upload with validation
- **ProcessingStatus**: Real-time processing feedback
- **DocumentViewer**: Tabbed interface for viewing results
- **DocumentHistory**: Browse and manage processed documents

## API Integration

### Google Gemini API
- **Model**: gemini-pro for text generation
- **Rate Limits**: Free tier limitations apply
- **Error Handling**: Comprehensive error messages and fallbacks

### Supabase Features
- **Database**: PostgreSQL with real-time capabilities
- **Authentication**: Built-in user management
- **Storage**: Secure document metadata storage
- **Real-time**: Live updates for document changes

## Contributing

This project follows modern React development practices with TypeScript, comprehensive error handling, and responsive design principles. All components are built with accessibility and performance in mind.

## License

MIT License - feel free to use this project as a foundation for your own document processing applications.