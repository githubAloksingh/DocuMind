/*
  # Create documents table for Document Summary Assistant

  1. New Tables
    - `documents`
      - `id` (uuid, primary key)
      - `filename` (text, not null)
      - `content` (text, extracted document content)
      - `summary` (text, AI-generated summary)
      - `suggestions` (text array, improvement suggestions)
      - `file_type` ('pdf' or 'image')
      - `summary_length` ('short', 'medium', or 'long')
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamp with timezone)
      
  2. Security
    - Enable RLS on `documents` table
    - Add policies for authenticated users to manage their own documents
    - Add policy for users to read only their own documents
    - Add policy for users to insert their own documents
    - Add policy for users to update their own documents
    - Add policy for users to delete their own documents
*/

-- Create custom types for file_type and summary_length
CREATE TYPE file_type AS ENUM ('pdf', 'image');
CREATE TYPE summary_length AS ENUM ('short', 'medium', 'long');

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  content text NOT NULL,
  summary text NOT NULL DEFAULT '',
  suggestions text[] DEFAULT '{}',
  file_type file_type NOT NULL,
  summary_length summary_length NOT NULL DEFAULT 'medium',
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own documents"
  ON documents
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents"
  ON documents
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents"
  ON documents
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents"
  ON documents
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS documents_user_id_idx ON documents(user_id);
CREATE INDEX IF NOT EXISTS documents_created_at_idx ON documents(created_at DESC);
CREATE INDEX IF NOT EXISTS documents_filename_idx ON documents(filename);