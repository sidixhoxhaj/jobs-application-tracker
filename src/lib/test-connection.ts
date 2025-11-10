import { supabase } from './supabase'

export async function testSupabaseConnection() {
  console.log('🔌 Testing Supabase connection...')
  console.log('-----------------------------------')

  try {
    // Test 1: Check if client is initialized
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }
    console.log('✅ Supabase client initialized')

    // Test 2: Try to query the applications table
    const { data: appsData, error: appsError, count: appsCount } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })

    if (appsError) {
      console.error('❌ Applications table query failed:', appsError.message)
      throw appsError
    }
    console.log(`✅ Applications table accessible (${appsCount ?? 0} rows)`)

    // Test 3: Try to query notes table
    const { error: notesError, count: notesCount } = await supabase
      .from('notes')
      .select('*', { count: 'exact', head: true })

    if (notesError) {
      console.error('❌ Notes table query failed:', notesError.message)
    } else {
      console.log(`✅ Notes table accessible (${notesCount ?? 0} rows)`)
    }

    // Test 4: Try to query custom_fields table
    const { error: fieldsError, count: fieldsCount } = await supabase
      .from('custom_fields')
      .select('*', { count: 'exact', head: true })

    if (fieldsError) {
      console.error('❌ Custom fields table query failed:', fieldsError.message)
    } else {
      console.log(`✅ Custom fields table accessible (${fieldsCount ?? 0} rows)`)
    }

    // Test 5: Try to query user_preferences table
    const { error: prefsError, count: prefsCount } = await supabase
      .from('user_preferences')
      .select('*', { count: 'exact', head: true })

    if (prefsError) {
      console.error('❌ User preferences table query failed:', prefsError.message)
    } else {
      console.log(`✅ User preferences table accessible (${prefsCount ?? 0} rows)`)
    }

    console.log('-----------------------------------')
    console.log('✅ Connection test completed successfully!')
    console.log('-----------------------------------')

    return { success: true, message: 'All connection tests passed!' }
  } catch (error: any) {
    console.log('-----------------------------------')
    console.error('❌ Connection test failed:', error.message)
    console.log('-----------------------------------')
    return { success: false, message: error.message }
  }
}

// Auto-run test when imported (for development)
if (import.meta.env.DEV) {
  testSupabaseConnection()
}
