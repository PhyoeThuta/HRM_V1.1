import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export default function LeaveRequestActionsMenu({ isOpen, onToggle, onClose, items }) {
  const ref = useRef(null);
  const [menuPos, setMenuPos] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setMenuPos(null);
      return;
    }
    const updatePos = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const menuHeight = 280;
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUp = spaceBelow < menuHeight && rect.top > menuHeight;
      setMenuPos({
        top: openUp ? rect.top - 4 : rect.bottom + 4,
        left: Math.max(8, rect.right - 220),
        transform: openUp ? 'translateY(-100%)' : 'none',
      });
    };
    updatePos();
    window.addEventListener('resize', updatePos);
    window.addEventListener('scroll', updatePos, true);
    return () => {
      window.removeEventListener('resize', updatePos);
      window.removeEventListener('scroll', updatePos, true);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (ref.current?.contains(e.target)) return;
      const portal = document.getElementById('leave-actions-menu-portal');
      if (portal?.contains(e.target)) return;
      onClose();
    };
    const esc = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', esc);
    };
  }, [isOpen, onClose]);

  const visible = items.filter(i => i.show !== false);

  const menu = isOpen && visible.length > 0 && menuPos && createPortal(
    <div
      id="leave-actions-menu-portal"
      className="fixed z-[200] min-w-[220px] py-1 rounded-xl shadow-2xl border border-white/10 overflow-hidden"
      style={{ top: menuPos.top, left: menuPos.left, transform: menuPos.transform, background: 'rgb(var(--color-surface-800))' }}
    >
      {visible.map(item => (
        <button
          key={item.id}
          type="button"
          disabled={item.disabled}
          onClick={() => { item.onClick(); onClose(); }}
          className={`w-full text-left px-4 py-2.5 text-xs font-medium transition-colors flex items-center gap-2 ${
            item.danger
              ? 'text-rose-400 hover:bg-rose-500/10 disabled:opacity-40'
              : item.primary
                ? 'text-indigo-300 hover:bg-indigo-500/10 disabled:opacity-40'
                : 'text-slate-300 hover:bg-white/5 disabled:opacity-40'
          }`}
        >
          {item.icon && <span className="text-sm flex-shrink-0">{item.icon}</span>}
          <span>{item.label}</span>
        </button>
      ))}
    </div>,
    document.body
  );

  return (
    <>
      <div ref={ref}>
        <button
          type="button"
          onClick={onToggle}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          title="More actions"
          aria-label="More actions"
          aria-expanded={isOpen}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>
      {menu}
    </>
  );
}

export function buildLeaveRequestMenuItems(request, handlers, { isAdmin }) {
  const items = [
    {
      id: 'details',
      label: 'View details & signature',
      icon: '📋',
      onClick: () => handlers.onDetails(request),
    },
  ];

  if (!isAdmin) return items;

  if (request.status === 'Pending') {
    items.push(
      { id: 'approve', label: 'Approve with signature', icon: '✓', primary: true, onClick: () => handlers.onApprove(request) },
      { id: 'reject', label: 'Reject request', icon: '✕', danger: true, onClick: () => handlers.onReject(request) },
    );
  }

  if (request.can_start_coverage) {
    items.push({ id: 'start-cov', label: 'Start coverage handover', icon: '▶', primary: true, onClick: () => handlers.onStartCoverage(request) });
  }
  if (request.can_view_coverage_history) {
    items.push({
      id: 'view-cov',
      label: request.coverage_handover_is_terminal ? 'Coverage history' : 'Open coverage handover',
      icon: '📤',
      onClick: () => handlers.onViewCoverage(request),
    });
  }
  if (request.can_start_return) {
    items.push({ id: 'start-ret', label: 'Start return handover', icon: '↩', primary: true, onClick: () => handlers.onStartReturn(request) });
  }
  if (request.can_view_return_history) {
    items.push({
      id: 'view-ret',
      label: request.return_handover_is_terminal ? 'Return history' : 'Open return handover',
      icon: '📥',
      onClick: () => handlers.onViewReturn(request),
    });
  }

  items.push({
    id: 'delete',
    label: 'Delete request',
    icon: '🗑',
    danger: true,
    disabled: request.can_delete_leave === false,
    onClick: () => handlers.onDelete(request),
  });

  return items;
}
