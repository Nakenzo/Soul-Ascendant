const HUD_STORAGE_KEY = "soul-ascendant-hud-v2";

const HUD_DEFAULT = {
  joy:    { x: 15.0, y: 75.0, s: 1.0 },
  serang: { x: 85.4, y: 79.0, s: 1.0 },
  skill1: { x: 79.7, y: 61.5, s: 1.0 },
  skill2: { x: 74.8, y: 69.0, s: 1.0 },
  skill3: { x: 72.0, y: 79.0, s: 1.0 },
  dash:   { x: 92.4, y: 87.7, s: 1.0 },
  ult:    { x: 50.0, y: 88.8, s: 1.0 },
  pause:  { x: 97.5, y: 3.7,  s: 1.0 },
  barHp:  { x: 12.0, y: 9.6,  s: 1.0 }
};

const HUD_LABELS = {
  joy: "JOYSTICK (GERAK)",
  serang: "TOMBOL SERANG",
  skill1: "SKILL 1",
  skill2: "SKILL 2",
  skill3: "SKILL 3",
  dash: "TOMBOL DASH",
  ult: "SOUL / ULTIMATE BAR",
  pause: "TOMBOL PAUSE",
  barHp: "BAR HP & SKILL"
};

let _hudConfigCache = null;
let _hudDraftConfig = null;
let _hudItemTerpilih = "joy";
let _hudDragState = null;
let _hudListenerDipasang = false;

function cloneHudConfig(src) {
  const res = {};
  for (const k in HUD_DEFAULT) {
    if (src && src[k]) {
      res[k] = {
        x: typeof src[k].x === "number" ? Math.max(2, Math.min(98, src[k].x)) : HUD_DEFAULT[k].x,
        y: typeof src[k].y === "number" ? Math.max(2, Math.min(98, src[k].y)) : HUD_DEFAULT[k].y,
        s: typeof src[k].s === "number" ? Math.max(0.5, Math.min(2.5, src[k].s)) : HUD_DEFAULT[k].s
      };
    } else {
      res[k] = { ...HUD_DEFAULT[k] };
    }
  }
  return res;
}

function muatHudConfig() {
  if (_hudConfigCache) return _hudConfigCache;
  try {
    const raw = localStorage.getItem(HUD_STORAGE_KEY) || localStorage.getItem("soul-essence-hud-v2");
    if (raw) {
      const parsed = JSON.parse(raw);
      _hudConfigCache = cloneHudConfig(parsed);
      return _hudConfigCache;
    }
  } catch (err) {}
  _hudConfigCache = cloneHudConfig(HUD_DEFAULT);
  return _hudConfigCache;
}

function ambilHudConfig() {
  return muatHudConfig();
}

function simpanHudConfig(cfg) {
  _hudConfigCache = cloneHudConfig(cfg);
  try {
    localStorage.setItem(HUD_STORAGE_KEY, JSON.stringify(_hudConfigCache));
  } catch (err) {}
  terapkanHudConfig();
}

function resetHudConfig() {
  try {
    localStorage.removeItem(HUD_STORAGE_KEY);
  } catch (err) {}
  _hudConfigCache = null;
  _hudDraftConfig = cloneHudConfig(HUD_DEFAULT);
  terapkanHudConfig();
}

function ambilHudSkalaJoy() {
  const raw = localStorage.getItem(HUD_STORAGE_KEY);
  if (!raw) return 1.0;
  const cfg = muatHudConfig();
  return (cfg && cfg.joy && cfg.joy.s) ? cfg.joy.s : 1.0;
}

function ambilHudSkalaSerang() {
  const raw = localStorage.getItem(HUD_STORAGE_KEY);
  if (!raw) return 1.0;
  const cfg = muatHudConfig();
  return (cfg && cfg.serang && cfg.serang.s) ? cfg.serang.s : 1.0;
}

function ambilHudPosBar(W, H, s, m, defW, defH) {
  const raw = localStorage.getItem(HUD_STORAGE_KEY);
  if (!raw) return null;
  const cfg = muatHudConfig();
  if (!cfg || !cfg.barHp) return null;
  const c = cfg.barHp;
  const sk = s * (c.s || 1.0);
  const w = Math.round(defW * (c.s || 1.0));
  const h = Math.round(defH * (c.s || 1.0));
  const x = Math.max(0, Math.round((c.x / 100) * W - w / 2));
  const blockH = Math.round((defH * 3.3) * (c.s || 1.0));
  const y = Math.max(0, Math.round((c.y / 100) * H - blockH / 2));
  return { x: x, y: y, s: sk, w: w, h: h };
}

function ambilHudPosUlt(W, H, defW, defH, defX, defY) {
  const raw = localStorage.getItem(HUD_STORAGE_KEY);
  if (!raw) return null;
  const cfg = muatHudConfig();
  if (!cfg || !cfg.ult) return null;
  const c = cfg.ult;
  const w = Math.round(defW * (c.s || 1.0));
  const h = Math.round(defH * (c.s || 1.0));
  const x = Math.round((c.x / 100) * W - w / 2);
  const y = Math.round((c.y / 100) * H - h / 2);
  return { x: x, y: y, w: w, h: h };
}

function terapkanHudConfig() {
  if (typeof deviceTerpilih === "string" && deviceTerpilih !== "mobile") return;
  const raw = localStorage.getItem(HUD_STORAGE_KEY);
  const ks = document.getElementById("kontrolSentuh");

  if (!raw) {
    if (ks) ks.classList.remove("hud-custom-aktif");
    const joyEl = document.getElementById("joyBase");
    if (joyEl) {
      joyEl.style.left = "";
      joyEl.style.top = "";
      joyEl.style.bottom = "";
      joyEl.style.transform = "";
    }
    const serangEl = document.getElementById("tombolSerang");
    if (serangEl) {
      serangEl.style.left = "";
      serangEl.style.top = "";
      serangEl.style.transform = "";
    }
    const s1El = document.getElementById("tombolSkill");
    if (s1El) { s1El.style.left = ""; s1El.style.top = ""; s1El.style.transform = ""; }
    const s2El = document.getElementById("tombolSkill2");
    if (s2El) { s2El.style.left = ""; s2El.style.top = ""; s2El.style.transform = ""; }
    const s3El = document.getElementById("tombolSkill3");
    if (s3El) { s3El.style.left = ""; s3El.style.top = ""; s3El.style.transform = ""; }
    const dashEl = document.getElementById("tombolDash");
    if (dashEl) { dashEl.style.left = ""; dashEl.style.top = ""; dashEl.style.transform = ""; }
    const ultEl = document.getElementById("tombolUlt");
    if (ultEl) {
      ultEl.style.left = "";
      ultEl.style.top = "";
      ultEl.style.bottom = "";
      ultEl.style.width = "";
      ultEl.style.height = "";
      ultEl.style.transform = "";
    }
    const pauseEl = document.getElementById("tombolPause");
    if (pauseEl) {
      pauseEl.style.left = "";
      pauseEl.style.top = "";
      pauseEl.style.right = "";
      pauseEl.style.transform = "";
    }
    return;
  }

  if (ks) ks.classList.add("hud-custom-aktif");
  const cfg = muatHudConfig();

  const joyEl = document.getElementById("joyBase");
  if (joyEl) {
    joyEl.style.left = cfg.joy.x + "%";
    joyEl.style.top = cfg.joy.y + "%";
    joyEl.style.bottom = "auto";
    joyEl.style.transform = "translate(-50%, -50%) scale(" + cfg.joy.s + ")";
  }

  const serangEl = document.getElementById("tombolSerang");
  if (serangEl) {
    serangEl.style.left = cfg.serang.x + "%";
    serangEl.style.top = cfg.serang.y + "%";
    serangEl.style.transform = "translate(-50%, -50%) scale(" + cfg.serang.s + ")";
  }

  const s1El = document.getElementById("tombolSkill");
  if (s1El) {
    s1El.style.left = cfg.skill1.x + "%";
    s1El.style.top = cfg.skill1.y + "%";
    s1El.style.transform = "translate(-50%, -50%) scale(" + cfg.skill1.s + ")";
  }

  const s2El = document.getElementById("tombolSkill2");
  if (s2El) {
    s2El.style.left = cfg.skill2.x + "%";
    s2El.style.top = cfg.skill2.y + "%";
    s2El.style.transform = "translate(-50%, -50%) scale(" + cfg.skill2.s + ")";
  }

  const s3El = document.getElementById("tombolSkill3");
  if (s3El) {
    s3El.style.left = cfg.skill3.x + "%";
    s3El.style.top = cfg.skill3.y + "%";
    s3El.style.transform = "translate(-50%, -50%) scale(" + cfg.skill3.s + ")";
  }

  const dashEl = document.getElementById("tombolDash");
  if (dashEl) {
    dashEl.style.left = cfg.dash.x + "%";
    dashEl.style.top = cfg.dash.y + "%";
    dashEl.style.transform = "translate(-50%, -50%) scale(" + cfg.dash.s + ")";
  }

  const ultEl = document.getElementById("tombolUlt");
  if (ultEl) {
    ultEl.style.left = cfg.ult.x + "%";
    ultEl.style.top = cfg.ult.y + "%";
    ultEl.style.bottom = "auto";
    ultEl.style.width = (34 * cfg.ult.s) + "%";
    ultEl.style.height = (4.5 * cfg.ult.s) + "%";
    ultEl.style.transform = "translate(-50%, -50%)";
  }

  const pauseEl = document.getElementById("tombolPause");
  if (pauseEl) {
    pauseEl.style.left = cfg.pause.x + "%";
    pauseEl.style.top = cfg.pause.y + "%";
    pauseEl.style.right = "auto";
    pauseEl.style.transform = "translate(-50%, -50%) scale(" + cfg.pause.s + ")";
  }
}

function bukaHudEditor() {
  const layar = document.getElementById("layarHudEditor");
  if (!layar) return;
  _hudDraftConfig = cloneHudConfig(muatHudConfig());
  _hudItemTerpilih = "joy";

  const layarSet = document.getElementById("layarSetting");
  if (layarSet) layarSet.classList.add("hidden");

  const toolbar = document.querySelector(".hud-editor-toolbar");
  if (toolbar) toolbar.classList.remove("terlipat");
  const btnLipat = document.getElementById("hudBtnLipatToolbar");
  if (btnLipat) btnLipat.innerHTML = "&#9660; SEMBUNYIKAN";

  layar.classList.remove("hidden");
  pasangHudEditorListeners();
  segarkanHudEditor();
}

function tutupHudEditor() {
  const layar = document.getElementById("layarHudEditor");
  if (layar) layar.classList.add("hidden");

  const layarSet = document.getElementById("layarSetting");
  if (layarSet) {
    layarSet.classList.remove("hidden");
    if (typeof segarkanPengaturanUI === "function") segarkanPengaturanUI();
    return;
  }
  if (typeof tampilkanJudul === "function") tampilkanJudul();
}

function segarkanHudEditor() {
  if (!_hudDraftConfig) return;
  const area = document.getElementById("hudEditorArea");
  if (!area) return;

  const items = area.querySelectorAll(".hud-item");
  items.forEach((item) => {
    const id = item.getAttribute("data-id");
    if (!id || !_hudDraftConfig[id]) return;
    const c = _hudDraftConfig[id];
    item.style.left = c.x + "%";
    item.style.top = c.y + "%";
    item.style.transform = "translate(-50%, -50%) scale(" + c.s + ")";
    item.classList.toggle("terpilih", id === _hudItemTerpilih);
  });

  const labelEl = document.getElementById("hudNamaTerpilih");
  if (labelEl) {
    labelEl.textContent = HUD_LABELS[_hudItemTerpilih] || _hudItemTerpilih.toUpperCase();
  }

  const curS = _hudDraftConfig[_hudItemTerpilih] ? _hudDraftConfig[_hudItemTerpilih].s : 1.0;
  const slider = document.getElementById("hudSliderUkuran");
  if (slider) {
    slider.value = String(Math.round(curS * 100));
  }
  const nilaiEl = document.getElementById("hudNilaiUkuran");
  if (nilaiEl) {
    nilaiEl.textContent = Math.round(curS * 100) + "%";
  }

  const kar = typeof karakter !== "undefined" ? karakter : null;
  if (kar && typeof ambilIkonTreeNodeSvg === "function") {
    const pemetaanSvg = [
      { id: "hudItemSerang", nodeId: "serang" },
      { id: "hudItemSkill1", nodeId: "skill1" },
      { id: "hudItemSkill2", nodeId: "skill2" },
      { id: "hudItemSkill3", nodeId: "skill3" }
    ];
    for (let i = 0; i < pemetaanSvg.length; i++) {
      const el = document.getElementById(pemetaanSvg[i].id);
      if (!el) continue;
      const wadah = el.querySelector(".hud-item-svg");
      if (!wadah) continue;
      const svg = ambilIkonTreeNodeSvg(pemetaanSvg[i].nodeId, kar);
      if (svg && wadah.dataset.svgKunci !== pemetaanSvg[i].nodeId + "_" + kar.kunci) {
        wadah.innerHTML = svg;
        wadah.dataset.svgKunci = pemetaanSvg[i].nodeId + "_" + kar.kunci;
      }
    }
  }
}

function pasangHudEditorListeners() {
  if (_hudListenerDipasang) return;
  _hudListenerDipasang = true;

  const area = document.getElementById("hudEditorArea");
  if (area) {
    const items = area.querySelectorAll(".hud-item");
    items.forEach((item) => {
      const id = item.getAttribute("data-id");
      if (!id) return;

      item.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        e.stopPropagation();
        _hudItemTerpilih = id;
        const rect = area.getBoundingClientRect();
        _hudDragState = {
          id: id,
          pointerId: e.pointerId,
          startX: e.clientX,
          startY: e.clientY,
          initX: _hudDraftConfig[id].x,
          initY: _hudDraftConfig[id].y,
          rectW: rect.width,
          rectH: rect.height
        };
        try { item.setPointerCapture(e.pointerId); } catch (err) {}
        segarkanHudEditor();
      });

      item.addEventListener("pointermove", (e) => {
        if (!_hudDragState || _hudDragState.id !== id || _hudDragState.pointerId !== e.pointerId) return;
        e.preventDefault();
        e.stopPropagation();
        const dxPct = ((e.clientX - _hudDragState.startX) / _hudDragState.rectW) * 100;
        const dyPct = ((e.clientY - _hudDragState.startY) / _hudDragState.rectH) * 100;

        const nx = Math.max(2, Math.min(98, _hudDragState.initX + dxPct));
        const ny = Math.max(2, Math.min(98, _hudDragState.initY + dyPct));
        _hudDraftConfig[id].x = Math.round(nx * 10) / 10;
        _hudDraftConfig[id].y = Math.round(ny * 10) / 10;

        item.style.left = _hudDraftConfig[id].x + "%";
        item.style.top = _hudDraftConfig[id].y + "%";
      });

      const selesaiDrag = (e) => {
        if (!_hudDragState || _hudDragState.id !== id || _hudDragState.pointerId !== e.pointerId) return;
        _hudDragState = null;
        segarkanHudEditor();
      };
      item.addEventListener("pointerup", selesaiDrag);
      item.addEventListener("pointercancel", selesaiDrag);
    });
  }

  const slider = document.getElementById("hudSliderUkuran");
  if (slider) {
    slider.addEventListener("input", (e) => {
      if (!_hudDraftConfig || !_hudItemTerpilih) return;
      const v = Math.max(50, Math.min(250, parseFloat(e.target.value) || 100));
      const s = Math.round((v / 100) * 100) / 100;
      _hudDraftConfig[_hudItemTerpilih].s = s;
      segarkanHudEditor();
    });
  }

  const btnMinus = document.getElementById("hudBtnUkuranMinus");
  if (btnMinus) {
    btnMinus.addEventListener("click", () => {
      if (!_hudDraftConfig || !_hudItemTerpilih) return;
      const cur = _hudDraftConfig[_hudItemTerpilih].s;
      const next = Math.max(0.5, Math.round((cur - 0.05) * 100) / 100);
      _hudDraftConfig[_hudItemTerpilih].s = next;
      segarkanHudEditor();
    });
  }

  const btnPlus = document.getElementById("hudBtnUkuranPlus");
  if (btnPlus) {
    btnPlus.addEventListener("click", () => {
      if (!_hudDraftConfig || !_hudItemTerpilih) return;
      const cur = _hudDraftConfig[_hudItemTerpilih].s;
      const next = Math.min(2.5, Math.round((cur + 0.05) * 100) / 100);
      _hudDraftConfig[_hudItemTerpilih].s = next;
      segarkanHudEditor();
    });
  }

  const btnResetElemen = document.getElementById("hudBtnResetElemen");
  if (btnResetElemen) {
    btnResetElemen.addEventListener("click", () => {
      if (!_hudDraftConfig || !_hudItemTerpilih) return;
      _hudDraftConfig[_hudItemTerpilih] = { ...HUD_DEFAULT[_hudItemTerpilih] };
      segarkanHudEditor();
    });
  }

  const btnResetSemua = document.getElementById("hudBtnResetSemua");
  if (btnResetSemua) {
    btnResetSemua.addEventListener("click", () => {
      resetHudConfig();
      _hudDraftConfig = cloneHudConfig(HUD_DEFAULT);
      segarkanHudEditor();
    });
  }

  const btnSimpan = document.getElementById("hudBtnSimpan");
  if (btnSimpan) {
    btnSimpan.addEventListener("click", () => {
      if (_hudDraftConfig) {
        simpanHudConfig(_hudDraftConfig);
      }
      tutupHudEditor();
    });
  }

  const btnBatal = document.getElementById("hudBtnBatal");
  if (btnBatal) {
    btnBatal.addEventListener("click", tutupHudEditor);
  }

  const btnTutupX = document.getElementById("tutupHudEditorX");
  if (btnTutupX) {
    btnTutupX.addEventListener("click", tutupHudEditor);
  }

  const btnLipat = document.getElementById("hudBtnLipatToolbar");
  if (btnLipat) {
    btnLipat.addEventListener("click", () => {
      const toolbar = document.querySelector(".hud-editor-toolbar");
      if (!toolbar) return;
      const terlipat = toolbar.classList.toggle("terlipat");
      btnLipat.innerHTML = terlipat ? "&#9650; BUKA PANEL" : "&#9660; SEMBUNYIKAN";
    });
  }
}
