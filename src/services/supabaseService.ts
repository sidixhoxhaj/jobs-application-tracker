import { supabase } from '../lib/supabase';
import type {
  Application,
  CustomField,
  UserPreference,
  ChartConfig,
  OverviewCardConfig,
  Note,
  Theme,
} from '../types';

/**
 * Get current authenticated user ID
 * Throws error if user is not authenticated
 */
const getCurrentUserId = async (): Promise<string> => {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    throw new Error('User not authenticated');
  }
  
  return user.id;
};

// ============================================================================
// APPLICATION METHODS
// ============================================================================

/**
 * Load all applications for current authenticated user
 * Fetches applications with nested notes from separate table
 */
export const loadApplications = async (): Promise<Application[]> => {
  try {
    const userId = await getCurrentUserId();

    // Load applications
    const { data: appsData, error: appsError } = await supabase
      .from('applications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (appsError) {
      console.error('Error loading applications:', appsError);
      throw appsError;
    }

    if (!appsData || appsData.length === 0) {
      return [];
    }

    // Load all notes for these applications
    const appIds = appsData.map((app: any) => app.id);
    const { data: notesData, error: notesError } = await supabase
      .from('notes')
      .select('*')
      .in('application_id', appIds)
      .order('created_at', { ascending: false });

    if (notesError) {
      console.error('Error loading notes:', notesError);
      // Don't throw - return apps without notes
    }

    // Group notes by application_id
    const notesByAppId: Record<string, Note[]> = {};
    if (notesData) {
      notesData.forEach((note: any) => {
        if (!notesByAppId[note.application_id]) {
          notesByAppId[note.application_id] = [];
        }
        notesByAppId[note.application_id].push({
          id: note.id,
          content: note.content,
          createdAt: note.created_at,
          updatedAt: note.created_at, // Supabase schema doesn't have updatedAt for notes
        });
      });
    }

    // Transform to Application format
    return appsData.map((row: any) => ({
      id: row.id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      data: row.data || {},
      notes: notesByAppId[row.id] || [],
    }));
  } catch (error) {
    console.error('Exception in loadApplications:', error);
    throw error;
  }
};

/**
 * Save a new application to Supabase
 * Also saves any notes attached to the application
 */
export const saveApplication = async (application: Application): Promise<Application> => {
  try {
    const userId = await getCurrentUserId();

    // Insert application
    const { data: appData, error: appError } = await supabase
      .from('applications')
      .insert({
        id: application.id,
        user_id: userId,
        created_at: application.createdAt,
        updated_at: application.updatedAt,
        data: application.data,
      })
      .select()
      .single();

    if (appError) {
      console.error('Error saving application:', appError);
      throw appError;
    }

    // Insert notes if any
    if (application.notes && application.notes.length > 0) {
      const notesToInsert = application.notes.map(note => ({
        id: note.id,
        application_id: application.id,
        user_id: userId,
        content: note.content,
        created_at: note.createdAt,
      }));

      const { error: notesError } = await supabase
        .from('notes')
        .insert(notesToInsert);

      if (notesError) {
        console.error('Error saving notes:', notesError);
        // Don't throw - application was saved successfully
      }
    }

    return {
      id: appData.id,
      createdAt: appData.created_at,
      updatedAt: appData.updated_at,
      data: appData.data,
      notes: application.notes || [],
    };
  } catch (error) {
    console.error('Exception in saveApplication:', error);
    throw error;
  }
};

/**
 * Update an existing application in Supabase
 * Also syncs notes (delete removed, insert new, update existing)
 */
export const updateApplication = async (application: Application): Promise<Application> => {
  try {
    const userId = await getCurrentUserId();

    // Update application
    const { data: appData, error: appError } = await supabase
      .from('applications')
      .update({
        updated_at: application.updatedAt,
        data: application.data,
      })
      .eq('id', application.id)
      .eq('user_id', userId)
      .select()
      .single();

    if (appError) {
      console.error('Error updating application:', appError);
      throw appError;
    }

    // Sync notes: delete all existing notes for this app and re-insert
    // This is simpler than tracking individual note changes
    await supabase
      .from('notes')
      .delete()
      .eq('application_id', application.id)
      .eq('user_id', userId);

    // Insert current notes
    if (application.notes && application.notes.length > 0) {
      const notesToInsert = application.notes.map(note => ({
        id: note.id,
        application_id: application.id,
        user_id: userId,
        content: note.content,
        created_at: note.createdAt,
      }));

      const { error: notesError } = await supabase
        .from('notes')
        .insert(notesToInsert);

      if (notesError) {
        console.error('Error syncing notes:', notesError);
        // Don't throw - application was updated successfully
      }
    }

    return {
      id: appData.id,
      createdAt: appData.created_at,
      updatedAt: appData.updated_at,
      data: appData.data,
      notes: application.notes || [],
    };
  } catch (error) {
    console.error('Exception in updateApplication:', error);
    throw error;
  }
};

/**
 * Delete an application from Supabase
 * Notes are automatically deleted via CASCADE in database
 */
export const deleteApplication = async (applicationId: string): Promise<void> => {
  try {
    const userId = await getCurrentUserId();

    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', applicationId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting application:', error);
      throw error;
    }
  } catch (error) {
    console.error('Exception in deleteApplication:', error);
    throw error;
  }
};

/**
 * Save all applications (bulk operation)
 * Used for initial data sync or bulk updates
 */
export const saveApplications = async (applications: Application[]): Promise<boolean> => {
  try {
    // Delete all existing applications and re-insert
    // This ensures clean sync
    const userId = await getCurrentUserId();

    // Delete existing
    await supabase
      .from('applications')
      .delete()
      .eq('user_id', userId);

    // Insert all applications
    for (const app of applications) {
      await saveApplication(app);
    }

    return true;
  } catch (error) {
    console.error('Exception in saveApplications:', error);
    return false;
  }
};

// ============================================================================
// CUSTOM FIELDS METHODS
// ============================================================================

/**
 * Load custom fields configuration for current user
 */
export const loadCustomFields = async (): Promise<CustomField[]> => {
  try {
    const userId = await getCurrentUserId();

    const { data, error } = await supabase
      .from('custom_fields')
      .select('*')
      .eq('user_id', userId)
      .order('order', { ascending: true });

    if (error) {
      console.error('Error loading custom fields:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Transform to CustomField format
    return data.map((row: any) => ({
      id: row.field_id,
      name: row.name,
      type: row.type as any,
      required: row.required,
      order: row.order,
      showInTable: row.show_in_table,
      options: row.options,
    }));
  } catch (error) {
    console.error('Exception in loadCustomFields:', error);
    throw error;
  }
};

/**
 * Save custom fields configuration (UPSERT - replaces all)
 */
export const saveCustomFields = async (fields: CustomField[]): Promise<boolean> => {
  try {
    const userId = await getCurrentUserId();

    // Delete existing fields
    await supabase
      .from('custom_fields')
      .delete()
      .eq('user_id', userId);

    // Insert new fields
    if (fields.length > 0) {
      const fieldsToInsert = fields.map(field => ({
        user_id: userId,
        field_id: field.id,
        name: field.name,
        type: field.type,
        required: field.required,
        order: field.order,
        show_in_table: field.showInTable,
        options: field.options,
      }));

      const { error } = await supabase
        .from('custom_fields')
        .insert(fieldsToInsert);

      if (error) {
        console.error('Error saving custom fields:', error);
        throw error;
      }
    }

    return true;
  } catch (error) {
    console.error('Exception in saveCustomFields:', error);
    return false;
  }
};

// ============================================================================
// PREFERENCES METHODS
// ============================================================================

/**
 * Load user preferences
 */
export const loadPreferences = async (): Promise<UserPreference> => {
  try {
    const userId = await getCurrentUserId();

    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      // If no preferences exist, return defaults
      if (error.code === 'PGRST116') {
        return {
          theme: 'light' as Theme,
          defaultPagination: 20,
        };
      }
      console.error('Error loading preferences:', error);
      throw error;
    }

    return {
      theme: data.theme as Theme,
      defaultPagination: data.default_pagination,
    };
  } catch (error) {
    console.error('Exception in loadPreferences:', error);
    // Return defaults on error
    return {
      theme: 'light' as Theme,
      defaultPagination: 20,
    };
  }
};

/**
 * Save user preferences (UPSERT)
 */
export const savePreferences = async (preferences: UserPreference): Promise<boolean> => {
  try {
    const userId = await getCurrentUserId();

    const { error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: userId,
        theme: preferences.theme,
        default_pagination: preferences.defaultPagination,
      });

    if (error) {
      console.error('Error saving preferences:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Exception in savePreferences:', error);
    return false;
  }
};

// ============================================================================
// CHART CONFIGS METHODS
// ============================================================================

/**
 * Load chart configurations
 */
export const loadChartConfigs = async (): Promise<{
  charts: ChartConfig[];
  overviewCards: OverviewCardConfig[];
}> => {
  try {
    const userId = await getCurrentUserId();

    const { data, error } = await supabase
      .from('chart_configs')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      // If no config exists, return empty arrays
      if (error.code === 'PGRST116') {
        return {
          charts: [],
          overviewCards: [],
        };
      }
      console.error('Error loading chart configs:', error);
      throw error;
    }

    return {
      charts: data.charts || [],
      overviewCards: data.overview_cards || [],
    };
  } catch (error) {
    console.error('Exception in loadChartConfigs:', error);
    // Return empty on error
    return {
      charts: [],
      overviewCards: [],
    };
  }
};

/**
 * Save chart configurations (UPSERT)
 */
export const saveChartConfigs = async (
  charts: ChartConfig[],
  overviewCards: OverviewCardConfig[]
): Promise<boolean> => {
  try {
    const userId = await getCurrentUserId();

    const { error } = await supabase
      .from('chart_configs')
      .upsert({
        user_id: userId,
        charts: charts,
        overview_cards: overviewCards,
      });

    if (error) {
      console.error('Error saving chart configs:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Exception in saveChartConfigs:', error);
    return false;
  }
};

// ============================================================================
// FIRST VISIT & DEMO DATA
// ============================================================================

/**
 * Check if authenticated user is visiting for the first time
 * Returns true if user has no applications, custom fields, or chart configs
 */
export const isFirstVisit = async (): Promise<boolean> => {
  try {
    const userId = await getCurrentUserId();

    // Check if user has any data
    const [appsData, fieldsData, configsData] = await Promise.all([
      supabase.from('applications').select('id', { count: 'exact', head: true }).eq('user_id', userId),
      supabase.from('custom_fields').select('id', { count: 'exact', head: true }).eq('user_id', userId),
      supabase.from('chart_configs').select('user_id', { count: 'exact', head: true }).eq('user_id', userId),
    ]);

    // If user has no data at all, it's their first visit
    return (
      (appsData.count === 0 || appsData.count === null) &&
      (fieldsData.count === 0 || fieldsData.count === null) &&
      (configsData.count === 0 || configsData.count === null)
    );
  } catch (error) {
    console.error('Error checking first visit:', error);
    // Default to false if there's an error
    return false;
  }
};

/**
 * Load demo data into Supabase for authenticated users
 */
export const loadDemoData = async (): Promise<boolean> => {
  try {
    const userId = await getCurrentUserId();

    // Import demo data
    const {
      DEMO_APPLICATIONS,
      DEMO_CUSTOM_FIELDS,
      DEMO_CHART_CONFIGS,
      DEMO_OVERVIEW_CARDS,
    } = await import('../data/demoData');

    // Save demo applications
    const applicationPromises = DEMO_APPLICATIONS.map(async (app) => {
      const { id, notes, createdAt, updatedAt, ...appData } = app;

      // Insert application
      const { data: insertedApp, error: appError } = await supabase
        .from('applications')
        .insert({
          user_id: userId,
          data: appData.data,
          created_at: createdAt,
          updated_at: updatedAt,
        })
        .select()
        .single();

      if (appError) {
        console.error('Error inserting application:', appError);
        return;
      }

      // Insert notes for this application
      if (notes && notes.length > 0 && insertedApp) {
        const notesData = notes.map((note) => ({
          application_id: insertedApp.id,
          user_id: userId,
          content: note.content,
          created_at: note.createdAt,
        }));

        const { error: notesError } = await supabase
          .from('notes')
          .insert(notesData);

        if (notesError) {
          console.error('Error inserting notes:', notesError);
        }
      }
    });

    // Save demo custom fields
    const fieldsData = DEMO_CUSTOM_FIELDS.map((field) => ({
      user_id: userId,
      field_id: field.id,
      name: field.name,
      type: field.type,
      required: field.required || false,
      order: field.order,
      show_in_table: field.showInTable !== false,
      options: field.options || null,
    }));

    // Save demo chart configs
    const chartConfigsPromise = supabase
      .from('chart_configs')
      .upsert({
        user_id: userId,
        charts: DEMO_CHART_CONFIGS,
        overview_cards: DEMO_OVERVIEW_CARDS,
      });

    // Save demo preferences
    const preferencesPromise = supabase
      .from('user_preferences')
      .upsert({
        user_id: userId,
        theme: 'system' as Theme,
        default_pagination: 20,
      });

    // Execute all promises
    await Promise.all([
      ...applicationPromises,
      supabase.from('custom_fields').insert(fieldsData),
      chartConfigsPromise,
      preferencesPromise,
    ]);

    console.log('Demo data loaded successfully into Supabase');
    return true;
  } catch (error) {
    console.error('Error loading demo data to Supabase:', error);
    return false;
  }
};
