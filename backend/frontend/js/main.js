// main.js - slider, marquee, forms
(() => {
  // Slider images (Unsplash sample)
  const slides = [
    { img: "https://images.unsplash.com/photo-1532619187600-60d6d4a6a3a8?w=1600&q=80&auto=format&fit=crop", title: "Modern Skill-based Learning", subtitle:"Practical courses for real-world jobs" },
    { img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&q=80&auto=format&fit=crop", title: "Digital Classrooms & Exams", subtitle:"Automated evaluation & certification" },
    { img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1600&q=80&auto=format&fit=crop", title: "Empowering Rural Education", subtitle:"Access & quality for every student" }
  ];

  // Build slider
  function createSlider() {
    const slider = document.querySelector(".slider");
    if (!slider) return;
    slides.forEach((s, i) => {
      const div = document.createElement("div");
      div.className = "slide" + (i===0?" active":"");
      div.innerHTML = `<img src="${s.img}" alt="${s.title}"><div class="overlay"><h1>${s.title}</h1><p>${s.subtitle}</p></div>`;
      slider.appendChild(div);
    });
    // controls
    const controls = document.querySelector(".slider-controls");
    slides.forEach((_,i)=>{
      const btn = document.createElement("button");
      btn.innerText = i+1;
      if(i===0) btn.classList.add("active");
      btn.addEventListener("click", ()=> setSlide(i));
      controls.appendChild(btn);
    });
    let current = 0;
    let timer = setInterval(()=> setSlide((current+1)%slides.length), 5000);
    function setSlide(idx){
      document.querySelectorAll(".slide").forEach((el, i)=> el.classList.toggle("active", i===idx));
      document.querySelectorAll(".slider-controls button").forEach((b,i)=> b.classList.toggle("active", i===idx));
      current = idx;
      clearInterval(timer);
      timer = setInterval(()=> setSlide((current+1)%slides.length), 5000);
    }
  }

  // Build photo grid sample
  function populatePhotos(){
    const grid = document.querySelector(".photo-grid");
    if(!grid) return;
    const items = [
      {img:"https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=1600&q=80&auto=format&fit=crop", title:"Skill Labs"},
      {img:"https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=1600&q=80&auto=format&fit=crop", title:"Practical Training"},
      {img:"https://images.unsplash.com/photo-1548095115-45697e4b71b9?w=1600&q=80&auto=format&fit=crop", title:"Digital Exams"},
      {img:"https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?w=1600&q=80&auto=format&fit=crop", title:"Student Projects"}
    ];
    items.forEach(it=>{
      const el = document.createElement("div");
      el.className = "item";
      el.innerHTML = `<img src="${it.img}" alt="${it.title}"><h4>${it.title}</h4><p style="font-size:13px;color:#555;margin-top:6px">Short description about ${it.title} and how IIBSE supports it.</p>`;
      grid.appendChild(el);
    });
  }

  // Form handlers (student, contact, affiliation)
  function attachForms(){
    // Student registration
    const studentForm = document.getElementById("studentForm");
    if(studentForm){
      studentForm.addEventListener("submit", async (e)=>{
        e.preventDefault();
        const msg = document.getElementById("studentMsg");
        msg.textContent = "Submitting...";
        msg.style.color = "black";
        const data = Object.fromEntries(new FormData(studentForm).entries());
        try {
          const res = await fetch("/student-register", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(data) });
          const j = await res.json();
          if (j.success) { msg.textContent = j.message; msg.style.color="green"; studentForm.reset(); }
          else { msg.textContent = j.message || "Submission failed"; msg.style.color="red"; }
        } catch(err){ msg.textContent = "Network error"; msg.style.color="red"; }
      });
    }

    // Contact
    const contactForm = document.getElementById("contactForm");
    if(contactForm){
      contactForm.addEventListener("submit", async (e)=>{
        e.preventDefault();
        const msg = document.getElementById("contactMsg");
        msg.textContent = "Submitting...";
        const data = Object.fromEntries(new FormData(contactForm).entries());
        try {
          const res = await fetch("/contact-submit", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(data) });
          const j = await res.json();
          if(j.success){ msg.textContent = j.message; msg.style.color="green"; contactForm.reset(); }
          else { msg.textContent = j.message||"Error"; msg.style.color="red"; }
        } catch { msg.textContent="Network error"; msg.style.color="red"; }
      });
    }

    // Affiliation
    const affForm = document.getElementById("affForm");
    if(affForm){
      affForm.addEventListener("submit", async (e)=>{
        e.preventDefault();
        const msg = document.getElementById("affMsg");
        msg.textContent = "Submitting...";
        const data = Object.fromEntries(new FormData(affForm).entries());
        try {
          const res = await fetch("/affiliation-submit", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(data) });
          const j = await res.json();
          if(j.success){ msg.textContent = j.message; msg.style.color="green"; affForm.reset(); }
          else { msg.textContent = j.message || "Error"; msg.style.color="red"; }
        } catch { msg.textContent="Network error"; msg.style.color="red"; }
      });
    }
  }

  // Initialize
  document.addEventListener("DOMContentLoaded", ()=>{
    createSlider();
    populatePhotos();
    attachForms();
  });
})();
