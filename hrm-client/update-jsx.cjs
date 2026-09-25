const fs = require('fs');
let code = fs.readFileSync('./src/pages/Employees.jsx', 'utf8');

// Top bar buttons
code = code.replace(
  'className="emp-btn-secondary flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 bg-white/5 hover:bg-white/10 transition-colors"',
  'className="emp-btn-secondary px-4 py-2.5 w-full sm:w-auto"'
);
code = code.replace(
  'className="emp-btn-primary flex items-center gap-2 text-black text-xs font-bold px-4 py-2.5 rounded-xl bg-brand-green hover:bg-emerald-500 transition-colors"',
  'className="emp-btn-primary px-4 py-2.5 gap-2 w-full sm:w-auto"'
);

// Search input
code = code.replace(
  'className="emp-search-input flex-1 bg-surface-800 text-slate-300 text-sm rounded-xl px-4 py-2.5 border border-white/5 outline-none focus:border-indigo-500"',
  'className="emp-search-input flex-1 outline-none w-full"'
);
// Filter select
code = code.replace(
  'className="emp-filter-select w-full sm:w-48 bg-surface-800 text-slate-300 text-sm rounded-xl px-4 py-2.5 border border-white/5 outline-none focus:border-indigo-500"',
  'className="emp-filter-select outline-none w-full sm:w-48"'
);

// Dept header 
code = code.replace(
  /<tr \s*className="emp-dept-header[^>]*>/g,
  '<tr className="emp-dept-header cursor-pointer transition-colors" onClick={() => toggleDept(dept)}>'
);
code = code.replace(
  /className="flex items-center gap-2 text-indigo-300 font-semibold text-sm"/g,
  'className="flex items-center gap-2 text-sm font-semibold"'
);
code = code.replace(
  /<span className="emp-dept-count[^>]*>\{emps.length\}<\/span>/g,
  '<span className="emp-dept-count px-2 py-0.5 rounded-full ml-2 text-[10px]">{emps.length}</span>'
);

// Rows 
code = code.replace(
  /<tr key=\{emp\.id\} className="emp-row[^>]*>/g,
  '<tr key={emp.id} className="emp-row transition-colors group cursor-pointer" onClick={() => window.location.href = `/employees/${emp.id}`}>'
);
// Recycle bin row does not have onClick
code = code.replace(
  /<tr key=\{emp\.id\} className="emp-row transition-colors group cursor-pointer" onClick=\{\(\) => window\.location\.href = `\/employees\/\$\{emp\.id\}`\}>\s*<td className="py-3\.5 px-5"><span className="emp-id-badge[^>]*>\{emp\.employee_id \|\| '—'\}<\/span><\/td>/g,
  '<tr key={emp.id} className="emp-row transition-colors group cursor-pointer" onClick={() => window.location.href = `/employees/${emp.id}`}><td className="py-3.5 px-5"><span className="emp-id-badge">{emp.employee_id || \'—\'}</span></td>'
);

// Active & Recycle rows replacement loop
code = code.replace(/<span className="emp-id-badge[^>]*>\{emp\.employee_id \|\| '—'\}<\/span>/g, '<span className="emp-id-badge">{emp.employee_id || \'—\'}</span>');
code = code.replace(/<div className="emp-avatar[^>]*>\{\(emp\.Full_name \|\| '\?'\)\[0\]\}<\/div>/g, '<div className="emp-avatar">{(emp.Full_name || \'?\')[0]}</div>');
code = code.replace(/<span className="font-medium text-white group-hover:text-indigo-400 transition-colors">/g, '<span className="font-medium">');
code = code.replace(/<td className="emp-email[^>]*>\{emp\.email \|\| '—'\}<\/td>/g, '<td className="emp-email py-3.5 px-5">{emp.email || \'—\'}</td>');
code = code.replace(/<td className="emp-hire-date[^>]*>\{\(emp\.hire_date \|\| ''\)\.slice\(0, 10\) \|\| '—'\}<\/td>/g, '<td className="emp-hire-date py-3.5 px-5">{(emp.hire_date || \'\').slice(0, 10) || \'—\'}</td>');

// Action group
code = code.replace(/<div className="emp-action-group[^>]*>/g, '<div className="emp-action-group">');

// Active actions
code = code.replace(
  '<Link to={`/employees/${emp.id}`} className="emp-action-view flex flex-col items-center justify-center gap-1 w-12 h-12 rounded-xl text-[10px] font-bold text-white bg-white/5 hover:bg-white/10 transition-colors">',
  '<Link to={`/employees/${emp.id}`} className="emp-action-view">'
);
code = code.replace(
  '<Link to={`/employees/${emp.id}/edit`} className="emp-action-edit flex flex-col items-center justify-center gap-1 w-12 h-12 rounded-xl text-[10px] font-bold text-brand-green bg-brand-green/10 hover:bg-brand-green/20 transition-colors">',
  '<Link to={`/employees/${emp.id}/edit`} className="emp-action-edit">'
);
code = code.replace(
  'className="emp-action-delete flex items-center justify-center w-10 h-10 ml-1 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 transition-colors text-rose-400" title="Soft Delete">',
  'className="emp-action-delete" title="Soft Delete">'
);

// Recycle actions
code = code.replace(
  '<button onClick={() => restoreMutation.mutate(emp.id)} className="emp-action-edit flex items-center justify-center h-8 px-3 rounded-lg text-xs font-bold text-brand-green bg-brand-green/10 hover:bg-brand-green/20 transition-colors">',
  '<button onClick={() => restoreMutation.mutate(emp.id)} className="emp-action-edit">'
);
code = code.replace(
  '<button onClick={() => setHardDeleteTarget(emp)} className="emp-action-delete flex items-center justify-center h-8 px-3 rounded-lg text-xs font-bold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 transition-colors">',
  '<button onClick={() => setHardDeleteTarget(emp)} className="emp-action-delete">'
);


// Modals
code = code.replace(
  'className="emp-btn-secondary px-5 py-2.5 text-xs font-bold text-slate-300 hover:text-white bg-white/5 rounded-xl transition-colors"',
  'className="emp-btn-secondary px-5 py-2.5"'
);
code = code.replace(
  'className="emp-btn-primary px-6 py-2.5 text-xs font-bold text-white bg-brand-green hover:bg-emerald-500 rounded-xl transition-colors disabled:opacity-50"',
  'className="emp-btn-primary px-6 py-2.5 disabled:opacity-50"'
);


fs.writeFileSync('./src/pages/Employees.jsx', code);
console.log('Employees.jsx updated');
