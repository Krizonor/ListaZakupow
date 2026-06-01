import { useState, useEffect, useRef } from "react";

const DEMO_USER = { id: 1, imie: "demo1", email: "demo1@demo.pl" };

const INIT_CATEGORIES = [
  { id: 1, nazwa: "Warzywa i owoce" },
  { id: 2, nazwa: "Nabiał" },
  { id: 3, nazwa: "Mięso i ryby" },
  { id: 4, nazwa: "Pieczywo" },
  { id: 5, nazwa: "Napoje" },
  { id: 6, nazwa: "Słodycze" },
  { id: 7, nazwa: "Chemia domowa" },
  { id: 8, nazwa: "Inne" },
];

const INIT_FAMILIES = [{ id: 1, nazwa: "Rodzina Kowalskich" }];

const INIT_MEMBERS = [
  { id: 1, rodzina_id: 1, uzytkownik_id: 1, imie: "demo1", email: "demo1@demo.pl" },
  { id: 2, rodzina_id: 1, uzytkownik_id: 2, imie: "demo2", email: "demo2@demo.pl" },
  { id: 3, rodzina_id: 1, uzytkownik_id: 3, imie: "demo3", email: "demo3@demo.pl" },
];

const INIT_LISTS = [
  { id: 1, wlasciciel_id: 1, rodzina_id: 1, nazwa: "Tygodniowe zakupy" },
  { id: 2, wlasciciel_id: 1, rodzina_id: 1, nazwa: "Przyjęcie urodzinowe" },
  { id: 3, wlasciciel_id: 2, rodzina_id: 1, nazwa: "Lista demo2" },
];

const INIT_PRODUCTS = [
  { id: 1, lista_id: 1, nazwa: "Jabłka", kategoria_id: 1, ilosc: 1.5, jednostka: "kg", kupione: false },
  { id: 2, lista_id: 1, nazwa: "Mleko", kategoria_id: 2, ilosc: 2, jednostka: "l", kupione: true },
  { id: 3, lista_id: 1, nazwa: "Chleb pszenny", kategoria_id: 4, ilosc: 1, jednostka: "szt", kupione: false },
  { id: 4, lista_id: 1, nazwa: "Kurczak", kategoria_id: 3, ilosc: 800, jednostka: "g", kupione: false },
  { id: 5, lista_id: 1, nazwa: "Woda mineralna", kategoria_id: 5, ilosc: 6, jednostka: "szt", kupione: true },
  { id: 6, lista_id: 1, nazwa: "Jogurt naturalny", kategoria_id: 2, ilosc: 3, jednostka: "szt", kupione: false },
  { id: 7, lista_id: 2, nazwa: "Tort czekoladowy", kategoria_id: 6, ilosc: 1, jednostka: "szt", kupione: false },
  { id: 8, lista_id: 2, nazwa: "Sok pomarańczowy", kategoria_id: 5, ilosc: 2, jednostka: "l", kupione: false },
  { id: 9, lista_id: 2, nazwa: "Chipsy", kategoria_id: 6, ilosc: 3, jednostka: "opak.", kupione: false },
  { id: 10, lista_id: 3, nazwa: "Proszek do prania", kategoria_id: 7, ilosc: 1, jednostka: "opak.", kupione: false },
  { id: 11, lista_id: 3, nazwa: "Płyn do naczyń", kategoria_id: 7, ilosc: 2, jednostka: "szt", kupione: true },
];

const UNITS = ["szt", "kg", "g", "l", "ml", "opak.", "pęczek", "butelka"];

const CAT_ICONS = {
  "Warzywa i owoce": "🥦",
  "Nabiał": "🥛",
  "Mięso i ryby": "🥩",
  "Pieczywo": "🍞",
  "Napoje": "🥤",
  "Słodycze": "🍫",
  "Chemia domowa": "🧹",
  "Inne": "📦",
};

function initials(name) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function getCategoryName(categories, id) {
  const cat = categories.find((c) => c.id === id);
  return cat ? cat.nazwa : "Inne";
}

function Modal({ children, onClose }) {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">{children}</div>
    </div>
  );
}

function AddListModal({ families, onAdd, onClose }) {
  const [nazwa, setNazwa] = useState("");
  const [rodzina_id, setRodzina_id] = useState(families[0]?.id ?? 1);

  function submit() {
    if (!nazwa.trim()) return;
    onAdd({ nazwa: nazwa.trim(), rodzina_id: Number(rodzina_id) });
    onClose();
  }

  return (
    <Modal onClose={onClose}>
      <p className="modal-title">Nowa lista Zakupów</p>
      <div style={{ marginBottom: "14px" }}>
        <label className="form-label">Nazwa listy</label>
        <input
          className="input"
          placeholder="np. Tygodniowe zakupy"
          value={nazwa}
          onChange={(e) => setNazwa(e.target.value)}
          autoFocus
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />
      </div>
      <div style={{ marginBottom: "24px" }}>
        <label className="form-label">Rodzina</label>
        <select className="select" value={rodzina_id} onChange={(e) => setRodzina_id(e.target.value)}>
          {families.map((f) => (
            <option key={f.id} value={f.id}>{f.nazwa}</option>
          ))}
        </select>
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <button className="btn-ghost" style={{ flex: 1, justifyContent: "center" }} onClick={onClose}>Anuluj</button>
        <button className="btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={submit}>Utwórz</button>
      </div>
    </Modal>
  );
}

function AddProductModal({ categories, lista_id, onAdd, onClose }) {
  const [nazwa, setNazwa] = useState("");
  const [kategoria_id, setKategoria_id] = useState("");
  const [ilosc, setIlosc] = useState("");
  const [jednostka, setJednostka] = useState("szt");

  function submit() {
    if (!nazwa.trim()) return;
    onAdd({
      lista_id,
      nazwa: nazwa.trim(),
      kategoria_id: kategoria_id ? Number(kategoria_id) : null,
      ilosc: ilosc !== "" ? parseFloat(ilosc) : null,
      jednostka: jednostka || null,
      kupione: false,
    });
    onClose();
  }

  return (
    <Modal onClose={onClose}>
      <p className="modal-title">Dodaj produkt</p>
      <div style={{ marginBottom: "14px" }}>
        <label className="form-label">Nazwa produktu</label>
        <input
          className="input"
          placeholder="np. Jabłka"
          value={nazwa}
          onChange={(e) => setNazwa(e.target.value)}
          autoFocus
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />
      </div>
      <div style={{ marginBottom: "14px" }}>
        <label className="form-label">Kategoria</label>
        <select className="select" value={kategoria_id} onChange={(e) => setKategoria_id(e.target.value)}>
          <option value="">— wybierz kategorię —</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.nazwa}</option>
          ))}
        </select>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
        <div>
          <label className="form-label">Ilość</label>
          <input
            className="input"
            type="number"
            min="0"
            step="0.1"
            placeholder="np. 1.5"
            value={ilosc}
            onChange={(e) => setIlosc(e.target.value)}
          />
        </div>
        <div>
          <label className="form-label">Jednostka</label>
          <select className="select" value={jednostka} onChange={(e) => setJednostka(e.target.value)}>
            {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <button className="btn-ghost" style={{ flex: 1, justifyContent: "center" }} onClick={onClose}>Anuluj</button>
        <button className="btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={submit}>Dodaj</button>
      </div>
    </Modal>
  );
}

function ShareModal({ list, members, onClose }) {
  const [copied, setCopied] = useState(false);
  const link = `https://listki.app/lista/${list.id}`;
  const COLORS = ["#D0EDDD", "#D5E8F7", "#FDECD0"];
  const TEXT_COLORS = ["#2A6447", "#1B5E8A", "#8A5F0A"];

  function copyLink() {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Modal onClose={onClose}>
      <p className="modal-title">Udostępnij listę</p>
      <p style={{ fontSize: "14px", color: "#7A8C79", marginBottom: "22px" }}>
        Lista <strong>„{list.nazwa}"</strong> jest dostępna dla całej rodziny.
      </p>
      <div className="section-label">Osoby z dostępem</div>
      <div style={{ border: "1px solid #E8E3DC", borderRadius: "12px", overflow: "hidden", marginBottom: "22px" }}>
        {members.map((m, i) => (
          <div
            key={m.id}
            style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "12px 16px",
              borderBottom: i < members.length - 1 ? "1px solid #F2EEE9" : "none",
            }}
          >
            <div className="avatar" style={{ width: "38px", height: "38px", background: COLORS[i % 3], color: TEXT_COLORS[i % 3], fontSize: "13px" }}>
              {initials(m.imie)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "14px", fontWeight: "500" }}>{m.imie}</div>
              <div style={{ fontSize: "12px", color: "#9E9890" }}>{m.email}</div>
            </div>
            <span className="badge badge-green">Dostęp</span>
          </div>
        ))}
      </div>
      <div className="section-label">Link do listy</div>
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        <input className="input" value={link} readOnly style={{ flex: 1, fontSize: "12px", color: "#7A8C79" }} />
        <button className="btn-ghost" onClick={copyLink} style={{ flexShrink: 0 }}>
          {copied ? "✓ Skopiowano" : "Kopiuj"}
        </button>
      </div>
      <button className="btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={onClose}>Gotowe</button>
    </Modal>
  );
}

function InviteMemberModal({ families, members, onAdd, onClose }) {
  const [imie, setImie] = useState("");
  const [email, setEmail] = useState("");
  const [rodzina_id, setRodzina_id] = useState(families[0]?.id ?? 1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function submit() {
    if (!imie.trim()) { setError("Podaj imię osoby."); return; }
    if (!email.trim() || !email.includes("@")) { setError("Podaj prawidłowy adres e-mail."); return; }
    const already = members.find((m) => m.email.toLowerCase() === email.trim().toLowerCase());
    if (already) { setError("Ta osoba jest już członkiem rodziny."); return; }
    setError("");
    onAdd({ imie: imie.trim(), email: email.trim().toLowerCase(), rodzina_id: Number(rodzina_id) });
    setSuccess(true);
  }

  if (success) {
    return (
      <Modal onClose={onClose}>
        <div style={{ textAlign: "center", padding: "16px 0" }}>
          <div style={{ fontSize: "52px", marginBottom: "16px" }}>✉️</div>
          <p className="modal-title" style={{ marginBottom: "10px" }}>Zaproszenie wysłane!</p>
          <p style={{ fontSize: "14px", color: "#7A8C79", marginBottom: "28px" }}>
            Wysłano zaproszenie do <strong>{email}</strong>.<br />
            Osoba pojawi się na liście po akceptacji.
          </p>
          <button className="btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={onClose}>Gotowe</button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal onClose={onClose}>
      <p className="modal-title">Zaproś do rodziny</p>
      <div style={{ marginBottom: "14px" }}>
        <label className="form-label">Imię</label>
        <input className="input" placeholder="np. Kasia" value={imie} onChange={(e) => setImie(e.target.value)} autoFocus onKeyDown={(e) => e.key === "Enter" && submit()} />
      </div>
      <div style={{ marginBottom: "14px" }}>
        <label className="form-label">Adres e-mail</label>
        <input className="input" type="email" placeholder="np. kasia@email.pl" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} />
      </div>
      <div style={{ marginBottom: "24px" }}>
        <label className="form-label">Rodzina</label>
        <select className="select" value={rodzina_id} onChange={(e) => setRodzina_id(e.target.value)}>
          {families.map((f) => <option key={f.id} value={f.id}>{f.nazwa}</option>)}
        </select>
      </div>
      {error && (
        <div style={{ color: "#B83232", fontSize: "13px", marginBottom: "14px", padding: "10px 14px", background: "#FDECEA", borderRadius: "8px" }}>
          {error}
        </div>
      )}
      <div style={{ display: "flex", gap: "10px" }}>
        <button className="btn-ghost" style={{ flex: 1, justifyContent: "center" }} onClick={onClose}>Anuluj</button>
        <button className="btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={submit}>Wyślij zaproszenie</button>
      </div>
    </Modal>
  );
}

function EditProfileModal({ user, onSave, onClose }) {
  const [imie, setImie] = useState(user.imie);
  const [email, setEmail] = useState(user.email);
  const [error, setError] = useState("");

  function submit() {
    if (!imie.trim()) { setError("Imię nie może być puste."); return; }
    if (!email.trim() || !email.includes("@")) { setError("Podaj prawidłowy adres e-mail."); return; }
    setError("");
    onSave({ imie: imie.trim(), email: email.trim() });
    onClose();
  }

  return (
    <Modal onClose={onClose}>
      <p className="modal-title">Edytuj profil</p>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "24px" }}>
        <div className="avatar" style={{ width: "72px", height: "72px", background: "#D0EDDD", color: "#2A6447", fontSize: "26px", marginBottom: "8px" }}>
          {initials(imie || "?")}
        </div>
        <span style={{ fontSize: "12px", color: "#9E9890" }}>Podgląd awatara</span>
      </div>
      <div style={{ marginBottom: "14px" }}>
        <label className="form-label">Imię</label>
        <input className="input" placeholder="Twoje imię" value={imie} onChange={(e) => setImie(e.target.value)} autoFocus onKeyDown={(e) => e.key === "Enter" && submit()} />
      </div>
      <div style={{ marginBottom: "24px" }}>
        <label className="form-label">Adres e-mail</label>
        <input className="input" type="email" placeholder="twoj@email.pl" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} />
      </div>
      {error && (
        <div style={{ color: "#B83232", fontSize: "13px", marginBottom: "14px", padding: "10px 14px", background: "#FDECEA", borderRadius: "8px" }}>
          {error}
        </div>
      )}
      <div style={{ display: "flex", gap: "10px" }}>
        <button className="btn-ghost" style={{ flex: 1, justifyContent: "center" }} onClick={onClose}>Anuluj</button>
        <button className="btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={submit}>Zapisz zmiany</button>
      </div>
    </Modal>
  );
}

function Sidebar({ user, lists, currentView, activeListId, onNavigate, onOpenList, dark, onToggleDark }) {
  const myLists = lists.filter((l) => l.wlasciciel_id === user.id);

  const navItems = [
    { view: "dashboard", emoji: "🏠", label: "Strona główna" },
    { view: "family", emoji: "👨‍👩‍👧", label: "Rodzina" },
    { view: "profile", emoji: "👤", label: "Profil" },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h1>🛒 Familista</h1>
        <span>Witaj, {user.imie}!</span>
      </div>

      <div style={{ flex: 1, paddingTop: "8px", overflowY: "auto" }}>
        {navItems.map((item) => (
          <button
            key={item.view}
            className={`sidebar-btn ${currentView === item.view && !activeListId ? "active" : ""}`}
            onClick={() => onNavigate(item.view)}
          >
            <span style={{ fontSize: "16px" }}>{item.emoji}</span>
            {item.label}
          </button>
        ))}

        {myLists.length > 0 && (
          <>
            <div className="sidebar-section-label">Moje listy</div>
            {myLists.map((list) => (
              <button
                key={list.id}
                className={`sidebar-btn ${activeListId === list.id ? "active" : ""}`}
                style={{ fontSize: "13px" }}
                onClick={() => onOpenList(list)}
              >
                <div className="list-dot" />
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {list.nazwa}
                </span>
              </button>
            ))}
          </>
        )}
      </div>

      <div style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <button className="theme-toggle" style={{ width: "100%", marginBottom: "8px", justifyContent: "center" }} onClick={onToggleDark}>
          <span style={{ fontSize: "15px" }}>{dark ? "☀️" : "🌙"}</span>
          {dark ? "Jasny tryb" : "Ciemny tryb"}
        </button>

        <div
          onClick={() => onNavigate("profile")}
          style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", borderRadius: "9px", cursor: "pointer", transition: "background 0.12s" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
        >
          <div className="avatar" style={{ width: "34px", height: "34px", background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.8)", fontSize: "12px" }}>
            {initials(user.imie)}
          </div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.85)", fontWeight: "500" }}>{user.imie}</div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user.email}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardView({ user, lists, products, families, onOpenList, onAddList, dark }) {
  const [showAddList, setShowAddList] = useState(false);

  const myLists = lists.filter((l) => l.wlasciciel_id === user.id);
  const sharedLists = lists.filter((l) => l.wlasciciel_id !== user.id);

  function listStats(listId) {
    const prods = products.filter((p) => p.lista_id === listId);
    return { total: prods.length, done: prods.filter((p) => p.kupione).length };
  }

  const statColors = dark
    ? [["#162820", "#4CAF80"], ["#1A2818", "#C0A020"], ["#182030", "#4A8AC0"]]
    : [["#EEF5F1", "#2E6044"], ["#FEF5E8", "#7A540B"], ["#E8F0F8", "#1B5E8A"]];

  function ListCard({ list }) {
    const { total, done } = listStats(list.id);
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    const family = families.find((f) => f.id === list.rodzina_id);

    return (
      <div className="list-card" onClick={() => onOpenList(list)}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
          <h3 style={{ fontFamily: "Fraunces, serif", fontSize: "16px", fontWeight: "600", lineHeight: "1.3" }}>
            {list.nazwa}
          </h3>
          {total > 0 && done === total && (
            <span className="badge badge-green" style={{ marginLeft: "8px", flexShrink: 0 }}>✓ Gotowe</span>
          )}
        </div>
        <div style={{ fontSize: "12.5px", color: "#9E9890", marginBottom: "14px" }}>
          {family?.nazwa} · {total} {total === 1 ? "produkt" : "produktów"}
        </div>
        {total > 0 ? (
          <>
            <div className="progress-track" style={{ marginBottom: "7px" }}>
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "12px", color: "#9E9890" }}>{done} z {total} kupionych</span>
              <span style={{ fontSize: "12px", fontWeight: "500", color: "#3A7558" }}>{pct}%</span>
            </div>
          </>
        ) : (
          <div style={{ fontSize: "13px", color: dark ? "#3A5248" : "#C9C2B8" }}>Pusta lista — dodaj produkty</div>
        )}
      </div>
    );
  }

  const allMyProducts = products.filter((p) => myLists.some((l) => l.id === p.lista_id));
  const totalBought = allMyProducts.filter((p) => p.kupione).length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Witaj, Sklepowiczu! 🛒</h2>
          <p>Twoje listy zakupów</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddList(true)}>+ Nowa lista</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "32px" }}>
        {[["Listy", myLists.length], ["Produkty", allMyProducts.length], ["Kupione", totalBought]].map(([label, val], i) => (
          <div key={label} style={{ background: statColors[i][0], borderRadius: "12px", padding: "16px 20px", textAlign: "center" }}>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: "28px", fontWeight: "600", color: statColors[i][1] }}>{val}</div>
            <div style={{ fontSize: "12px", color: statColors[i][1], opacity: 0.7, marginTop: "2px" }}>{label}</div>
          </div>
        ))}
      </div>

      {myLists.length === 0 && sharedLists.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "60px 40px", color: "#9E9890" }}>
          <div style={{ fontSize: "52px", marginBottom: "16px" }}>📋</div>
          <p style={{ fontFamily: "Fraunces, serif", fontSize: "18px", color: dark ? "#4CAF80" : "#4E6248", marginBottom: "8px" }}>Brak list zakupów</p>
          <p style={{ fontSize: "14px" }}>Stwórz pierwszą listę, żeby zacząć!</p>
        </div>
      ) : (
        <>
          {myLists.length > 0 && (
            <div style={{ marginBottom: "32px" }}>
              <div className="section-label">Moje listy</div>
              <div className="grid-lists">
                {myLists.map((l) => <ListCard key={l.id} list={l} />)}
              </div>
            </div>
          )}
          {sharedLists.length > 0 && (
            <div>
              <div className="section-label">Listy rodziny</div>
              <div className="grid-lists">
                {sharedLists.map((l) => <ListCard key={l.id} list={l} />)}
              </div>
            </div>
          )}
        </>
      )}

      {showAddList && (
        <AddListModal
          families={families}
          onAdd={(data) => { onAddList(data); setShowAddList(false); }}
          onClose={() => setShowAddList(false)}
        />
      )}
    </div>
  );
}

function ListDetailView({ list, products, categories, members, onToggle, onAdd, onDelete, onBack }) {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const listProds = products.filter((p) => p.lista_id === list.id);
  const done = listProds.filter((p) => p.kupione).length;
  const pct = listProds.length > 0 ? Math.round((done / listProds.length) * 100) : 0;

  const visible = listProds.filter((p) => {
    const matchFilter = filter === "all" || (filter === "active" ? !p.kupione : p.kupione);
    const matchSearch = p.nazwa.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const grouped = {};
  visible.forEach((p) => {
    const catName = getCategoryName(categories, p.kategoria_id);
    if (!grouped[catName]) grouped[catName] = [];
    grouped[catName].push(p);
  });

  return (
    <div>
      <button
        onClick={onBack}
        style={{
          background: "none", border: "none", cursor: "pointer",
          color: "#7A8C79", fontSize: "13.5px", marginBottom: "10px", padding: "0",
          display: "flex", alignItems: "center", gap: "5px", fontFamily: "DM Sans, sans-serif",
        }}
      >
        ← Wróć do listy
      </button>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px", gap: "16px", flexWrap: "wrap" }}>
        <div>
          <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "26px", fontWeight: "600", letterSpacing: "-0.3px" }}>
            {list.nazwa}
          </h2>
          <p style={{ color: "#7A8C79", fontSize: "13.5px", marginTop: "3px" }}>
            {done} z {listProds.length} produktów kupiono
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button className="btn-ghost" onClick={() => setShowShare(true)}>↗ Udostępnij</button>
          <button className="btn-primary" onClick={() => setShowAddProduct(true)}>+ Produkt</button>
        </div>
      </div>

      {listProds.length > 0 && (
        <div className="card" style={{ marginBottom: "20px", padding: "16px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <span style={{ fontSize: "13px", color: "#7A8C79" }}>Postęp zakupów</span>
            <span style={{ fontSize: "13px", fontWeight: "500", color: "#3A7558" }}>{pct}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
        {[["all", "Wszystkie"], ["active", "Do kupienia"], ["done", "Kupione"]].map(([val, label]) => (
          <button key={val} className={`filter-tab ${filter === val ? "active" : ""}`} onClick={() => setFilter(val)}>
            {label}
          </button>
        ))}
        <input
          className="input"
          placeholder="Szukaj produktu…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginLeft: "auto", maxWidth: "200px" }}
        />
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "52px 32px", color: "#9E9890" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>🛒</div>
          <p style={{ fontSize: "15px" }}>
            {listProds.length === 0 ? "Brak produktów — dodaj pierwszy!" : "Brak wyników dla tych filtrów."}
          </p>
        </div>
      ) : (
        Object.entries(grouped).map(([catName, prods]) => (
          <div key={catName} className="card" style={{ marginBottom: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
              <span style={{ fontSize: "16px" }}>{CAT_ICONS[catName] || "📦"}</span>
              <span className="section-label" style={{ marginBottom: 0 }}>{catName}</span>
            </div>
            {prods.map((product) => (
              <div key={product.id} className="product-row" onClick={() => onToggle(product.id)}>
                <div className={`checkbox ${product.kupione ? "checked" : ""}`}>
                  {product.kupione && <span style={{ color: "white", fontSize: "12px", lineHeight: 1 }}>✓</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <div className={`product-name ${product.kupione ? "done" : ""}`}>{product.nazwa}</div>
                  {(product.ilosc !== null || product.jednostka) && (
                    <div className="product-meta">
                      {product.ilosc !== null ? product.ilosc : ""} {product.jednostka || ""}
                    </div>
                  )}
                </div>
                <button className="btn-icon" onClick={(e) => { e.stopPropagation(); onDelete(product.id); }} title="Usuń">✕</button>
              </div>
            ))}
          </div>
        ))
      )}

      {showAddProduct && (
        <AddProductModal categories={categories} lista_id={list.id} onAdd={onAdd} onClose={() => setShowAddProduct(false)} />
      )}
      {showShare && (
        <ShareModal list={list} members={members} onClose={() => setShowShare(false)} />
      )}
    </div>
  );
}

function FamilyView({ families, members, lists, products, onAddMember }) {
  const COLORS = ["#D0EDDD", "#D5E8F7", "#FDECD0"];
  const TEXT_COLORS = ["#2A6447", "#1B5E8A", "#8A5F0A"];
  const [showInvite, setShowInvite] = useState(false);
  const [inviteFamilyId, setInviteFamilyId] = useState(null);

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Rodzina</h2>
          <p>Członkowie i ich aktywność</p>
        </div>
      </div>

      {families.map((family) => {
        const familyMembers = members.filter((m) => m.rodzina_id === family.id);
        return (
          <div key={family.id} className="card" style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <h3 style={{ fontFamily: "Fraunces, serif", fontSize: "18px", fontWeight: "600" }}>{family.nazwa}</h3>
              <span className="badge badge-green">{familyMembers.length} osób</span>
            </div>
            {familyMembers.map((m, i) => {
              const userLists = lists.filter((l) => l.wlasciciel_id === m.uzytkownik_id);
              const userProducts = products.filter((p) => userLists.some((l) => l.id === p.lista_id));
              const boughtCount = userProducts.filter((p) => p.kupione).length;
              return (
                <div key={m.id} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 0", borderBottom: i < familyMembers.length - 1 ? "1px solid #F2EEE9" : "none" }}>
                  <div className="avatar" style={{ width: "46px", height: "46px", background: COLORS[i % 3], color: TEXT_COLORS[i % 3], fontSize: "15px" }}>
                    {initials(m.imie)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "500", fontSize: "15px" }}>{m.imie}</div>
                    <div style={{ fontSize: "12.5px", color: "#9E9890", marginTop: "1px" }}>{m.email}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "13px", fontWeight: "500" }}>{userLists.length} {userLists.length === 1 ? "lista" : "listy"}</div>
                    <div style={{ fontSize: "12px", color: "#9E9890" }}>{boughtCount} kupionych</div>
                  </div>
                </div>
              );
            })}
            <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #F2EEE9" }}>
              <button className="btn-ghost" style={{ fontSize: "13px" }} onClick={() => { setInviteFamilyId(family.id); setShowInvite(true); }}>
                + Zaproś osobę do rodziny
              </button>
            </div>
          </div>
        );
      })}

      {showInvite && (
        <InviteMemberModal
          families={families.filter((f) => f.id === inviteFamilyId)}
          members={members}
          onAdd={(data) => { onAddMember(data); setShowInvite(false); }}
          onClose={() => setShowInvite(false)}
        />
      )}
    </div>
  );
}

function ProfileView({ user, lists, products, onLogout, onUpdateUser, dark, onToggleDark }) {
  const [showEditProfile, setShowEditProfile] = useState(false);

  const myLists = lists.filter((l) => l.wlasciciel_id === user.id);
  const myProducts = products.filter((p) => myLists.some((l) => l.id === p.lista_id));
  const bought = myProducts.filter((p) => p.kupione).length;

  const statColors = dark
    ? [["#162820", "#4CAF80"], ["#1A2818", "#C0A020"], ["#182030", "#4A8AC0"], ["#281818", "#C05050"]]
    : [["#EEF5F1", "#2E6044"], ["#FEF5E8", "#7A540B"], ["#E8F0F8", "#1B5E8A"], ["#FDF0EE", "#8A2E2E"]];

  const stats = [
    ["Listy", myLists.length],
    ["Produkty", myProducts.length],
    ["Kupione", bought],
    ["Nieukończone", myProducts.length - bought],
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Profil</h2>
          <p>Twoje konto i statystyki</p>
        </div>
      </div>

      <div className="card" style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "20px" }}>
        <div className="avatar" style={{ width: "66px", height: "66px", background: "#D0EDDD", color: "#2A6447", fontSize: "22px" }}>
          {initials(user.imie)}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontFamily: "Fraunces, serif", fontSize: "20px", fontWeight: "600" }}>{user.imie}</h3>
          <p style={{ color: "#9E9890", fontSize: "13.5px", marginTop: "2px" }}>{user.email}</p>
        </div>
        <button className="btn-ghost" onClick={() => setShowEditProfile(true)}>Edytuj profil</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "28px" }}>
        {stats.map(([label, val], i) => (
          <div key={label} style={{ background: statColors[i][0], borderRadius: "12px", padding: "18px 16px", textAlign: "center" }}>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: "28px", fontWeight: "600", color: statColors[i][1] }}>{val}</div>
            <div style={{ fontSize: "11.5px", color: statColors[i][1], opacity: 0.75, marginTop: "3px" }}>{label}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: "20px" }}>
        <div className="section-label" style={{ marginBottom: "14px" }}>Ustawienia</div>
        {[
          ["🔔", "Powiadomienia", "Włączone", null],
          ["🌍", "Język", "Polski", null],
          ["🎨", "Motyw", dark ? "Ciemny" : "Jasny", onToggleDark],
        ].map(([icon, label, value, action]) => (
          <div
            key={label}
            onClick={action || undefined}
            style={{
              display: "flex", alignItems: "center", padding: "12px 0",
              borderBottom: "1px solid #F2EEE9",
              cursor: action ? "pointer" : "default",
            }}
          >
            <span style={{ fontSize: "18px", marginRight: "12px" }}>{icon}</span>
            <span style={{ flex: 1, fontSize: "14px" }}>{label}</span>
            <span style={{ fontSize: "13px", color: "#9E9890", display: "flex", alignItems: "center", gap: "6px" }}>
              {value}
              {action && <span style={{ fontSize: "11px", color: "#3A7558" }}>Zmień</span>}
            </span>
          </div>
        ))}
      </div>

      <button className="btn-ghost" style={{ color: "#B83232", borderColor: "#EEC8C8" }} onClick={onLogout}>
        Wyloguj się
      </button>

      {showEditProfile && (
        <EditProfileModal user={user} onSave={onUpdateUser} onClose={() => setShowEditProfile(false)} />
      )}
    </div>
  );
}

function LoginScreen({ dark, onLogin }) {
  const [imie, setImie] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  function submit() {
    if (!imie.trim()) { setError("Podaj imię."); return; }
    if (!email.trim() || !email.includes("@")) { setError("Podaj prawidłowy adres e-mail."); return; }
    onLogin({ id: 1, imie: imie.trim(), email: email.trim() });
  }

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: dark ? "#111816" : "#F6F3EE",
      padding: "20px",
    }}>
      <div style={{
        background: dark ? "#1A2320" : "white",
        borderRadius: "20px",
        border: "1px solid " + (dark ? "#2A3530" : "#E8E3DC"),
        padding: "40px 36px",
        width: "100%",
        maxWidth: "400px",
        boxShadow: "0 24px 72px rgba(0,0,0,0.12)",
      }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>🛒</div>
          <h1 style={{ fontSize: "26px", color: dark ? "#E8F0EC" : "#1C2B1A", marginBottom: "6px" }}>Familista</h1>
          <p style={{ fontSize: "14px", color: dark ? "#6B8A7A" : "#7A8C79" }}>Zaloguj się, żeby zarządzać listami zakupów</p>
        </div>
        <div style={{ marginBottom: "14px" }}>
          <label className="form-label">Imię</label>
          <input
            className="input"
            placeholder="np. Jan"
            value={imie}
            onChange={(e) => setImie(e.target.value)}
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label className="form-label">Adres e-mail</label>
          <input
            className="input"
            type="email"
            placeholder="np. jan@email.pl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
        </div>
        {error && (
          <div style={{ color: "#B83232", fontSize: "13px", marginBottom: "14px", padding: "10px 14px", background: "#FDECEA", borderRadius: "8px" }}>
            {error}
          </div>
        )}
        <button className="btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={submit}>
          Zaloguj się
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(DEMO_USER);
  const [view, setView] = useState("dashboard");
  const [activeList, setActiveList] = useState(null);
  const [dark, setDark] = useState(false);

  const [categories] = useState(INIT_CATEGORIES);
  const [families] = useState(INIT_FAMILIES);
  const [members, setMembers] = useState(INIT_MEMBERS);
  const [lists, setLists] = useState(INIT_LISTS);
  const [products, setProducts] = useState(INIT_PRODUCTS);

  const nextId = useRef(200);
  const genId = () => ++nextId.current;

  function toggleProduct(id) {
    setProducts((ps) => ps.map((p) => (p.id === id ? { ...p, kupione: !p.kupione } : p)));
  }

  function addProduct(data) {
    setProducts((ps) => [...ps, { id: genId(), ...data }]);
  }

  function deleteProduct(id) {
    setProducts((ps) => ps.filter((p) => p.id !== id));
  }

  function addList(data) {
    const newList = { id: genId(), wlasciciel_id: user.id, ...data };
    setLists((ls) => [...ls, newList]);
  }

  function addMember(data) {
    const newId = genId();
    setMembers((ms) => [...ms, { id: newId, rodzina_id: data.rodzina_id, uzytkownik_id: newId, imie: data.imie, email: data.email }]);
  }

  function updateUser(data) {
    setUser((u) => ({ ...u, ...data }));
    setMembers((ms) => ms.map((m) => m.uzytkownik_id === user.id ? { ...m, imie: data.imie, email: data.email } : m));
  }

  function openList(list) {
    setActiveList(list);
    setView("list-detail");
  }

  function navigate(v) {
    setView(v);
    setActiveList(null);
  }

  function logout() {
    setUser(null);
    setView("dashboard");
    setActiveList(null);
  }

  const css = buildCSS(dark);

  if (!user) {
    return (
      <>
        <style>{css}</style>
        <style>{`body { background: ${dark ? "#111816" : "#F6F3EE"} !important; } #root { display: block !important; }`}</style>
        <LoginScreen dark={dark} onLogin={setUser} />
      </>
    );
  }

  let content;
  if (view === "list-detail" && activeList) {
    content = (
      <ListDetailView
        list={activeList}
        products={products}
        categories={categories}
        members={members}
        onToggle={toggleProduct}
        onAdd={addProduct}
        onDelete={deleteProduct}
        onBack={() => navigate("dashboard")}
      />
    );
  } else if (view === "family") {
    content = (
      <FamilyView families={families} members={members} lists={lists} products={products} onAddMember={addMember} />
    );
  } else if (view === "profile") {
    content = (
      <ProfileView
        user={user}
        lists={lists}
        products={products}
        onLogout={logout}
        onUpdateUser={updateUser}
        dark={dark}
        onToggleDark={() => setDark((d) => !d)}
      />
    );
  } else {
    content = (
      <DashboardView
        user={user}
        lists={lists}
        products={products}
        families={families}
        onOpenList={openList}
        onAddList={addList}
        dark={dark}
      />
    );
  }

  return (
    <>
      <style>{css}</style>
      <div className="app-layout">
        <Sidebar
          user={user}
          lists={lists}
          currentView={view}
          activeListId={activeList?.id}
          onNavigate={navigate}
          onOpenList={openList}
          dark={dark}
          onToggleDark={() => setDark((d) => !d)}
        />
        <main className="main">{content}</main>
      </div>
    </>
  );
}
