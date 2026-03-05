import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── Auth helpers ────────────────────────────────────────────────
export const signUp = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } }
    });
    return { data, error };
};

export const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
};

export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
};

export const getSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
};

// ── Entrepreneur Profile ─────────────────────────────────────────
export const getProfile = async (userId) => {
    const { data, error } = await supabase
        .from('entrepreneur_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
    return { data, error };
};

export const upsertProfile = async (profile) => {
    const { data, error } = await supabase
        .from('entrepreneur_profiles')
        .upsert(profile)
        .select()
        .single();
    return { data, error };
};

// ── Diagnostic Answers ───────────────────────────────────────────
export const saveDiagnosticAnswers = async (userId, answers) => {
    const { data, error } = await supabase
        .from('diagnostic_answers')
        .upsert({ user_id: userId, answers, completed_at: new Date().toISOString() })
        .select()
        .single();
    return { data, error };
};

export const getDiagnosticAnswers = async (userId) => {
    const { data, error } = await supabase
        .from('diagnostic_answers')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false })
        .limit(1)
        .single();
    return { data, error };
};

// ── Route Tasks ──────────────────────────────────────────────────
export const getRouteTasks = async (userId) => {
    const { data, error } = await supabase
        .from('route_tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at');
    return { data, error };
};

export const updateTaskStatus = async (taskId, status) => {
    const { data, error } = await supabase
        .from('route_tasks')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', taskId)
        .select()
        .single();
    return { data, error };
};

// ── Saved Opportunities ──────────────────────────────────────────
export const getSavedOpportunities = async (userId) => {
    const { data, error } = await supabase
        .from('saved_opportunities')
        .select('*')
        .eq('user_id', userId);
    return { data, error };
};

export const toggleSavedOpportunity = async (userId, opportunityId) => {
    const { data: existing } = await supabase
        .from('saved_opportunities')
        .select('id')
        .eq('user_id', userId)
        .eq('opportunity_id', opportunityId)
        .single();

    if (existing) {
        const { error } = await supabase
            .from('saved_opportunities')
            .delete()
            .eq('id', existing.id);
        return { saved: false, error };
    } else {
        const { error } = await supabase
            .from('saved_opportunities')
            .insert({ user_id: userId, opportunity_id: opportunityId });
        return { saved: true, error };
    }
};

// ── Course Progress ──────────────────────────────────────────────
export const getCourseProgress = async (userId) => {
    const { data, error } = await supabase
        .from('course_progress')
        .select('*')
        .eq('user_id', userId);
    return { data, error };
};

export const updateCourseProgress = async (userId, courseId, progress) => {
    const { data, error } = await supabase
        .from('course_progress')
        .upsert({ user_id: userId, course_id: courseId, progress, updated_at: new Date().toISOString() })
        .select()
        .single();
    return { data, error };
};

// ── Business Profile ─────────────────────────────────────────────
export const getBusinessProfile = async (userId) => {
    const { data, error } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
    return { data, error };
};

export const upsertBusinessProfile = async (profile) => {
    const { data, error } = await supabase
        .from('business_profiles')
        .upsert(profile)
        .select()
        .single();
    return { data, error };
};
