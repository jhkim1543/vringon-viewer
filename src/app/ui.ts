/** 아주 작은 DOM 컨트롤 헬퍼 — 프레임워크 없이 패널을 만든다. */

export function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, html?: string): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  return e;
}

/** 섹션 아이콘 (stroke 1.6, 20px) — VRING:ON 좌측 레일 톤 */
export const ICONS: Record<string, string> = {
  still: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="12" cy="12" r="3.2"/><path d="M7 5l1.2-2h7.6L17 5"/></svg>',
  render: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14l4-8 4 6 3-4 5 6"/><path d="M4 19h16"/></svg>',
  env: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><path d="M4 12h16M12 4c2.5 2.6 2.5 13.4 0 16M12 4c-2.5 2.6-2.5 13.4 0 16"/></svg>',
  light: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/></svg>',
  camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z"/></svg>',
  floor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l9 4 9-4M3 12l9 4 9-4M12 3l9 4-9 4-9-4 9-4z"/></svg>',
  post: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M4 12h16M4 18h16"/><circle cx="9" cy="6" r="2" fill="currentColor"/><circle cx="15" cy="12" r="2" fill="currentColor"/><circle cx="8" cy="18" r="2" fill="currentColor"/></svg>',
  material: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><path d="M8 10a4 4 0 0 1 6-2"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>',
};

/**
 * 패널 섹션 = 탭 하나의 내용. 우측 패널 상단의 탭 스트립(아이콘+라벨)으로 전환한다.
 * (참고 컨셉: 우측 패널 · 상단 탭 Tracer/Camera/Light/Material/… · 아래 접이식 그룹)
 */
export class Section {
  static all: Section[] = [];
  static tabsEl: HTMLElement | null = null;
  static active: Section | null = null;
  readonly root: HTMLElement;
  readonly body: HTMLElement;
  readonly title: string;
  readonly icon: string;
  readonly short: string;
  tabBtn: HTMLButtonElement | null = null;

  constructor(parent: HTMLElement, title: string, _collapsed = false, icon = 'render', short?: string) {
    this.title = title;
    this.icon = icon;
    this.short = short ?? title;
    this.root = el('div', 'section tab-section');
    this.body = el('div', 'section-body');
    this.root.append(this.body);
    parent.appendChild(this.root);
    Section.all.push(this);
  }

  /** 탭 스트립을 만들고 첫(또는 지정) 섹션을 활성화 */
  static buildTabs(host: HTMLElement, initial?: string) {
    Section.tabsEl = host;
    host.innerHTML = '';
    for (const s of Section.all) {
      const b = el('button', 'tab-btn');
      b.innerHTML = (ICONS[s.icon] ?? ICONS.render) + `<span>${s.short}</span>`;
      b.title = s.title;
      b.addEventListener('click', () => Section.show(s));
      host.appendChild(b);
      s.tabBtn = b;
    }
    const first = Section.all.find((s) => s.title === initial || s.short === initial) ?? Section.all[0];
    if (first) Section.show(first);
  }

  static show(sec: Section) {
    Section.active = sec;
    for (const s of Section.all) {
      s.root.classList.toggle('active', s === sec);
      s.tabBtn?.classList.toggle('on', s === sec);
    }
    document.getElementById('panel-sections')?.scrollTo({ top: 0 });
  }

  static showByTitle(title: string) {
    const s = Section.all.find((x) => x.title === title || x.short === title);
    if (s) Section.show(s);
  }
}

/** 접이식 그룹 (참고 컨셉의 "Path Tracer / Scene / Denoising / Advanced" 행) */
export function group(parent: HTMLElement, title: string, open = true, right?: HTMLElement): HTMLElement {
  const root = el('div', 'group' + (open ? ' open' : ''));
  const head = el('div', 'group-head');
  head.append(el('span', 'group-title', title));
  if (right) {
    right.addEventListener('click', (e) => e.stopPropagation());
    head.append(right);
  }
  head.append(el('span', 'chev', '▾'));
  const body = el('div', 'group-body');
  head.addEventListener('click', () => root.classList.toggle('open'));
  root.append(head, body);
  parent.appendChild(root);
  return body;
}

/** 값 표시용 한 줄 (label … value) */
export function kv(parent: HTMLElement, label: string, value: string) {
  const row = el('div', 'row wide kvrow');
  const lab = el('label', undefined, label);
  const val = el('span', 'kvval', value);
  row.append(lab, val);
  parent.appendChild(row);
  return {
    row,
    set(v: string) {
      val.textContent = v;
    },
  };
}

export interface SliderOpts {
  min: number;
  max: number;
  step: number;
  value: number;
  format?: (v: number) => string;
  onInput: (v: number) => void;
  /** true 면 드래그 중이 아니라 놓을 때만 반영 (BVH 재빌드 등 무거운 작업) */
  lazy?: boolean;
}

export function slider(parent: HTMLElement, label: string, o: SliderOpts) {
  const row = el('div', 'row');
  const lab = el('label', undefined, label);
  const input = el('input');
  input.type = 'range';
  input.min = String(o.min);
  input.max = String(o.max);
  input.step = String(o.step);
  input.value = String(o.value);
  const val = el('span', 'val');
  const fmt = o.format ?? ((v: number) => (Number.isInteger(o.step) ? String(v) : v.toFixed(2)));
  val.textContent = fmt(o.value);
  input.addEventListener('input', () => {
    const v = parseFloat(input.value);
    val.textContent = fmt(v);
    if (!o.lazy) o.onInput(v);
  });
  if (o.lazy) input.addEventListener('change', () => o.onInput(parseFloat(input.value)));
  row.append(lab, input, val);
  parent.appendChild(row);
  return {
    row,
    input,
    set(v: number) {
      input.value = String(v);
      val.textContent = fmt(v);
    },
  };
}

export function select<T extends string>(
  parent: HTMLElement,
  label: string,
  options: { value: T; label: string }[],
  value: T,
  onChange: (v: T) => void,
) {
  const row = el('div', 'row wide');
  const lab = el('label', undefined, label);
  const sel = el('select');
  for (const o of options) {
    const opt = el('option');
    opt.value = o.value;
    opt.textContent = o.label;
    sel.appendChild(opt);
  }
  sel.value = value;
  sel.addEventListener('change', () => onChange(sel.value as T));
  row.append(lab, sel);
  parent.appendChild(row);
  return {
    row,
    sel,
    set(v: T) {
      sel.value = v;
    },
    setOptions(opts: { value: T; label: string }[], v: T) {
      sel.innerHTML = '';
      for (const o of opts) {
        const opt = el('option');
        opt.value = o.value;
        opt.textContent = o.label;
        sel.appendChild(opt);
      }
      sel.value = v;
    },
  };
}

export function toggle(parent: HTMLElement, label: string, value: boolean, onChange: (v: boolean) => void) {
  const row = el('div', 'row wide');
  const lab = el('label', undefined, label);
  const wrap = el('label', 'toggle');
  const input = el('input');
  input.type = 'checkbox';
  input.checked = value;
  input.addEventListener('change', () => onChange(input.checked));
  wrap.appendChild(input);
  row.append(lab, wrap);
  parent.appendChild(row);
  return {
    row,
    input,
    set(v: boolean) {
      input.checked = v;
    },
  };
}

export function color(parent: HTMLElement, label: string, value: string, onChange: (v: string) => void) {
  const row = el('div', 'row wide');
  const lab = el('label', undefined, label);
  const input = el('input');
  input.type = 'color';
  input.value = value;
  input.addEventListener('input', () => onChange(input.value));
  row.append(lab, input);
  parent.appendChild(row);
  return {
    row,
    input,
    set(v: string) {
      input.value = v;
    },
  };
}

export function chips<T extends string>(parent: HTMLElement, options: { value: T; label: string }[], value: T, onChange: (v: T) => void) {
  const wrap = el('div', 'chips');
  const buttons = new Map<T, HTMLButtonElement>();
  const setActive = (v: T) => buttons.forEach((b, k) => b.classList.toggle('active', k === v));
  for (const o of options) {
    const b = el('button', 'chip', o.label);
    b.addEventListener('click', () => {
      setActive(o.value);
      onChange(o.value);
    });
    buttons.set(o.value, b);
    wrap.appendChild(b);
  }
  setActive(value);
  parent.appendChild(wrap);
  return { wrap, set: setActive };
}

export function button(parent: HTMLElement, label: string, onClick: () => void, cls = 'btn small') {
  const b = el('button', cls, label);
  b.addEventListener('click', onClick);
  parent.appendChild(b);
  return b;
}

export function hint(parent: HTMLElement, text: string) {
  const h = el('div', 'hint', text);
  parent.appendChild(h);
  return h;
}

export function subgroup(parent: HTMLElement, title: string, right?: HTMLElement) {
  const g = el('div', 'subgroup');
  const head = el('div', 'subhead');
  head.appendChild(el('span', undefined, title));
  if (right) head.appendChild(right);
  g.appendChild(head);
  parent.appendChild(g);
  return g;
}

let toastTimer = 0;
export function toast(msg: string, ms = 3500) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => t.classList.remove('show'), ms);
}
