import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY

// For demo mode, don't throw error if env vars are missing
export const isSupabaseAvailable = !!(supabaseUrl && supabaseAnonKey)

let supabase: any = null
if (isSupabaseAvailable) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
}

export { supabase }

// Database types
export type Database = {
  public: {
    Tables: {
      applications: {
        Row: {
          id: string
          user_id: string
          created_at: string
          updated_at: string
          data: Record<string, any>
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          updated_at?: string
          data: Record<string, any>
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          updated_at?: string
          data?: Record<string, any>
        }
      }
      notes: {
        Row: {
          id: string
          application_id: string
          user_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          application_id: string
          user_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          application_id?: string
          user_id?: string
          content?: string
          created_at?: string
        }
      }
      custom_fields: {
        Row: {
          id: string
          user_id: string
          field_id: string
          name: string
          type: string
          required: boolean
          order: number
          show_in_table: boolean
          options?: Array<any>
        }
        Insert: {
          id?: string
          user_id: string
          field_id: string
          name: string
          type: string
          required?: boolean
          order: number
          show_in_table?: boolean
          options?: Array<any>
        }
        Update: {
          id?: string
          user_id?: string
          field_id?: string
          name?: string
          type?: string
          required?: boolean
          order?: number
          show_in_table?: boolean
          options?: Array<any>
        }
      }
      user_preferences: {
        Row: {
          user_id: string
          theme: 'light' | 'dark' | 'system'
          default_pagination: 20 | 40 | 60
        }
        Insert: {
          user_id: string
          theme?: 'light' | 'dark' | 'system'
          default_pagination?: 20 | 40 | 60
        }
        Update: {
          user_id?: string
          theme?: 'light' | 'dark' | 'system'
          default_pagination?: 20 | 40 | 60
        }
      }
    }
  }
}
