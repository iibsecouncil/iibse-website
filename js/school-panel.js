// school-panel.js
// Demo client-side logic. Uses localStorage for demo school data and students.

// Helpers
function qs(sel){return document.querySelector(sel)}
function qsa(sel){return Array.from(document.querySelectorAll(sel))}

// Demo seed function (if no school exists)
function seedDemo() {
  if (localStorage.getItem('iibse_school')) return;
  const demo = {
    id: "SCH001",
    name: "Demo Skill Academy",
    category: "training_center", // training_center | school | hospital | diagnostic
    approvedModules: ["foundational","preparatory"], // allowed modules
    pendingFees: [{type:"Affiliation Annual",amount:1200}],
    students: [],
    moduleRequests: []
  };
  localStorage.setItem('iibse_school', JSON.stringify(demo));
}

// login handling (for login page)
if (document.getElementById('schoolLoginForm')) {
  seedDemo();
  const form = qs('#schoolLoginForm');
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const email = qs('#loginEmail').value.trim();
    const pass = qs('#loginPassword').value.trim();
    // Demo credentials
    if (email === 'demo.school@iibse.in' && pass === 'password123') {
      // ensure demo exists
      seedDemo();
      window.location.href = 'school-dashboard.html';
    } else {
      alert('Invalid credentials (use demo.school@iibse.in / password123).');
    }
  });
}

// DASHBOARD PAGE LOGIC
function loadDashboard() {
  const raw = localStorage.getItem('iibse_school');
  if (!raw) {
    alert('No school data found. Please login with demo credentials.');
    window.location.href = 'school-login.html';
    return;
  }
  const school = JSON.parse(raw);
  qs('#schoolName').textContent = school.name;
  qs('#schoolCategory').textContent = 'Category: ' + (school.category || 'school');
  qs('#modulesList').textContent = school.approvedModules.join(', ') || 'None';
  qs('#statTotal').textContent = school.students.length;
  qs('#statPending').textContent = school.students.filter(s=>s.status==='Pending').length;
  qs('#statModules').textContent = school.approvedModules.length;

  // populate students table
  const tbody = qs('#studentsTbody');
  tbody.innerHTML = '';
  school.students.forEach((st, idx)=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${st.name}</td><td>${st.classOrCourse}</td><td>${st.status || 'Pending'}</td>
      <td>
        <button data-idx="${idx}" class="approveBtn">Approve</button>
        <button data-idx="${idx}" class="rejectBtn">Reject</button>
      </td>`;
    tbody.appendChild(tr);
  });

  // wire approve/reject
  qsa('.approveBtn').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const i = e.target.getAttribute('data-idx')*1;
      school.students[i].status = 'Approved';
      localStorage.setItem('iibse_school', JSON.stringify(school));
      loadDashboard();
    });
  });
  qsa('.rejectBtn').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const i = e.target.getAttribute('data-idx')*1;
      school.students[i].status = 'Rejected';
      localStorage.setItem('iibse_school', JSON.stringify(school));
      loadDashboard();
    });
  });
}

// Add student modal logic
if (qs('#btnAddStudent')) {
  qs('#btnAddStudent').addEventListener('click', ()=>{
    qs('#modalAdd').style.display = 'flex';
    populateClassSelect();
  });
  qs('#closeModal').addEventListener('click', ()=>qs('#modalAdd').style.display='none');

  qs('#addStudentForm').addEventListener('submit', e=>{
    e.preventDefault();
    const raw = JSON.parse(localStorage.getItem('iibse_school'));
    const fd = new FormData(e.target);
    const student = Object.fromEntries(fd.entries());
    student.status = 'Pending';
    // permission check: classOrCourse must be allowed
    const allowed = getAllowedClassValues(raw.approvedModules);
    if (!allowed.includes(student.classOrCourse)) {
      const yn = confirm('You are not permitted for this level. Apply for upper module? Click OK to make request.');
      if (yn) {
        raw.moduleRequests.push({module: mapClassToModule(student.classOrCourse), date: new Date().toISOString()});
        localStorage.setItem('iibse_school', JSON.stringify(raw));
        alert('Module request submitted (demo). Admin will review.');
      }
      return;
    }
    raw.students.push(student);
    localStorage.setItem('iibse_school', JSON.stringify(raw));
    qs('#modalAdd').style.display='none';
    loadDashboard();
    alert('Application saved (Pending).');
  });
}

// helper: map modules to allowed class list
function getAllowedClassValues(modules){
  // returns array of strings used in classSelect options
  const set = new Set();
  modules.forEach(m=>{
    if (m==='foundational') { set.add('Nursery/LKG/UKG'); set.add('Grade 1'); set.add('Grade 2') }
    if (m==='preparatory') { set.add('Grade 3'); set.add('Grade 4'); set.add('Grade 5') }
    if (m==='middle') { set.add('Grade 6'); set.add('Grade 7'); set.add('Grade 8') }
    if (m==='secondary') { set.add('Grade 9'); set.add('Grade 10'); set.add('Grade 11'); set.add('Grade 12') }
  });
  return Array.from(set);
}
function mapClassToModule(classVal){
  if (/Nursery|LKG|UKG|Grade 1|Grade 2/i.test(classVal)) return 'foundational';
  if (/Grade 3|Grade 4|Grade 5/i.test(classVal)) return 'preparatory';
  if (/Grade 6|Grade 7|Grade 8/i.test(classVal)) return 'middle';
  if (/Grade 9|Grade 10|Grade 11|Grade 12/i.test(classVal)) return 'secondary';
  return '';
}
function populateClassSelect(){
  const raw = JSON.parse(localStorage.getItem('iibse_school'));
  const sel = qs('#classSelect');
  sel.innerHTML = '';
  const allowed = getAllowedClassValues(raw.approvedModules);
  // if nothing allowed, show message and full list but block selection
  if (allowed.length===0){
    sel.innerHTML = '<option value="">No modules approved — please apply for module upgrade</option>';
    return;
  }
  allowed.forEach(v=>{
    const opt = document.createElement('option'); opt.value = v; opt.textContent = v; sel.appendChild(opt);
  });
}

// Apply Module modal
if (qs('#btnApplyModule')){
  qs('#btnApplyModule').addEventListener('click', ()=>qs('#modalApply').style.display='flex');
  qs('#closeApply').addEventListener('click', ()=>qs('#modalApply').style.display='none');
  qs('#submitModuleReq').addEventListener('click', ()=>{
    const sel = qs('#applyModuleSelect').value;
    const raw = JSON.parse(localStorage.getItem('iibse_school'));
    raw.moduleRequests.push({module: sel, date: new Date().toISOString()});
    localStorage.setItem('iibse_school', JSON.stringify(raw));
    qs('#modalApply').style.display='none';
    alert('Module upgrade request submitted (demo). Admin will review and approve.');
    loadDashboard();
  });
}

// Pay Now placeholder
if (qs('#btnPayNow')) {
  qs('#btnPayNow').addEventListener('click', ()=>{
    const raw = JSON.parse(localStorage.getItem('iibse_school'));
    if (raw.pendingFees && raw.pendingFees.length){
      const f = raw.pendingFees[0];
      const ok = confirm(`Pay ${f.type} — Amount ₹${f.amount}. Proceed?`);
      if (ok){
        // demo: mark paid
        raw.pendingFees.shift();
        localStorage.setItem('iibse_school', JSON.stringify(raw));
        alert('Payment successful (demo).');
        loadDashboard();
      }
    } else {
      alert('No pending fees.');
    }
  });
}

// Logout
if (qs('#btnLogout')) {
  qs('#btnLogout').addEventListener('click', ()=>{
    // For demo we simply go to login
    window.location.href = 'school-login.html';
  });
}

// On dashboard load
if (document.location.pathname.endsWith('/school-dashboard.html')) {
  seedDemo(); // ensure demo exists
  loadDashboard();
}
