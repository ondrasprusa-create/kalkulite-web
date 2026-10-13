/**
 * KALKULite – interakce prezentačního webu.
 * Vanilla JS, bez závislostí. Každý modul se inicializuje jen pokud na stránce najde své prvky.
 */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const czk = (n) => Math.round(n).toLocaleString('cs-CZ');

/* ---------- Navbar: pozadí po scrollu + mobilní menu ---------- */
function initNavbar() {
    const nav = $('[data-navbar]');
    if (!nav) return;

    const onScroll = () => {
        if (nav.dataset.menu !== 'open') nav.dataset.scrolled = window.scrollY > 12;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // Fullscreen mobilní menu
    const toggle = $('[data-menu-toggle]', nav);
    const overlay = $('[data-menu-overlay]');
    const label = $('.sr-only', toggle);
    const isOpen = () => overlay?.dataset.open === 'true';

    const setOpen = (open) => {
        if (!overlay || open === isOpen()) return;
        overlay.dataset.open = open;
        overlay.inert = !open;
        nav.dataset.menu = open ? 'open' : 'closed';
        toggle.setAttribute('aria-expanded', open);
        label.textContent = open ? 'Zavřít menu' : 'Otevřít menu';
        document.documentElement.classList.toggle('overflow-hidden', open);
        // Obsah za menu není dosažitelný klávesnicí ani čtečkou; fokus zůstává na tlačítku Zavřít
        const page = $('.page-canvas');
        if (page) page.inert = open;
        if (open) nav.dataset.scrolled = false; // hlavička splyne s menu
        else onScroll();
    };

    toggle?.addEventListener('click', () => setOpen(!isOpen()));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen()) { setOpen(false); toggle.focus(); }
    });
    // Při přechodu na desktop menu zavřít
    window.matchMedia('(min-width: 768px)').addEventListener('change', (e) => e.matches && setOpen(false));

    // Odkaz v menu: zavřít, odemknout scroll a teprve pak plynule sjet na sekci
    $$('a[href^="#"]', overlay).forEach((a) => a.addEventListener('click', (e) => {
        const target = $(a.hash);
        if (!target) return;
        e.preventDefault();
        setOpen(false);
        requestAnimationFrame(() => {
            target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
            history.pushState(null, '', a.hash);
        });
    }));

    // Zvýraznění aktivní sekce v menu
    const links = $$('[data-nav-link]');
    const io = new IntersectionObserver(
        (entries) => entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            links.forEach((l) => l.classList.toggle('text-white', l.hash === `#${entry.target.id}`));
        }),
        { rootMargin: '-45% 0px -50% 0px' },
    );
    links.forEach((l) => { const s = $(l.hash); s && io.observe(s); });
}

/* ---------- Reveal on scroll ---------- */
function initReveal() {
    const items = $$('[data-reveal]');
    if (!('IntersectionObserver' in window)) return items.forEach((el) => el.classList.add('is-visible'));

    const io = new IntersectionObserver(
        (entries) => entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
        }),
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    );
    items.forEach((el) => io.observe(el));
}

/* ---------- Spotlight na kartách (sleduje kurzor) ---------- */
function initSpotlight() {
    if (!finePointer) return;
    $$('[data-spotlight]').forEach((card) => {
        card.addEventListener('pointermove', (e) => {
            const r = card.getBoundingClientRect();
            card.style.setProperty('--mx', `${e.clientX - r.left}px`);
            card.style.setProperty('--my', `${e.clientY - r.top}px`);
        });
    });
}

/* ---------- Aura: blobs se jemně posouvají za myší ---------- */
function initAura() {
    if (reducedMotion || !finePointer) return;
    const blobs = $$('[data-aura-blob]');
    let raf;
    window.addEventListener('pointermove', (e) => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;
            blobs.forEach((b) => {
                const dir = Number(b.dataset.auraBlob);
                b.style.setProperty('--px', `${x * 40 * dir}px`);
                b.style.setProperty('--py', `${y * 30 * dir}px`);
            });
        });
    }, { passive: true });
}

/* ---------- 3D náklon telefonu + parallax štítků ---------- */
function initTilt() {
    if (reducedMotion || !finePointer) return;
    $$('[data-tilt-area]').forEach((area) => {
        const target = $('[data-tilt]', area);
        const layers = $$('[data-depth]', area);
        const zone = area.closest('section') ?? area;

        zone.addEventListener('pointermove', (e) => {
            const r = area.getBoundingClientRect();
            const x = (e.clientX - (r.left + r.width / 2)) / r.width;
            const y = (e.clientY - (r.top + r.height / 2)) / r.height;
            target.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 10}deg)`;
            layers.forEach((l) => {
                const d = Number(l.dataset.depth) / 100;
                l.style.translate = `${x * 40 * d}px ${y * 40 * d}px`;
            });
        });
        zone.addEventListener('pointerleave', () => {
            target.style.transform = '';
            layers.forEach((l) => (l.style.translate = ''));
        });
    });
}

/* ---------- Magnetická tlačítka ---------- */
function initMagnetic() {
    if (reducedMotion || !finePointer) return;
    $$('[data-magnetic]').forEach((btn) => {
        btn.addEventListener('pointermove', (e) => {
            const r = btn.getBoundingClientRect();
            const x = e.clientX - (r.left + r.width / 2);
            const y = e.clientY - (r.top + r.height / 2);
            btn.style.translate = `${x * 0.18}px ${y * 0.3}px`;
        });
        btn.addEventListener('pointerleave', () => (btn.style.translate = ''));
    });
}

/* ---------- Problém vs. řešení: přepínač ---------- */
function initCompare() {
    const box = $('[data-compare]');
    if (!box) return;
    let touched = false;

    const set = (state) => {
        box.dataset.state = state;
        $$('[data-compare-btn]', box).forEach((b) => b.setAttribute('aria-selected', b.dataset.compareBtn === state));
    };
    $$('[data-compare-btn]', box).forEach((b) => b.addEventListener('click', () => { touched = true; set(b.dataset.compareBtn); }));

    // Hravý moment: po chvíli na obrazovce se samo přepne na KALKULite
    const io = new IntersectionObserver(async ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        await sleep(1800);
        if (!touched) set('us');
    }, { threshold: 0.5 });
    io.observe(box);
}

/* ---------- Psaný text ---------- */
async function typeText(el, text, speed = 28) {
    el.textContent = '';
    if (reducedMotion) return (el.textContent = text);
    for (const ch of text) {
        el.textContent += ch;
        await sleep(speed);
    }
}

function addLine(list, label, price, delay = 0) {
    const li = document.createElement('li');
    li.className = 'flex justify-between gap-3 rounded-lg bg-white/5 px-3 py-2 animate-pop';
    li.style.animationDelay = `${delay}ms`;
    li.innerHTML = `<span class="text-slate-300"></span><span class="font-chakra font-semibold text-white whitespace-nowrap"></span>`;
    li.children[0].textContent = label;
    li.children[1].textContent = price;
    list.append(li);
}

/* ---------- Bento: ukázka hlasového zadání ---------- */
function initVoiceCard() {
    const card = $('[data-voice-card]');
    if (!card) return;
    const btn = $('[data-voice-trigger]', card);
    const status = $('[data-voice-status]', card);
    const text = $('[data-voice-text]', card);
    const items = $('[data-voice-items]', card);
    const total = $('[data-voice-total]', card);
    let running = false;

    btn.addEventListener('click', async () => {
        if (running) return;
        running = true;
        items.innerHTML = '';
        total.style.opacity = 0;
        status.textContent = '● Poslouchám…';
        await typeText(text, '„Pokládka vinylu v obýváku, třicet dva metrů, podložka, lišty, jeden a půl dne.“', 22);
        status.textContent = '⚙ AI počítá…';
        await sleep(600);
        const lines = [
            ['Vinyl 32 m² + 10 % prořez', '14 080 Kč'],
            ['Podložka + soklové lišty', '3 410 Kč'],
            ['Práce 1,5 dne', '5 560 Kč'],
        ];
        for (const [l, p] of lines) { addLine(items, l, p); await sleep(350); }
        total.style.opacity = 1;
        status.textContent = '✓ Nabídka hotová za 38 s';
        running = false;
    });
}

/* ---------- KALKULite Index kalkulačka ---------- */
function initIndexCalc() {
    const root = $('[data-index-calc]');
    if (!root) return;

    const COST_PER_KM = 7;     // Kč/km (palivo + opotřebení)
    const AVG_SPEED = 60;      // km/h
    const TOP_RATE = 1100;     // Kč/h čistého = index 10

    const inputs = $$('input[type=range]', root);
    const setOut = (k, v) => $$(`[data-out="${k}"]`, root).forEach((el) => (el.textContent = v));
    const arc = $('[data-gauge-arc]', root);
    const needle = $('[data-gauge-needle]', root);

    const update = () => {
        const v = Object.fromEntries(inputs.map((i) => [i.name, Number(i.value)]));
        inputs.forEach((i) => {
            const pct = ((i.value - i.min) / (i.max - i.min)) * 100;
            i.style.setProperty('--fill', `${pct}%`);
            const o = $(`[data-range-out="${i.name}"]`, root);
            if (o) o.textContent = czk(i.value);
        });

        const travel = v.km * COST_PER_KM;
        const net = v.price - v.material - travel;
        const totalHours = v.hours + v.km / AVG_SPEED;
        const hourly = net / totalHours;
        const index = Math.max(0, Math.min(10, (hourly / TOP_RATE) * 10));

        setOut('index', index.toFixed(1).replace('.', ','));
        setOut('hourly', czk(hourly));
        setOut('travel', czk(travel));

        const verdict = index >= 6.5 ? 'good' : index >= 3.5 ? 'meh' : 'bad';
        root.dataset.verdict = verdict;
        setOut('verdict', { good: 'Vyplatí se ✓', meh: 'Na hraně – zvaž cenu', bad: 'Jen pálíš naftu ✕' }[verdict]);

        arc.style.strokeDashoffset = 100 - index * 10;
        needle.style.transform = `rotate(${index * 18}deg)`;
    };

    inputs.forEach((i) => i.addEventListener('input', update));
    update();
}

/* ---------- Demo dialog ---------- */
function initDemo() {
    const dialog = $('[data-demo-dialog]');
    if (!dialog) return;
    const transcript = $('[data-demo-transcript]', dialog);
    const list = $('[data-demo-items]', dialog);
    const total = $('[data-demo-total]', dialog);
    const ring = $('[data-demo-ring]', dialog);
    const steps = $$('[data-demo-step]', dialog);
    let run = 0;

    const step = (n) => steps.forEach((s) => (s.dataset.active = Number(s.dataset.demoStep) <= n));

    const play = async () => {
        const id = ++run;
        const alive = () => id === run && dialog.open;
        list.innerHTML = '';
        total.style.opacity = 0;
        ring.hidden = false;
        step(1);
        await typeText(transcript, '„Koupelna Novák, obklad dvanáct metrů, lepidlo, spárovačka, dva dny práce.“', 26);
        if (!alive()) return;
        ring.hidden = true;
        step(2);
        await sleep(500);
        for (const [l, p] of [['Obklad 12 m² + 10 % prořez', '7 920 Kč'], ['Lepidlo, spárovačka, penetrace', '1 950 Kč'], ['Práce 2 dny', '8 580 Kč']]) {
            if (!alive()) return;
            addLine(list, l, p);
            await sleep(450);
        }
        step(3);
        total.style.opacity = 1;
    };

    $$('[data-demo-open]').forEach((el) => el.addEventListener('click', (e) => {
        e.preventDefault();
        dialog.showModal();
        play();
    }));
    $('[data-demo-close]', dialog).addEventListener('click', () => dialog.close());
    $('[data-demo-replay]', dialog).addEventListener('click', play);
    dialog.addEventListener('click', (e) => e.target === dialog && dialog.close());
}

/* ---------- Konfety ---------- */
function confetti(originEl) {
    if (reducedMotion) return;
    const r = originEl.getBoundingClientRect();
    const colors = ['#0c92e9', '#1fb8aa', '#ffffff', '#16a5ca'];
    for (let i = 0; i < 60; i++) {
        const p = document.createElement('span');
        p.className = 'confetti';
        p.style.background = colors[i % colors.length];
        p.style.left = `${r.left + r.width / 2}px`;
        p.style.top = `${r.top + r.height / 2}px`;
        document.body.append(p);
        const angle = Math.random() * Math.PI * 2;
        const dist = 120 + Math.random() * 220;
        p.animate([
            { transform: 'translate(-50%,-50%) rotate(0)', opacity: 1 },
            { transform: `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist + 200}px) rotate(${Math.random() * 720}deg)`, opacity: 0 },
        ], { duration: 1200 + Math.random() * 600, easing: 'cubic-bezier(.2,.7,.3,1)' }).onfinish = () => p.remove();
    }
}

/* ---------- Waitlist formulář ---------- */
function initWaitlist() {
    const form = $('[data-waitlist-form]');
    if (!form) return;

    const planInput = $('[data-plan-input]', form);
    const planNote = $('[data-plan-note]', form);
    const errorsBox = $('[data-form-errors]', form);
    const submit = $('[data-submit]', form);

    // Předvyplnění tarifu z karty ceníku
    const setPlan = (handle, label) => {
        planInput.value = handle;
        $('[data-plan-label]', planNote).textContent = label;
        planNote.classList.remove('hidden');
    };
    $$('[data-plan]').forEach((btn) => btn.addEventListener('click', () => {
        const name = btn.closest('article')?.querySelector('h3')?.textContent.trim() ?? btn.dataset.plan;
        setPlan(btn.dataset.plan, name);
    }));

    const showErrors = (messages) => {
        errorsBox.innerHTML = '';
        messages.forEach((m) => { const p = document.createElement('p'); p.textContent = m; errorsBox.append(p); });
        errorsBox.classList.toggle('hidden', !messages.length);
        if (messages.length) {
            errorsBox.classList.remove('animate-wiggle');
            void errorsBox.offsetWidth;
            errorsBox.classList.add('animate-wiggle');
        }
    };

    const validate = () => {
        const msgs = [];
        const email = form.elements.email;
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
        email.setAttribute('aria-invalid', !emailOk);
        if (!emailOk) msgs.push('Zadej prosím platný e-mail.');
        if (!form.querySelector('input[name=trade]:checked')) msgs.push('Vyber, čím se živíš.');
        return msgs;
    };

    form.elements.email.addEventListener('input', (e) => e.target.removeAttribute('aria-invalid'));

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const msgs = validate();
        showErrors(msgs);
        if (msgs.length) return;

        submit.disabled = true;
        $('[data-submit-spinner]', form).classList.remove('hidden');
        $('[data-submit-label]', form).textContent = 'Odesílám…';

        try {
            const res = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || data.success === false) {
                showErrors(Object.values(data.errors ?? { e: ['Něco se pokazilo. Zkus to prosím znovu.'] }).flat());
                return;
            }
            $('[data-form-fields]', form).classList.add('hidden');
            $('[data-form-success]', form).classList.remove('hidden');
            confetti(form);
        } catch {
            showErrors(['Nepodařilo se spojit se serverem. Zkontroluj připojení a zkus to znovu.']);
        } finally {
            submit.disabled = false;
            $('[data-submit-spinner]', form).classList.add('hidden');
            $('[data-submit-label]', form).textContent = 'Zapsat se do waitlistu';
        }
    });
}

[
    initNavbar, initReveal, initSpotlight, initAura, initTilt,
    initMagnetic, initCompare, initVoiceCard, initIndexCalc, initDemo, initWaitlist,
].forEach((fn) => {
    try { fn(); } catch (err) { console.error(`[KALKULite] ${fn.name}`, err); }
});
