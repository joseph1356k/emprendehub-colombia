import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import {
  DEFAULT_TASKS,
  MOCK_OPPORTUNITIES,
  TASK_DOCUMENT_RULES,
} from '../data/mockData';

const AppContext = createContext(null);

const STAGE_SECTION_WEIGHT = {
  Idea: { 'Producto / Servicio': 28, Formalizacion: 22, Mercadeo: 16, Financiero: 14, Inversion: 8 },
  Validacion: { 'Producto / Servicio': 26, Mercadeo: 20, Financiero: 18, Formalizacion: 14, Inversion: 10 },
  Traccion: { Mercadeo: 24, Financiero: 20, Inversion: 20, 'Producto / Servicio': 14, Formalizacion: 8 },
  Crecimiento: { Inversion: 24, Mercadeo: 20, Financiero: 18, 'Producto / Servicio': 14, Formalizacion: 8 },
  Escalamiento: { Inversion: 28, Financiero: 20, Mercadeo: 16, 'Producto / Servicio': 12, Formalizacion: 6 },
};

const STATUS_SCORE = { bloqueado: 40, 'en progreso': 12, pendiente: 8, completado: -200 };
const PRIORITY_SCORE = { Alta: 12, Media: 8, Baja: 4 };
const DEADLINE_SOON_SCORE = 25;
const STAGE_RELEVANCE_SCORE = 15;
const QUICK_WIN_SCORE = 10;
const MAX_NOTIFICATIONS_PER_DAY = 3;
const TASK_DEFAULT_DUE_BY_TITLE = DEFAULT_TASKS.reduce((acc, item) => {
  acc[item.title] = item.due_in_days;
  return acc;
}, {});

const todayKey = () => new Date().toISOString().slice(0, 10);
const userLocalKey = (prefix, userId) => `${prefix}_${userId}`;
const getDayDiff = (isoDate) => {
  if (!isoDate) return null;
  const ms = new Date(isoDate).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0);
  return Math.round(ms / 86400000);
};

const canUseTable = (error) => {
  if (!error) return true;
  const code = String(error.code || '');
  const message = String(error.message || '');
  return !(
    code === '42P01' ||
    code === 'PGRST205' ||
    code === 'PGRST204' ||
    message.includes('Could not find the table') ||
    message.includes('schema cache')
  );
};

const parseDeadlineDays = (task) => {
  if (task.due_date) return getDayDiff(task.due_date);
  const fallbackDue = TASK_DEFAULT_DUE_BY_TITLE[task.title];
  if (typeof fallbackDue === 'number') return fallbackDue;
  return null;
};

const taskRequirement = (task) => TASK_DOCUMENT_RULES[task?.title] || null;
const normalizeStage = (stage) => {
  const map = {
    'Validación': 'Validacion',
    'Tracción': 'Traccion',
  };
  return map[stage] || stage || 'Idea';
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

export function AppProvider({ children, session }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [diagnosticAnswers, setDiagnosticAnswers] = useState(null);
  const [diagnosticCompleted, setDiagnosticCompleted] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [savedOpportunities, setSavedOpportunities] = useState([]);
  const [savedProviders, setSavedProviders] = useState([]);
  const [courseProgress, setCourseProgress] = useState({});
  const [businessProfile, setBusinessProfile] = useState(null);
  const [activityEvents, setActivityEvents] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [mutedNotificationTypes, setMutedNotificationTypes] = useState([]);
  const [toast, setToast] = useState(null);

  const supportsSavedProvidersRef = useRef(true);
  const supportsActivityEventsRef = useRef(true);
  const supportsDocumentsRef = useRef(true);
  const supportsNotificationsRef = useRef(true);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3200);
  }, []);

  const determineStage = useCallback((answers) => {
    const map = {
      idea: 'Idea',
      validando: 'Validacion',
      vendiendo: 'Traccion',
      creciendo: 'Crecimiento',
      escalando: 'Escalamiento',
    };
    return map[answers?.etapa] || 'Idea';
  }, []);

  const persistLocal = useCallback((key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // noop
    }
  }, []);

  const readLocal = useCallback((key, fallback = []) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }, []);

  const addActivity = useCallback(
    async (description, icon = '?') => {
      if (!session?.user) return;
      const event = {
        id: Date.now(),
        user_id: session.user.id,
        description,
        icon,
        created_at: new Date().toISOString(),
      };

      setActivityEvents((prev) => {
        const updated = [event, ...prev].slice(0, 80);
        persistLocal(userLocalKey('events', session.user.id), updated);
        return updated;
      });

      if (supportsActivityEventsRef.current) {
        const { error } = await supabase
          .from('activity_events')
          .insert({
            user_id: event.user_id,
            description: event.description,
            icon: event.icon,
            created_at: event.created_at,
          });
        if (error && !canUseTable(error)) {
          supportsActivityEventsRef.current = false;
        }
      }
    },
    [persistLocal, session?.user]
  );

  const markNotificationRead = useCallback(async (notificationId) => {
    if (!session?.user) return;
    setNotifications((prev) => {
      const updated = prev.map((item) => (item.id === notificationId ? { ...item, read: true } : item));
      persistLocal(userLocalKey('notifications', session.user.id), updated);
      return updated;
    });

    if (supportsNotificationsRef.current) {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
      if (error && !canUseTable(error)) supportsNotificationsRef.current = false;
    }
  }, [persistLocal, session?.user]);

  const markAllNotificationsRead = useCallback(async () => {
    if (!session?.user) return;
    setNotifications((prev) => {
      const updated = prev.map((item) => ({ ...item, read: true }));
      persistLocal(userLocalKey('notifications', session.user.id), updated);
      return updated;
    });

    if (supportsNotificationsRef.current) {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', session.user.id)
        .eq('read', false);
      if (error && !canUseTable(error)) supportsNotificationsRef.current = false;
    }
  }, [persistLocal, session?.user]);

  const muteNotificationType = useCallback(
    (type) => {
      if (!session?.user) return;
      setMutedNotificationTypes((prev) => {
        if (prev.includes(type)) return prev;
        const updated = [...prev, type];
        persistLocal(userLocalKey('muted_notification_types', session.user.id), updated);
        return updated;
      });
    },
    [persistLocal, session?.user]
  );

  const unmuteNotificationType = useCallback(
    (type) => {
      if (!session?.user) return;
      setMutedNotificationTypes((prev) => {
        const updated = prev.filter((item) => item !== type);
        persistLocal(userLocalKey('muted_notification_types', session.user.id), updated);
        return updated;
      });
    },
    [persistLocal, session?.user]
  );

  const createNotification = useCallback(
    async ({ title, message, type, dedupeKey, force = false }) => {
      if (!session?.user || !title) return null;
      if (mutedNotificationTypes.includes(type)) return null;

      const now = new Date();
      const todayIso = now.toISOString().slice(0, 10);

      const dailyCount = notifications.filter(
        (item) => item.created_at?.slice(0, 10) === todayIso
      ).length;
      if (!force && dailyCount >= MAX_NOTIFICATIONS_PER_DAY) return null;

      const duplicate = notifications.find(
        (item) => item.type === type && item.dedupe_key === dedupeKey && !item.read
      );
      if (duplicate) return duplicate;

      const payload = {
        user_id: session.user.id,
        title,
        message,
        type,
        dedupe_key: dedupeKey || `${type}-${title}`,
        read: false,
      };

      let data = null;
      let error = null;
      if (supportsNotificationsRef.current) {
        const result = await supabase.from('notifications').insert(payload).select().single();
        data = result.data;
        error = result.error;
        if (error && !canUseTable(error)) supportsNotificationsRef.current = false;
      }

      const generated =
        data ||
        {
          id: `${Date.now()}-${Math.random()}`,
          created_at: now.toISOString(),
          ...payload,
        };

      if (error && canUseTable(error)) {
        console.error('createNotification error:', error);
      }

      const enriched = { ...generated, dedupe_key: dedupeKey || `${type}-${title}` };
      setNotifications((prev) => {
        const updated = [enriched, ...prev].slice(0, 120);
        persistLocal(userLocalKey('notifications', session.user.id), updated);
        return updated;
      });
      return enriched;
    },
    [mutedNotificationTypes, notifications, persistLocal, session?.user]
  );

  const seedTasks = useCallback(async (userId) => {
    const toInsert = DEFAULT_TASKS.map((task) => ({
      user_id: userId,
      section: task.section,
      title: task.title,
      status: 'pendiente',
      priority: task.priority,
    }));

    const { data } = await supabase.from('route_tasks').insert(toInsert).select();
    if (data?.length) setTasks(data);
  }, []);

  const loadUserData = useCallback(
    async (userId) => {
      setLoading(true);
      try {
        const [
          profileResult,
          diagnosticResult,
          tasksResult,
          savedOppsResult,
          courseResult,
          businessResult,
          documentsResult,
          notificationsResult,
        ] = await Promise.all([
          supabase.from('entrepreneur_profiles').select('*').eq('user_id', userId).maybeSingle(),
          supabase
            .from('diagnostic_answers')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle(),
          supabase.from('route_tasks').select('*').eq('user_id', userId).order('created_at'),
          supabase.from('saved_opportunities').select('opportunity_id').eq('user_id', userId),
          supabase.from('course_progress').select('*').eq('user_id', userId),
          supabase.from('business_profiles').select('*').eq('user_id', userId).maybeSingle(),
          supabase.from('documents').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
          supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(80),
        ]);

        const profileData = profileResult.data;
        const diagData = diagnosticResult.data;
        const tasksData = tasksResult.data;
        const savedOpps = savedOppsResult.data;
        const courseData = courseResult.data;
        const bizData = businessResult.data;

        if (profileData) setProfile({ ...profileData, stage: normalizeStage(profileData.stage) });

        if (diagData) {
          setDiagnosticAnswers(diagData.answers);
          setDiagnosticCompleted(true);
        } else {
          setDiagnosticAnswers(null);
          setDiagnosticCompleted(false);
        }

        if (tasksData && tasksData.length > 0) {
          setTasks(tasksData);
        } else {
          await seedTasks(userId);
        }

        if (savedOpps) setSavedOpportunities(savedOpps.map((row) => row.opportunity_id));

        const progressMap = {};
        (courseData || []).forEach((row) => {
          progressMap[row.course_id] = row.progress;
        });
        setCourseProgress(progressMap);

        if (bizData) setBusinessProfile(bizData);
        if (documentsResult.error && !canUseTable(documentsResult.error)) {
          supportsDocumentsRef.current = false;
          setDocuments(readLocal(userLocalKey('documents', userId), []));
        } else {
          setDocuments(documentsResult.data || []);
        }

        if (notificationsResult.error && !canUseTable(notificationsResult.error)) {
          supportsNotificationsRef.current = false;
          setNotifications(readLocal(userLocalKey('notifications', userId), []));
        } else {
          setNotifications(
            (notificationsResult.data || []).map((item) => ({
              ...item,
              dedupe_key: item.dedupe_key || `${item.type}-${item.title}`,
            }))
          );
        }

        const mutedRaw = localStorage.getItem(userLocalKey('muted_notification_types', userId));
        if (mutedRaw) setMutedNotificationTypes(JSON.parse(mutedRaw));
        else setMutedNotificationTypes([]);

        const { data: providersData, error: providersError } = await supabase
          .from('saved_providers')
          .select('provider_id')
          .eq('user_id', userId);

        if (providersError && !canUseTable(providersError)) {
          supportsSavedProvidersRef.current = false;
          const storedProviders = localStorage.getItem(userLocalKey('saved_providers', userId));
          setSavedProviders(storedProviders ? JSON.parse(storedProviders) : []);
        } else {
          setSavedProviders((providersData || []).map((row) => row.provider_id));
        }

        const { data: eventsData, error: eventsError } = await supabase
          .from('activity_events')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(80);

        if (eventsError && !canUseTable(eventsError)) {
          supportsActivityEventsRef.current = false;
          const storedEvents = localStorage.getItem(userLocalKey('events', userId));
          setActivityEvents(storedEvents ? JSON.parse(storedEvents) : []);
        } else {
          setActivityEvents(eventsData || []);
        }
      } catch (error) {
        console.error('loadUserData error:', error);
      } finally {
        setLoading(false);
      }
    },
    [readLocal, seedTasks]
  );

  useEffect(() => {
    if (session?.user) {
      loadUserData(session.user.id);
    }
  }, [loadUserData, session?.user]);

  const updateProfile = useCallback(
    async (updates) => {
      if (!session?.user) return { error: 'No session' };
      const { data, error } = await supabase
        .from('entrepreneur_profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('user_id', session.user.id)
        .select()
        .single();

      if (!error && data) {
        setProfile(data);
        showToast('Perfil actualizado');
        await addActivity('Perfil actualizado', 'profile');
      }

      return { data, error };
    },
    [addActivity, session?.user, showToast]
  );

  const saveDiagnostic = useCallback(
    async (answers) => {
      if (!session?.user) return { error: 'No session' };
      const stage = determineStage(answers);

      const { data, error } = await supabase
        .from('diagnostic_answers')
        .upsert({ user_id: session.user.id, answers, completed_at: new Date().toISOString() })
        .select()
        .single();

      if (!error) {
        setDiagnosticAnswers(answers);
        setDiagnosticCompleted(true);

        const newPoints = (profile?.points || 0) + 50;
        await supabase
          .from('entrepreneur_profiles')
          .update({ stage, points: newPoints, updated_at: new Date().toISOString() })
          .eq('user_id', session.user.id);

        setProfile((prev) => ({ ...prev, stage, points: newPoints }));
        showToast('Diagnostico guardado. Ruta personalizada lista.');
        await addActivity('Diagnostico completado', 'diagnostic');
      }

      return { data, error };
    },
    [addActivity, determineStage, profile?.points, session?.user, showToast]
  );

  const updateTask = useCallback(
    async (taskId, status, options = {}) => {
      if (!session?.user) return { error: 'No session' };
      const now = new Date().toISOString();

      const { data, error } = await supabase
        .from('route_tasks')
        .update({ status, updated_at: now })
        .eq('id', taskId)
        .select()
        .single();

      if (!error && data) {
        const currentTask = tasks.find((task) => task.id === taskId);
        const wasCompleted = currentTask?.status === 'completado';
        const isCompletedNow = status === 'completado';

        setTasks((prev) => prev.map((task) => (task.id === taskId ? data : task)));

        if (!options.silentActivity) {
          if (status === 'bloqueado') {
            await createNotification({
              type: 'blocker_task',
              title: 'Tarea bloqueada',
              message: `${data.title} esta bloqueada. Revisa que falta para desbloquear.`,
              dedupeKey: `blocker-${data.id}`,
            });
            await addActivity(`Bloqueo en tarea: ${data.title}`, 'blocker');
          } else {
            await addActivity(`Tarea actualizada: ${data.title} (${status})`, status === 'completado' ? 'task_done' : 'task');
          }
        }

        if (!wasCompleted && isCompletedNow) {
          const completedCount = tasks.filter((task) => task.status === 'completado').length + 1;
          const newPoints = (profile?.points || 0) + 10;
          await supabase
            .from('entrepreneur_profiles')
            .update({ completed_tasks: completedCount, points: newPoints, updated_at: now })
            .eq('user_id', session.user.id);

          setProfile((prev) => ({ ...prev, completed_tasks: completedCount, points: newPoints }));
          if (!options.silentToast) showToast('+10 puntos por completar tarea');
        }
      }

      return { data, error };
    },
    [addActivity, createNotification, profile?.points, session?.user, showToast, tasks]
  );

  const toggleSaveOpportunity = useCallback(
    async (opportunityId) => {
      if (!session?.user) return;
      const isSaved = savedOpportunities.includes(opportunityId);

      if (isSaved) {
        await supabase
          .from('saved_opportunities')
          .delete()
          .eq('user_id', session.user.id)
          .eq('opportunity_id', opportunityId);

        setSavedOpportunities((prev) => prev.filter((id) => id !== opportunityId));
        showToast('Oportunidad removida');
      } else {
        await supabase
          .from('saved_opportunities')
          .insert({ user_id: session.user.id, opportunity_id: opportunityId });

        setSavedOpportunities((prev) => [...prev, opportunityId]);

        const opp = MOCK_OPPORTUNITIES.find((item) => item.id === opportunityId);
        const deadlineDays = getDayDiff(opp?.deadlineDate);

        if (typeof deadlineDays === 'number' && deadlineDays <= 7 && deadlineDays >= 0) {
          await createNotification({
            type: 'opportunity_deadline',
            title: 'Convocatoria guardada cierra pronto',
            message: `${opp.title} cierra en ${deadlineDays} dia(s).`,
            dedupeKey: `opp-deadline-${opp.id}-${todayKey()}`,
          });
        }

        const newPoints = (profile?.points || 0) + 5;
        await supabase
          .from('entrepreneur_profiles')
          .update({ points: newPoints, updated_at: new Date().toISOString() })
          .eq('user_id', session.user.id);

        setProfile((prev) => ({ ...prev, points: newPoints }));
        await addActivity(`Oportunidad guardada: ${opp?.title || opportunityId}`, 'opportunity');
        showToast('+5 puntos por guardar oportunidad');
      }
    },
    [addActivity, createNotification, profile?.points, savedOpportunities, session?.user, showToast]
  );

  const toggleSaveProvider = useCallback(
    async (providerId) => {
      if (!session?.user) return;
      const isSaved = savedProviders.includes(providerId);

      let nextSaved;
      if (isSaved) {
        nextSaved = savedProviders.filter((id) => id !== providerId);
      } else {
        nextSaved = [...savedProviders, providerId];
      }

      if (supportsSavedProvidersRef.current) {
        if (isSaved) {
          const { error } = await supabase
            .from('saved_providers')
            .delete()
            .eq('user_id', session.user.id)
            .eq('provider_id', providerId);
          if (error && !canUseTable(error)) supportsSavedProvidersRef.current = false;
        } else {
          const { error } = await supabase
            .from('saved_providers')
            .insert({ user_id: session.user.id, provider_id: providerId });
          if (error && !canUseTable(error)) supportsSavedProvidersRef.current = false;
        }
      }

      if (!supportsSavedProvidersRef.current) {
        persistLocal(userLocalKey('saved_providers', session.user.id), nextSaved);
      }

      setSavedProviders(nextSaved);
      showToast(isSaved ? 'Proveedor removido' : 'Proveedor guardado');
      await addActivity(
        `${isSaved ? 'Proveedor removido de guardados' : 'Proveedor guardado'}: ${providerId}`,
        'provider'
      );
    },
    [addActivity, persistLocal, savedProviders, session?.user, showToast]
  );

  const updateCourseProgress = useCallback(
    async (courseId, progress) => {
      if (!session?.user) return;
      await supabase
        .from('course_progress')
        .upsert({ user_id: session.user.id, course_id: courseId, progress, updated_at: new Date().toISOString() });

      setCourseProgress((prev) => ({ ...prev, [courseId]: progress }));

      if (progress >= 100) {
        const completedCount = Object.values({ ...courseProgress, [courseId]: progress }).filter((value) => value >= 100).length;
        const newPoints = (profile?.points || 0) + 25;

        await supabase
          .from('entrepreneur_profiles')
          .update({ completed_courses: completedCount, points: newPoints, updated_at: new Date().toISOString() })
          .eq('user_id', session.user.id);

        setProfile((prev) => ({ ...prev, completed_courses: completedCount, points: newPoints }));
        showToast('Curso completado (+25 puntos)');
        await addActivity(`Curso completado: ${courseId}`, 'course');
      }
    },
    [addActivity, courseProgress, profile?.points, session?.user, showToast]
  );

  const saveBusinessProfile = useCallback(
    async (bizData) => {
      if (!session?.user) return { error: 'No session' };
      const payload = { ...bizData, user_id: session.user.id };

      const { data, error } = await supabase.from('business_profiles').upsert(payload).select().single();
      if (!error && data) {
        setBusinessProfile(data);
        showToast('Perfil de negocio actualizado');
        await addActivity('Perfil de negocio actualizado', 'business');
      }
      return { data, error };
    },
    [addActivity, session?.user, showToast]
  );

  const uploadTaskDocument = useCallback(
    async (task, metadata) => {
      if (!session?.user || !task) return { error: 'No session or task' };

      const requirement = taskRequirement(task);
      const payload = {
        user_id: session.user.id,
        name: metadata?.name || requirement?.docType || `Documento ${task.title}`,
        category: requirement?.category || 'Operativo',
        file_type: metadata?.fileType || 'PDF',
        size_bytes: metadata?.sizeBytes || 0,
        status: 'Listo',
        storage_path: `task:${task.id}`,
        updated_at: new Date().toISOString(),
      };

      let data = null;
      let error = null;
      if (supportsDocumentsRef.current) {
        const result = await supabase.from('documents').insert(payload).select().single();
        data = result.data;
        error = result.error;
        if (error && !canUseTable(error)) supportsDocumentsRef.current = false;
      }

      const documentRecord =
        data ||
        {
          id: `${Date.now()}-${Math.random()}`,
          created_at: new Date().toISOString(),
          ...payload,
        };

      if (!error || !supportsDocumentsRef.current) {
        setDocuments((prev) => {
          const updated = [documentRecord, ...prev];
          persistLocal(userLocalKey('documents', session.user.id), updated);
          return updated;
        });
        await updateTask(task.id, 'completado', { silentToast: true });
        await addActivity(`Documento subido para tarea: ${task.title}`, 'document');
        showToast('Documento subido y tarea actualizada');
      } else {
        showToast('No se pudo registrar el documento. Intenta de nuevo.', 'error');
      }
      return { data: documentRecord, error };
    },
    [addActivity, persistLocal, session?.user, showToast, updateTask]
  );

  const generateTaskTemplate = useCallback(
    async (task) => {
      if (!session?.user || !task) return { error: 'No session or task' };

      const requirement = taskRequirement(task);
      const payload = {
        user_id: session.user.id,
        name: `${requirement?.docType || task.title} - plantilla`,
        category: requirement?.category || 'Operativo',
        file_type: 'DOCX',
        size_bytes: 0,
        status: 'Borrador',
        storage_path: `task:${task.id}:template`,
        updated_at: new Date().toISOString(),
      };

      let data = null;
      let error = null;
      if (supportsDocumentsRef.current) {
        const result = await supabase.from('documents').insert(payload).select().single();
        data = result.data;
        error = result.error;
        if (error && !canUseTable(error)) supportsDocumentsRef.current = false;
      }

      const templateRecord =
        data ||
        {
          id: `${Date.now()}-${Math.random()}`,
          created_at: new Date().toISOString(),
          ...payload,
        };

      if (!error || !supportsDocumentsRef.current) {
        setDocuments((prev) => {
          const updated = [templateRecord, ...prev];
          persistLocal(userLocalKey('documents', session.user.id), updated);
          return updated;
        });
        await updateTask(task.id, 'en progreso', { silentToast: true });
        await addActivity(`Plantilla generada para tarea: ${task.title}`, 'template');
        showToast('Plantilla registrada para la tarea');
      } else {
        showToast('No se pudo generar la plantilla. Intenta de nuevo.', 'error');
      }

      return { data: templateRecord, error };
    },
    [addActivity, persistLocal, session?.user, showToast, updateTask]
  );

  const getTaskDocumentStatus = useCallback(
    (task) => {
      const requirement = taskRequirement(task);
      if (!requirement) return { required: false, status: 'No aplica', document: null, requirement: null };

      const linked = documents.find((doc) => doc.storage_path === `task:${task.id}` && doc.status === 'Listo');
      return {
        required: true,
        requirement,
        status: linked ? 'Subido' : 'Pendiente',
        document: linked || null,
      };
    },
    [documents]
  );

  const scoredTasks = useMemo(() => {
    const stage = normalizeStage(profile?.stage);
    const sectionWeights = STAGE_SECTION_WEIGHT[stage] || {};

    return tasks
      .map((task) => {
        const dueDays = parseDeadlineDays(task);
        const requirement = taskRequirement(task);
        const documentState = getTaskDocumentStatus(task);

        const scoreBreakdown = [];
        let score = 0;
        score += PRIORITY_SCORE[task.priority] || 10;
        score += STATUS_SCORE[task.status] || 0;
        if (task.status === 'bloqueado') scoreBreakdown.push('+40 bloqueo');

        if (sectionWeights[task.section]) {
          score += STAGE_RELEVANCE_SCORE;
          scoreBreakdown.push('+15 etapa');
        }

        if (typeof dueDays === 'number') {
          if (dueDays <= 7) {
            score += DEADLINE_SOON_SCORE;
            scoreBreakdown.push('+25 fecha cercana');
          } else if (dueDays <= 14) {
            score += 12;
            scoreBreakdown.push('+12 fecha proxima');
          }
        }

        if (requirement && documentState.status === 'Pendiente') {
          score += 18;
          scoreBreakdown.push('+18 documento faltante');
        }

        const quickWin = task.priority !== 'Alta' && task.status !== 'bloqueado' && !requirement;
        if (quickWin) {
          score += QUICK_WIN_SCORE;
          scoreBreakdown.push('+10 avance rapido');
        }

        return {
          ...task,
          score,
          scoreBreakdown,
          dueDays,
          quickWin,
          hasRequiredDocument: !!requirement,
          documentStatus: documentState.status,
          documentRequirement: requirement,
        };
      })
      .sort((a, b) => b.score - a.score);
  }, [getTaskDocumentStatus, profile?.stage, tasks]);

  const pendingTasks = useMemo(() => scoredTasks.filter((task) => task.status !== 'completado'), [scoredTasks]);

  const mainBlocker = useMemo(
    () => pendingTasks.find((task) => task.status === 'bloqueado') || null,
    [pendingTasks]
  );

  const recommendedOpportunity = useMemo(() => {
    const stage = normalizeStage(profile?.stage);

    const available = MOCK_OPPORTUNITIES.map((opp) => {
      const stageMatch = opp.stages?.includes(stage);
      const saved = savedOpportunities.includes(opp.id);
      const deadlineDays = getDayDiff(opp.deadlineDate);

      let score = 0;
      if (opp.status === 'Abierta') score += 30;
      if (stageMatch) score += 30;
      if (!saved) score += 15;
      if (typeof deadlineDays === 'number') {
        if (deadlineDays >= 0 && deadlineDays <= 7) score += 18;
        else if (deadlineDays <= 14) score += 10;
      }

      return { ...opp, recommendationScore: score, stageMatch, saved, deadlineDays };
    })
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .find((item) => item.status === 'Abierta' || item.status === 'Proximamente');

    return available || null;
  }, [profile?.stage, savedOpportunities]);

  const missingDocument = useMemo(() => {
    const firstMissing = pendingTasks.find(
      (task) => task.hasRequiredDocument && task.documentStatus !== 'Subido'
    );
    return firstMissing || null;
  }, [pendingTasks]);

  const todayPlan = useMemo(
    () => ({
      topTasks: pendingTasks.slice(0, 3),
      blocker: mainBlocker,
      recommendedOpportunity,
      missingDocument,
    }),
    [mainBlocker, missingDocument, pendingTasks, recommendedOpportunity]
  );

  const nextAction = useMemo(() => {
    if (!diagnosticCompleted) {
      return {
        label: 'Completar diagnostico',
        subtitle: 'Personaliza tu ruta para desbloquear recomendaciones.',
        route: '/diagnostico',
        kind: 'diagnostic',
      };
    }

    if (mainBlocker) {
      return {
        label: `Desbloquear: ${mainBlocker.title}`,
        subtitle: 'Resuelve el bloqueo para retomar avance.',
        route: '/ruta',
        kind: 'blocker',
        taskId: mainBlocker.id,
      };
    }

    if (missingDocument) {
      return {
        label: `Subir documento: ${missingDocument.documentRequirement?.docType || 'requerido'}`,
        subtitle: missingDocument.title,
        route: '/ruta',
        kind: 'missing_document',
        taskId: missingDocument.id,
      };
    }

    if (pendingTasks.length > 0) {
      return {
        label: `Continuar tarea: ${pendingTasks[0].title}`,
        subtitle: 'Siguiente mejor accion priorizada.',
        route: '/ruta',
        kind: 'task',
        taskId: pendingTasks[0].id,
      };
    }

    if (recommendedOpportunity) {
      return {
        label: `Revisar oportunidad: ${recommendedOpportunity.title}`,
        subtitle: 'Hay una oportunidad alineada con tu etapa.',
        route: '/oportunidades',
        kind: 'opportunity',
        opportunityId: recommendedOpportunity.id,
      };
    }

    return {
      label: 'Ir al panel',
      subtitle: 'Tu siguiente accion estara aqui.',
      route: '/dashboard',
      kind: 'fallback',
    };
  }, [diagnosticCompleted, mainBlocker, missingDocument, pendingTasks, recommendedOpportunity]);

  const continueToNextAction = useCallback(
    (navigate) => {
      if (!navigate) return;
      navigate(nextAction.route, {
        state: {
          focusTaskId: nextAction.taskId || null,
          focusOpportunityId: nextAction.opportunityId || null,
          source: 'next-action',
        },
      });
    },
    [nextAction.opportunityId, nextAction.route, nextAction.taskId]
  );

  const scanAndGenerateNotifications = useCallback(async () => {
    if (!session?.user) return;

    const stage = normalizeStage(profile?.stage);
    const seenOppsKey = userLocalKey('notified_matching_opportunities', session.user.id);
    const seenOpps = JSON.parse(localStorage.getItem(seenOppsKey) || '[]');

    const match = MOCK_OPPORTUNITIES.find(
      (opp) => opp.status === 'Abierta' && opp.stages?.includes(stage) && !seenOpps.includes(opp.id)
    );

    if (match) {
      const created = await createNotification({
        type: 'opportunity_match',
        title: 'Nueva oportunidad para tu etapa',
        message: `${match.title} puede ser relevante para ${stage}.`,
        dedupeKey: `opp-match-${match.id}`,
      });
      if (created) {
        localStorage.setItem(seenOppsKey, JSON.stringify([...seenOpps, match.id]));
      }
    }

    const blocked = tasks.find((task) => task.status === 'bloqueado');
    if (blocked) {
      await createNotification({
        type: 'blocker_task',
        title: 'Tienes un bloqueo pendiente',
        message: `Atiende "${blocked.title}" para continuar tu ruta.`,
        dedupeKey: `blocked-${blocked.id}-${todayKey()}`,
      });
    }

    if (missingDocument) {
      await createNotification({
        type: 'missing_document',
        title: 'Documento faltante para avanzar',
        message: `${missingDocument.documentRequirement?.docType || 'Documento'} pendiente en ${missingDocument.title}.`,
        dedupeKey: `missing-doc-${missingDocument.id}-${todayKey()}`,
      });
    }

    if (!diagnosticCompleted) {
      await createNotification({
        type: 'diagnostic_reminder',
        title: 'Recordatorio suave',
        message: 'Completa el diagnostico para activar recomendaciones personalizadas.',
        dedupeKey: `diag-reminder-${todayKey()}`,
      });
    }

    const savedOpenSoon = savedOpportunities
      .map((id) => MOCK_OPPORTUNITIES.find((opp) => opp.id === id))
      .find((opp) => {
        const days = getDayDiff(opp?.deadlineDate);
        return typeof days === 'number' && days >= 0 && days <= 5;
      });

    if (savedOpenSoon) {
      const daysLeft = getDayDiff(savedOpenSoon.deadlineDate);
      await createNotification({
        type: 'opportunity_deadline',
        title: 'Convocatoria guardada cierra pronto',
        message: `${savedOpenSoon.title} cierra en ${daysLeft} dia(s).`,
        dedupeKey: `saved-opp-deadline-${savedOpenSoon.id}-${todayKey()}`,
      });
    }
  }, [
    createNotification,
    diagnosticCompleted,
    missingDocument,
    profile?.stage,
    savedOpportunities,
    session?.user,
    tasks,
  ]);

  useEffect(() => {
    if (!loading && session?.user) {
      scanAndGenerateNotifications();
    }
  }, [loading, scanAndGenerateNotifications, session?.user]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === 'completado').length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const completedCourses = Object.values(courseProgress).filter((value) => value >= 100).length;

  const points = profile?.points || 0;
  const level =
    points < 100
      ? 'Explorador'
      : points < 300
      ? 'Emprendedor Activo'
      : points < 600
      ? 'Constructor'
      : points < 1000
      ? 'Validador'
      : 'Emprendedor Pro';

  const levelNum = points < 100 ? 1 : points < 300 ? 2 : points < 600 ? 3 : points < 1000 ? 4 : 5;
  const nextLevelPoints = [100, 300, 600, 1000, 9999][Math.min(levelNum - 1, 4)];
  const levelProgress = Math.min(100, Math.round((points / nextLevelPoints) * 100));

  const unreadNotifications = notifications.filter((item) => !item.read).length;

  const value = {
    profile,
    loading,
    diagnosticAnswers,
    diagnosticCompleted,
    tasks,
    documents,
    notifications,
    mutedNotificationTypes,
    savedOpportunities,
    savedProviders,
    courseProgress,
    businessProfile,
    activityEvents,
    toast,
    todayPlan,
    nextAction,

    totalTasks,
    completedTasks,
    progressPercent,
    completedCourses,
    points,
    level,
    levelNum,
    nextLevelPoints,
    levelProgress,
    unreadNotifications,

    session,

    updateProfile,
    saveDiagnostic,
    updateTask,
    toggleSaveOpportunity,
    toggleSaveProvider,
    updateCourseProgress,
    saveBusinessProfile,
    addActivity,
    showToast,
    markNotificationRead,
    markAllNotificationsRead,
    muteNotificationType,
    unmuteNotificationType,
    createNotification,
    uploadTaskDocument,
    generateTaskTemplate,
    getTaskDocumentStatus,
    continueToNextAction,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
