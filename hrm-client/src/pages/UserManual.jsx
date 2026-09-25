import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import toast from 'react-hot-toast';
import RichTextEditor from '../components/manual/RichTextEditor';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function UserManual() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeArticle, setActiveArticle] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: null, articleId: null, articleTitle: '' });
  
  const queryClient = useQueryClient();
  const isBossOrAdmin = user?.role === 'boss' || user?.role === 'admin';
  const [manualPerms, setManualPerms] = useState(null);

  // Check manual specific perms for normal users
  useEffect(() => {
    if (!isBossOrAdmin) {
      api.get('/manual/permissions').then(res => {
        const myPerm = res.data.permissions?.find(p => p.employee_id === user?.employee_id);
        setManualPerms(myPerm || null);
      }).catch(() => setManualPerms(null));
    }
  }, [isBossOrAdmin, user]);

  const canEdit = isBossOrAdmin || manualPerms?.can_edit;
  const canPublish = isBossOrAdmin || manualPerms?.can_publish;

  // Fetch Manual Data (Public or Admin view based on permissions)
  const endpoint = canEdit ? '/manual/admin' : '/manual/public';
  const { data, isLoading } = useQuery({
    queryKey: ['manual-data', endpoint],
    queryFn: async () => {
      const res = await api.get(endpoint);
      return res.data;
    }
  });

  const categories = data?.categories || [];
  const articles = data?.articles || [];

  const { data: recycleData } = useQuery({
    queryKey: ['manual-recycle-bin'],
    queryFn: async () => {
      const res = await api.get('/manual/recycle-bin');
      return res.data;
    },
    enabled: !!canEdit
  });
  const deletedArticles = recycleData?.articles || [];

  // Mutations
  const updateArticle = useMutation({
    mutationFn: (data) => api.put(`/manual/articles/${data.id}`, data),
    onSuccess: () => {
      toast.success('Saved draft successfully');
      queryClient.invalidateQueries(['manual-data']);
    }
  });

  const publishArticle = useMutation({
    mutationFn: (id) => api.post(`/manual/articles/${id}/publish`),
    onSuccess: () => {
      toast.success('Published successfully');
      queryClient.invalidateQueries(['manual-data']);
      setIsEditing(false);
    }
  });

  const addCategory = useMutation({
    mutationFn: (name) => api.post('/manual/categories', { name }),
    onSuccess: () => {
      toast.success('Category added');
      queryClient.invalidateQueries(['manual-data']);
    }
  });

  const addArticle = useMutation({
    mutationFn: (catId) => api.post('/manual/articles', { category_id: catId, title: 'New Article', draft_content: '' }),
    onSuccess: (res) => {
      toast.success('Article added');
      queryClient.invalidateQueries(['manual-data']);
      setActiveArticle(res.data.article);
      setIsEditing(true);
    }
  });

  const softDeleteArticle = useMutation({
    mutationFn: (id) => api.post(`/manual/articles/${id}/soft-delete`),
    onSuccess: () => {
      toast.success('Article moved to Recycle Bin');
      queryClient.invalidateQueries(['manual-data']);
      queryClient.invalidateQueries(['manual-recycle-bin']);
      setActiveArticle(null);
      setIsEditing(false);
      setConfirmModal({ isOpen: false });
    }
  });

  const restoreArticle = useMutation({
    mutationFn: (id) => api.post(`/manual/articles/${id}/restore-deleted`),
    onSuccess: (res) => {
      toast.success('Article restored');
      queryClient.invalidateQueries(['manual-data']);
      queryClient.invalidateQueries(['manual-recycle-bin']);
      setActiveArticle(res.data.article);
    }
  });

  const hardDeleteArticle = useMutation({
    mutationFn: (id) => api.delete(`/manual/articles/${id}`),
    onSuccess: () => {
      toast.success('Article permanently deleted');
      queryClient.invalidateQueries(['manual-recycle-bin']);
      setActiveArticle(null);
      setConfirmModal({ isOpen: false });
    }
  });

  // Filter articles based on search
  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (a.published_content && a.published_content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleContentClick = (e) => {
    // Traverse up to find an anchor tag in case they clicked an element inside the a tag
    const anchor = e.target.closest('a');
    if (anchor) {
      const articleTitle = anchor.getAttribute('data-article-title');
      if (articleTitle) {
        e.preventDefault();
        const targetArticle = articles.find(a => a.title === articleTitle);
        if (targetArticle) {
          setActiveArticle(targetArticle);
          setIsEditing(false);
        } else {
          toast.error('Article not found: ' + articleTitle);
        }
      }
    }
  };

  const getLocalizedContent = (content) => {
    if (!content) return '';
    try {
      const parsed = JSON.parse(content);
      return parsed[language] || parsed.my || '';
    } catch (e) {
      return content;
    }
  };

  const updateLocalizedContent = (originalContent, newLanguageContent) => {
    try {
      const parsed = JSON.parse(originalContent || '{}');
      parsed[language] = newLanguageContent;
      return JSON.stringify(parsed);
    } catch (e) {
      // If it wasn't JSON before, treat old content as 'my' (Myanmar)
      const parsed = { my: originalContent || '' };
      parsed[language] = newLanguageContent;
      return JSON.stringify(parsed);
    }
  };

  return (
    <div className="flex h-[calc(100vh-100px)] bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-200 dark:border-gray-700 flex flex-col bg-gray-50 dark:bg-gray-800">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <input
            type="text"
            placeholder="Search manual..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {categories.map(cat => (
            <div key={cat.id} className="mb-4">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 px-2 py-1 uppercase text-xs tracking-wider flex justify-between group">
                {cat.name}
                {canEdit && (
                  <button onClick={() => addArticle.mutate(cat.id)} className="hidden group-hover:block text-blue-500 hover:text-blue-700 text-lg leading-none">+</button>
                )}
              </h3>
              <ul className="mt-1 space-y-1">
                {filteredArticles.filter(a => a.category_id === cat.id).map(art => (
                  <li key={art.id}>
                    <button
                      onClick={() => {
                        setActiveArticle(art);
                        setIsEditing(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
                        activeArticle?.id === art.id 
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 font-medium' 
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {art.title}
                      {canEdit && art.status === 'draft' && <span className="ml-2 text-xs text-orange-500">(Draft)</span>}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {canEdit && (
            <button 
              onClick={() => {
                const name = prompt('Category name:');
                if (name) addCategory.mutate(name);
              }}
              className="mt-4 w-full text-left px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md"
            >
              + Add Category
            </button>
          )}

          {canEdit && deletedArticles.length > 0 && (
            <div className="mb-4 mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-500 dark:text-gray-400 px-2 py-1 uppercase text-xs tracking-wider flex items-center gap-2">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                Recycle Bin
              </h3>
              <ul className="mt-1 space-y-1">
                {deletedArticles.map(art => (
                  <li key={art.id}>
                    <button
                      onClick={() => {
                        setActiveArticle(art);
                        setIsEditing(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
                        activeArticle?.id === art.id 
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 font-medium' 
                          : 'text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-surface-800'
                      }`}
                    >
                      <span className="opacity-80">{art.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeArticle ? (
          <>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-900">
              {isEditing ? (
                <input 
                  type="text"
                  value={activeArticle.title}
                  onChange={e => setActiveArticle({...activeArticle, title: e.target.value})}
                  className="text-2xl font-bold border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 bg-transparent dark:text-white"
                />
              ) : (
                <h2 className="text-2xl font-bold dark:text-white">{activeArticle.title}</h2>
              )}
              
              <div className="flex gap-2 items-center">
                {activeArticle.status === 'deleted' ? (
                  <>
                    <button 
                      onClick={() => restoreArticle.mutate(activeArticle.id)}
                      disabled={restoreArticle.isPending}
                      className="px-4 py-2 bg-surface-850 border border-slate-700 text-slate-300 rounded hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-2 text-sm font-semibold"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                      Restore
                    </button>
                    {isBossOrAdmin && (
                      <button 
                        onClick={() => setConfirmModal({ isOpen: true, type: 'hard', articleId: activeArticle.id, articleTitle: activeArticle.title })}
                        disabled={hardDeleteArticle.isPending}
                        className="px-4 py-2 bg-rose-500/10 border border-rose-500/30 text-rose-500 rounded hover:bg-rose-500/20 transition-colors flex items-center gap-2 text-sm font-semibold"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        Hard Delete
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    {canEdit && !isEditing && (
                      <>
                        <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm font-semibold">
                          Edit
                        </button>
                        <button 
                          onClick={() => setConfirmModal({ isOpen: true, type: 'soft', articleId: activeArticle.id, articleTitle: activeArticle.title })}
                          className="px-4 py-2 bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 rounded hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors text-sm font-semibold flex items-center gap-1.5"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          Delete
                        </button>
                      </>
                    )}
                    {isEditing && (
                      <>
                        <button 
                          onClick={() => {
                            setIsEditing(false);
                            queryClient.invalidateQueries(['manual-data']); // cancel changes
                          }} 
                          className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors text-sm font-semibold"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => updateArticle.mutate({ id: activeArticle.id, title: activeArticle.title, draft_content: activeArticle.draft_content })} 
                          className="px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 rounded transition-colors text-sm font-semibold"
                        >
                          Save Draft
                        </button>
                        {canPublish && (
                          <button 
                            onClick={() => publishArticle.mutate(activeArticle.id)} 
                            className="px-4 py-2 bg-emerald-500 text-white hover:bg-emerald-600 rounded shadow transition-colors text-sm font-semibold"
                          >
                            Publish
                          </button>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
              {isEditing ? (
                <div className="h-full">
                  <RichTextEditor 
                    value={getLocalizedContent(activeArticle.draft_content || activeArticle.published_content)} 
                    onChange={(val) => setActiveArticle({
                      ...activeArticle, 
                      draft_content: updateLocalizedContent(activeArticle.draft_content || activeArticle.published_content, val)
                    })} 
                  />
                </div>
              ) : (
                <div 
                  className="prose dark:prose-invert max-w-4xl" 
                  onClick={handleContentClick}
                  dangerouslySetInnerHTML={{ __html: getLocalizedContent(activeArticle.published_content) || '<p class="text-gray-400 italic">No published content yet.</p>' }} 
                />
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-500">
            Select an article from the left to view or edit.
          </div>
        )}
      </div>

      {/* Custom Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setConfirmModal({ isOpen: false })}
          />
          <div className="relative bg-white dark:bg-surface-800 border border-gray-200 dark:border-slate-700 rounded-2xl w-full max-w-sm m-4 p-6 shadow-2xl text-center">
            <button 
              onClick={() => setConfirmModal({ isOpen: false })}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            
            <div className={`w-14 h-14 flex items-center justify-center rounded-full mx-auto mb-4 ${
              confirmModal.type === 'hard' 
                ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-500' 
                : 'bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-500'
            }`}>
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {confirmModal.type === 'hard' ? 'Permanently Delete Article?' : 'Move to Recycle Bin?'}
            </h2>
            
            <div className="text-sm text-gray-600 dark:text-slate-400 mb-6 space-y-2">
              {confirmModal.type === 'hard' ? (
                <>
                  <p>You are about to permanently delete<br/><strong className="text-gray-900 dark:text-white">"{confirmModal.articleTitle}"</strong>.</p>
                  <p className="text-rose-600 dark:text-rose-400 text-xs font-medium">This action cannot be undone. The article and its version history will be permanently removed.</p>
                </>
              ) : (
                <>
                  <p>Are you sure you want to move<br/><strong className="text-gray-900 dark:text-white">"{confirmModal.articleTitle}"</strong> to the Recycle Bin?</p>
                  <p className="text-xs">You can restore this article later from the Recycle Bin.</p>
                </>
              )}
            </div>
            
            <div className="flex justify-center gap-3">
              <button 
                onClick={() => setConfirmModal({ isOpen: false })}
                className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-surface-850 hover:bg-gray-200 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300 font-semibold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (confirmModal.type === 'hard') {
                    hardDeleteArticle.mutate(confirmModal.articleId);
                  } else {
                    softDeleteArticle.mutate(confirmModal.articleId);
                  }
                }}
                disabled={softDeleteArticle.isPending || hardDeleteArticle.isPending}
                className={`flex-1 px-4 py-2.5 font-bold rounded-xl transition-colors text-white ${
                  confirmModal.type === 'hard'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {confirmModal.type === 'hard' ? 'Permanently Delete' : 'Move to Recycle Bin'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
