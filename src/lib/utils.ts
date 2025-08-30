import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}









// import { type ClassValue, clsx } from "clsx";
// import { twMerge } from "tailwind-merge";
// import { createClient } from "@supabase/supabase-js";

// // Utility for merging Tailwind classes
// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs));
// }

// // ---------------- Supabase Integration ----------------

// // Initialize Supabase client
// export const supabase = createClient(
//   import.meta.env.VITE_SUPABASE_URL!,
//   import.meta.env.VITE_SUPABASE_ANON_KEY!
// );

// /**
//  * Upload a file to Supabase Storage
//  * @param file - File to upload
//  * @param folder - optional folder, default: 'temp'
//  * @returns the file path in Supabase Storage
//  */
// export async function uploadFileToSupabase(file: File, folder = "temp") {
//   const { data, error } = await supabase.storage
//     .from("uploads")
//     .upload(`${folder}/${file.name}`, file, { upsert: true });

//   if (error) throw error;

//   return data.path;
// }

// /**
//  * Download file from Supabase Storage
//  * @param path - file path in Supabase
//  * @returns File contents as text
//  */
// export async function downloadFileFromSupabase(path: string) {
//   const { data, error } = await supabase.storage.from("uploads").download(path);

//   if (error || !data) throw error || new Error("File not found");

//   const text = await data.text();
//   return text;
// }
















