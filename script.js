// ============ LOADER ============
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => loader.classList.add('hide'), 500);
  });

  // ============ CUSTOM CURSOR ============
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let mx = window.innerWidth/2, my = window.innerHeight/2;
  let rx = mx, ry = my;
  if(window.matchMedia('(pointer: fine)').matches){
    window.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    });
    function ringLoop(){
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(ringLoop);
    }
    ringLoop();
    document.querySelectorAll('a, button, .proj-card, .float-card').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('active'));
      el.addEventListener('mouseleave', () => ring.classList.remove('active'));
    });
  }

  // ============ PARTICLE NETWORK CANVAS ============
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];
  const COLORS = ['rgba(245,166,35,0.8)', 'rgba(82,217,196,0.8)'];

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COUNT = Math.min(90, Math.floor((window.innerWidth * window.innerHeight) / 16000));
  for(let i=0;i<COUNT;i++){
    particles.push({
      x: Math.random()*w, y: Math.random()*h,
      vx: (Math.random()-0.5)*0.35, vy: (Math.random()-0.5)*0.35,
      r: Math.random()*1.6 + 0.6,
      c: COLORS[i % 2]
    });
  }

  function tick(){
    ctx.clearRect(0,0,w,h);
    for(let p of particles){
      p.x += p.vx; p.y += p.vy;
      if(p.x < 0 || p.x > w) p.vx *= -1;
      if(p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = p.c;
      ctx.fill();
    }
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const a = particles[i], b = particles[j];
        const dx = a.x-b.x, dy = a.y-b.y;
        const dist = Math.sqrt(dx*dx+dy*dy);
        if(dist < 130){
          ctx.beginPath();
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(141,151,168,${0.14 * (1 - dist/130)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(tick);
  }
  tick();

  // ============ SCROLL REVEAL ============
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  // ============ SKILL BARS ON SCROLL ============
  const bars = document.querySelectorAll('.bar-fill');
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const fill = entry.target.getAttribute('data-fill');
        entry.target.style.width = fill + '%';
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  bars.forEach(b => barObserver.observe(b));

  // ============ MARQUEE CONTENT ============
  const certs = [
    'Generative AI Internship — Syncronota Technologies',
    'NPTEL — Joy of Computing Using Python',
    'Microsoft FutureSkills — Python Programming (40 Hrs)',
    'NASSCOM FutureSkills — Generative AI',
    'Cisco Networking Academy — Data Science Essentials',
    'HackerRank SQL (Intermediate)',
    'SOC Full Stack with Python',
    'UI Design with Flutter',
    'IoT Sustainable Development Goals',
    'Prompt Engineering with LLM (Guvi × HCL)'
  ];
  const track = document.getElementById('marquee');
  const buildSet = () => certs.map(c => `<span>${c}</span>`).join('');
  track.innerHTML = buildSet() + buildSet();

  // assign reveal directions already set via classes .left/.right/.up in markup where relevant
