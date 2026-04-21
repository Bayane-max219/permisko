import { useState, useRef } from 'react'

const DOSSIERS_INIT = [
  { id: 'A7K29', nom: 'Jean Rakoto',    categorie: 'B', depot: '13 avr.', joursEcoules: 7,  colonne: 'a-traiter', niveauRequis: 1 },
  { id: 'B3M71', nom: 'Marie Rasoa',    categorie: 'B', depot: '15 avr.', joursEcoules: 5,  colonne: 'a-traiter', niveauRequis: 1, incomplet: 'Certificat médical expiré' },
  { id: 'F3K22', nom: 'Solo Andria',    categorie: 'A', depot: '14 avr.', joursEcoules: 6,  colonne: 'a-traiter', niveauRequis: 2 },
  { id: 'D2F88', nom: 'Luc Ramaroson',  categorie: 'A', depot: '10 avr.', joursEcoules: 10, colonne: 'en-cours',  niveauRequis: 2 },
  { id: 'G7P11', nom: 'Haja Rabe',      categorie: 'D', depot: '11 avr.', joursEcoules: 9,  colonne: 'en-cours',  niveauRequis: 3 },
  { id: 'C9P04', nom: 'Paul Randria',   categorie: 'C', depot: '10 avr.', joursEcoules: 10, colonne: 'transmis',  niveauRequis: 3 },
  { id: 'E1K55', nom: 'Fara Ravalison', categorie: 'B', depot: '8 avr.',  joursEcoules: 12, colonne: 'transmis',  niveauRequis: 2 },
]

const AGENTS_EQUIPE = [
  { nom: 'Rakoto Hery',   niveau: 1, niveauLabel: 'Réception',                dossiers: 2, enRetard: 0 },
  { nom: 'Rasoa Miora',   niveau: 2, niveauLabel: 'Validation administrative', dossiers: 2, enRetard: 1 },
  { nom: 'Andry Feno',    niveau: 3, niveauLabel: 'Traitement technique',      dossiers: 2, enRetard: 0 },
  { nom: 'Hery Niaina',   niveau: 4, niveauLabel: 'Validation finale',         dossiers: 0, enRetard: 0 },
]

const COLONNES = [
  { id: 'a-traiter', label: 'À traiter',  color: '#1A3C5E' },
  { id: 'en-cours',  label: 'En cours',   color: '#E65100' },
  { id: 'transmis',  label: 'Transmis ✓', color: '#2E7D32' },
]

const CATEGORIES = ['Tous', 'A', 'B', 'C', 'D', 'E']
const NIVEAUX    = ['Tous', 1, 2, 3, 4]

const TODAY = '21 avr.'

function DelaiBadge({ jours }) {
  const color = jours < 10 ? '#2E7D32' : jours <= 20 ? '#E65100' : '#C62828'
  const bg    = jours < 10 ? '#e8f5e9' : jours <= 20 ? '#fff3e0' : '#ffebee'
  return (
    <span style={{ background: bg, color, borderRadius: 12, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>
      {jours}j
    </span>
  )
}

export default function KanbanAgent({ agent, navigate }) {
  const [dossiers, setDossiers]               = useState(DOSSIERS_INIT)
  const [incompletModal, setIncompletModal]   = useState(null)
  const [raisonIncomplet, setRaisonIncomplet] = useState('')
  const [detailDossier, setDetailDossier]     = useState(null)
  const [onglet, setOnglet]                   = useState('kanban')
  const [filtreCategorie, setFiltreCategorie] = useState('Tous')
  const [filtreNiveau, setFiltreNiveau]       = useState('Tous')
  const [notifications, setNotifications]     = useState([
    { id: 1, message: 'Dossier B3M71 (Marie Rasoa) — incomplet : Certificat médical expiré', temps: 'Il y a 2h', lu: false },
    { id: 2, message: 'Dossier C9P04 (Paul Randria) — transmis au niveau suivant', temps: 'Il y a 4h', lu: true },
  ])
  const [notifPanel, setNotifPanel]           = useState(false)
  const [smsConfirm, setSmsConfirm]           = useState(null)
  const [dragOver, setDragOver]               = useState(null)
  const [ajoutModal, setAjoutModal]           = useState(false)
  const [nouveauDossier, setNouveauDossier]   = useState({ nom: '', categorie: 'B', niveauRequis: 1 })
  const dragId = useRef(null)

  const isAdmin = agent?.niveau === 0

  const ajouterNotif = (message) =>
    setNotifications(n => [{ id: Date.now(), message, temps: "À l'instant", lu: false }, ...n])

  const deplacer = (id, vers) => {
    const d = dossiers.find(x => x.id === id)
    setDossiers(prev => prev.map(x => x.id === id ? { ...x, colonne: vers } : x))
    setDetailDossier(null)
    if (vers === 'transmis') ajouterNotif(`Dossier ${id} (${d?.nom}) — transmis au niveau suivant`)
    else ajouterNotif(`Dossier ${id} (${d?.nom}) — pris en charge`)
  }

  const marquerIncomplet = (id) => {
    if (raisonIncomplet.trim()) {
      const d = dossiers.find(x => x.id === id)
      setDossiers(prev => prev.map(x => x.id === id ? { ...x, incomplet: raisonIncomplet, colonne: 'a-traiter' } : x))
      ajouterNotif(`Dossier ${id} (${d?.nom}) — incomplet : ${raisonIncomplet}`)
      setIncompletModal(null)
      setDetailDossier(null)
      setRaisonIncomplet('')
    }
  }

  const envoyerSMS = (dossier) => {
    setSmsConfirm(dossier.id)
    ajouterNotif(`SMS envoyé à ${dossier.nom} — dossier ${dossier.id}`)
    setTimeout(() => setSmsConfirm(null), 2500)
  }

  const ajouterDossier = () => {
    if (!nouveauDossier.nom.trim()) return
    const id = Math.random().toString(36).slice(2, 7).toUpperCase()
    const nouveau = {
      id,
      nom: nouveauDossier.nom.trim(),
      categorie: nouveauDossier.categorie,
      depot: TODAY,
      joursEcoules: 0,
      colonne: 'a-traiter',
      niveauRequis: Number(nouveauDossier.niveauRequis),
    }
    setDossiers(prev => [...prev, nouveau])
    ajouterNotif(`Nouveau dossier ${id} (${nouveau.nom}) — ajouté`)
    setAjoutModal(false)
    setNouveauDossier({ nom: '', categorie: 'B', niveauRequis: 1 })
  }

  // Drag & drop handlers
  const onDragStart = (id) => { dragId.current = id }
  const onDragOver  = (e, colId) => { e.preventDefault(); setDragOver(colId) }
  const onDragLeave = () => setDragOver(null)
  const onDrop      = (e, colId) => {
    e.preventDefault()
    if (dragId.current) deplacer(dragId.current, colId)
    dragId.current = null
    setDragOver(null)
  }

  const nbNonLus = notifications.filter(n => !n.lu).length
  const marquerTousLus = () => setNotifications(n => n.map(x => ({ ...x, lu: true })))

  const dossiersFiltresBase = isAdmin
    ? dossiers
    : dossiers.filter(d => d.niveauRequis === agent?.niveau || d.colonne === 'transmis')

  const dossiersFiltres = dossiersFiltresBase
    .filter(d => filtreCategorie === 'Tous' || d.categorie === filtreCategorie)
    .filter(d => filtreNiveau === 'Tous' || d.niveauRequis === filtreNiveau)

  const metriques = [
    { label: 'Dossiers en cours',     val: dossiers.filter(d => d.colonne !== 'transmis').length,  color: '#1A3C5E' },
    { label: 'Dossiers bloqués +20j', val: dossiers.filter(d => d.joursEcoules > 20).length,       color: '#C62828' },
    { label: 'Dossiers transmis',     val: dossiers.filter(d => d.colonne === 'transmis').length,   color: '#2E7D32' },
    { label: 'Délai moyen (j)',        val: Math.round(dossiers.reduce((s, d) => s + d.joursEcoules, 0) / dossiers.length), color: '#E65100' },
  ]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      {/* Header */}
      <header style={{ background: '#1A3C5E', color: 'white', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontWeight: 700, fontSize: 18 }}>PermisKo</span>
          <span style={{ opacity: 0.5 }}>|</span>
          <span style={{ fontSize: 14, opacity: 0.9 }}>
            {isAdmin ? '👑 Super Administrateur' : `Agent — Niveau ${agent?.niveau} : ${agent?.niveauLabel}`}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, opacity: 0.8 }}>{agent?.nom}</span>

          {/* Cloche notifications */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => { setNotifPanel(p => !p); if (!notifPanel) marquerTousLus() }}
              style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.4)', color: 'white', borderRadius: 6, padding: '5px 12px', cursor: 'pointer', fontSize: 14, position: 'relative' }}
            >
              🔔
              {nbNonLus > 0 && (
                <span style={{ position: 'absolute', top: -4, right: -4, background: '#C62828', color: 'white', borderRadius: '50%', width: 16, height: 16, fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {nbNonLus}
                </span>
              )}
            </button>
            {notifPanel && (
              <div style={{ position: 'absolute', top: 40, right: 0, background: 'white', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.18)', width: 340, zIndex: 200, overflow: 'hidden' }}>
                <div style={{ background: '#1A3C5E', color: 'white', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>🔔 Notifications</span>
                  <button onClick={() => setNotifPanel(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 18 }}>✕</button>
                </div>
                <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                  {notifications.length === 0 && (
                    <p style={{ padding: 16, color: '#9ca3af', fontSize: 13, textAlign: 'center' }}>Aucune notification</p>
                  )}
                  {notifications.map(n => (
                    <div key={n.id} style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6', background: n.lu ? 'white' : '#f0f7ff' }}>
                      <p style={{ fontSize: 13, color: '#1f2937', lineHeight: 1.4 }}>{n.message}</p>
                      <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>{n.temps}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button onClick={() => navigate('accueil')} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.4)', color: 'white', borderRadius: 6, padding: '5px 12px', cursor: 'pointer', fontSize: 13 }}>
            Déconnexion
          </button>
        </div>
      </header>

      {/* Onglets admin */}
      {isAdmin && (
        <div style={{ background: '#132d46', display: 'flex', gap: 0, paddingLeft: 24 }}>
          {[['kanban', '📋 Tableau Kanban'], ['equipe', '👥 Gestion équipe']].map(([key, label]) => (
            <button key={key} onClick={() => setOnglet(key)} style={{
              padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer',
              color: onglet === key ? 'white' : 'rgba(255,255,255,0.5)',
              fontWeight: onglet === key ? 700 : 400, fontSize: 14,
              borderBottom: onglet === key ? '3px solid #2E7D32' : '3px solid transparent',
            }}>{label}</button>
          ))}
        </div>
      )}

      <div style={{ padding: '20px 16px', maxWidth: 1100, margin: '0 auto', width: '100%' }}>

        {/* Métriques admin */}
        {isAdmin && onglet === 'kanban' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
            {metriques.map(m => (
              <div key={m.label} style={{ background: 'white', borderRadius: 10, padding: '16px 18px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: `4px solid ${m.color}` }}>
                <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>{m.label}</p>
                <p style={{ fontSize: 28, fontWeight: 800, color: m.color }}>{m.val}</p>
              </div>
            ))}
          </div>
        )}

        {/* Vue Gestion équipe */}
        {isAdmin && onglet === 'equipe' && (
          <div style={{ background: 'white', borderRadius: 12, padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h3 style={{ color: '#1A3C5E', fontWeight: 700, marginBottom: 20 }}>👥 Agents CIM — Charge de travail</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {AGENTS_EQUIPE.map(a => (
                <div key={a.niveau} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 16px', borderRadius: 10, background: '#f8fafc', border: '1px solid #e5e7eb', flexWrap: 'wrap' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#1A3C5E', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                    N{a.niveau}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: 14, color: '#1f2937' }}>{a.nom}</p>
                    <p style={{ fontSize: 12, color: '#6b7280' }}>Niveau {a.niveau} — {a.niveauLabel}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span style={{ background: '#e3f2fd', color: '#1A3C5E', borderRadius: 8, padding: '4px 12px', fontSize: 13, fontWeight: 700 }}>
                      {a.dossiers} dossier{a.dossiers > 1 ? 's' : ''}
                    </span>
                    {a.enRetard > 0 && (
                      <span style={{ background: '#ffebee', color: '#C62828', borderRadius: 8, padding: '4px 12px', fontSize: 13, fontWeight: 700 }}>
                        ⚠️ {a.enRetard} en retard
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Kanban */}
        {onglet === 'kanban' && (
          <>
            {/* Barre filtres + bouton ajouter */}
            <div style={{ background: 'white', borderRadius: 10, padding: '14px 18px', marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 12, color: '#6b7280', fontWeight: 700, minWidth: 80 }}>🚗 Catégorie :</span>
                  {CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => setFiltreCategorie(cat)} style={{
                      padding: '4px 12px', borderRadius: 16, border: '2px solid',
                      borderColor: filtreCategorie === cat ? '#1A3C5E' : '#e5e7eb',
                      background: filtreCategorie === cat ? '#1A3C5E' : 'white',
                      color: filtreCategorie === cat ? 'white' : '#374151',
                      fontWeight: 600, cursor: 'pointer', fontSize: 12,
                    }}>
                      {cat === 'Tous' ? 'Toutes' : `Permis ${cat}`}
                    </button>
                  ))}
                </div>
                {isAdmin && (
                  <button onClick={() => setAjoutModal(true)} style={{
                    padding: '7px 16px', background: '#2E7D32', color: 'white', border: 'none',
                    borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 13,
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    ＋ Nouveau dossier
                  </button>
                )}
              </div>

              {isAdmin && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 12, color: '#6b7280', fontWeight: 700, minWidth: 80 }}>🏷️ Niveau :</span>
                  {NIVEAUX.map(niv => (
                    <button key={niv} onClick={() => setFiltreNiveau(niv)} style={{
                      padding: '4px 12px', borderRadius: 16, border: '2px solid',
                      borderColor: filtreNiveau === niv ? '#2E7D32' : '#e5e7eb',
                      background: filtreNiveau === niv ? '#2E7D32' : 'white',
                      color: filtreNiveau === niv ? 'white' : '#374151',
                      fontWeight: 600, cursor: 'pointer', fontSize: 12,
                    }}>
                      {niv === 'Tous' ? 'Tous niveaux' : `Niveau ${niv}`}
                    </button>
                  ))}
                </div>
              )}

              {(filtreCategorie !== 'Tous' || filtreNiveau !== 'Tous') && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, color: '#6b7280' }}>
                    {dossiersFiltres.length} dossier{dossiersFiltres.length > 1 ? 's' : ''} affiché{dossiersFiltres.length > 1 ? 's' : ''}
                    {filtreCategorie !== 'Tous' ? ` · Permis ${filtreCategorie}` : ''}
                    {filtreNiveau !== 'Tous' ? ` · Niveau ${filtreNiveau}` : ''}
                  </span>
                  <button onClick={() => { setFiltreCategorie('Tous'); setFiltreNiveau('Tous') }}
                    style={{ fontSize: 11, color: '#C62828', background: '#ffebee', border: 'none', borderRadius: 6, padding: '2px 8px', cursor: 'pointer', fontWeight: 600 }}>
                    ✕ Réinitialiser
                  </button>
                </div>
              )}
            </div>

            {!isAdmin && (
              <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>
                📋 Affichage : dossiers assignés à votre niveau ({agent?.niveauLabel}) — <span style={{ color: '#1A3C5E', fontWeight: 600 }}>Glissez les cartes pour les déplacer</span>
              </p>
            )}
            {isAdmin && (
              <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 12 }}>✋ Glissez-déposez les cartes pour changer leur statut</p>
            )}

            {/* Colonnes Kanban avec drag & drop */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              {COLONNES.map(col => (
                <div key={col.id}
                  onDragOver={e => onDragOver(e, col.id)}
                  onDragLeave={onDragLeave}
                  onDrop={e => onDrop(e, col.id)}
                  style={{ transition: 'background 0.15s' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: col.color }} />
                    <h3 style={{ fontWeight: 700, color: '#1f2937', fontSize: 15 }}>{col.label}</h3>
                    <span style={{ background: '#e5e7eb', borderRadius: 12, padding: '1px 8px', fontSize: 12, color: '#6b7280' }}>
                      {dossiersFiltres.filter(d => d.colonne === col.id).length}
                    </span>
                  </div>

                  {/* Zone de dépôt */}
                  <div style={{
                    display: 'flex', flexDirection: 'column', gap: 10,
                    minHeight: 80, borderRadius: 10, padding: dragOver === col.id ? '8px' : '0',
                    background: dragOver === col.id ? `${col.color}12` : 'transparent',
                    border: dragOver === col.id ? `2px dashed ${col.color}` : '2px solid transparent',
                    transition: 'all 0.15s',
                  }}>
                    {dossiersFiltres.filter(d => d.colonne === col.id).map(d => (
                      <div key={d.id}
                        draggable
                        onDragStart={() => onDragStart(d.id)}
                        onClick={() => setDetailDossier(d)}
                        style={{
                          background: 'white', borderRadius: 10, padding: '14px 16px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                          borderLeft: d.incomplet ? '4px solid #E65100' : `4px solid ${col.color}40`,
                          cursor: 'grab', transition: 'box-shadow 0.15s, opacity 0.15s',
                          userSelect: 'none',
                        }}
                        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.14)'}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <p style={{ fontWeight: 700, fontSize: 13, color: '#1A3C5E' }}>#{d.id}</p>
                            <p style={{ fontSize: 14, color: '#1f2937', marginTop: 2 }}>{d.nom}</p>
                            <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>Déposé le {d.depot} · Permis {d.categorie}</p>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                            <DelaiBadge jours={d.joursEcoules} />
                            <span style={{ background: '#e3f2fd', color: '#1A3C5E', borderRadius: 6, padding: '1px 6px', fontSize: 10, fontWeight: 700 }}>N{d.niveauRequis}</span>
                          </div>
                        </div>
                        {d.incomplet && (
                          <p style={{ fontSize: 12, color: '#E65100', background: '#fff3e0', borderRadius: 4, padding: '4px 8px', marginTop: 8 }}>
                            ⚠️ {d.incomplet}
                          </p>
                        )}
                        <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
                          <span>✋ Glisser pour déplacer</span>
                          <span>Cliquer pour détails →</span>
                        </p>
                      </div>
                    ))}

                    {dossiersFiltres.filter(d => d.colonne === col.id).length === 0 && (
                      <div style={{ background: dragOver === col.id ? `${col.color}08` : '#f9fafb', borderRadius: 10, padding: '24px 16px', textAlign: 'center', color: '#9ca3af', fontSize: 13, border: '2px dashed #e5e7eb' }}>
                        {dragOver === col.id ? `⬇️ Déposer ici` : 'Aucun dossier'}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal détail dossier */}
      {detailDossier && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 100 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 28, width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ color: '#1A3C5E', fontWeight: 700, fontSize: 18 }}>📄 Dossier #{detailDossier.id}</h3>
              <button onClick={() => setDetailDossier(null)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#6b7280' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              <DetailRow label="Nom" val={detailDossier.nom} />
              <DetailRow label="Catégorie permis" val={`Permis ${detailDossier.categorie}`} />
              <DetailRow label="Date de dépôt" val={detailDossier.depot} />
              <DetailRow label="Jours écoulés" val={`${detailDossier.joursEcoules} jours`} color={detailDossier.joursEcoules > 20 ? '#C62828' : detailDossier.joursEcoules > 10 ? '#E65100' : '#2E7D32'} />
              <DetailRow label="Niveau requis" val={`Niveau ${detailDossier.niveauRequis}`} />
              {detailDossier.incomplet && (
                <div style={{ background: '#fff3e0', border: '1px solid #E65100', borderRadius: 8, padding: '10px 14px' }}>
                  <p style={{ fontSize: 12, color: '#E65100', fontWeight: 700 }}>⚠️ Dossier incomplet</p>
                  <p style={{ fontSize: 13, color: '#92400e', marginTop: 4 }}>{detailDossier.incomplet}</p>
                </div>
              )}
            </div>
            <div style={{ marginBottom: 16 }}>
              {smsConfirm === detailDossier.id ? (
                <div style={{ background: '#e8f5e9', color: '#2E7D32', borderRadius: 8, padding: '10px 14px', textAlign: 'center', fontWeight: 700, fontSize: 13 }}>
                  ✅ SMS envoyé à {detailDossier.nom}
                </div>
              ) : (
                <button onClick={() => envoyerSMS(detailDossier)}
                  style={{ width: '100%', padding: '10px', background: '#f0f4f8', color: '#1A3C5E', border: '1.5px solid #1A3C5E', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                  📱 Notifier par SMS
                </button>
              )}
            </div>
            {detailDossier.colonne !== 'transmis' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button onClick={() => deplacer(detailDossier.id, detailDossier.colonne === 'a-traiter' ? 'en-cours' : 'transmis')}
                  style={{ padding: '11px', background: '#2E7D32', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>
                  {detailDossier.colonne === 'a-traiter' ? '▶ Prendre en charge' : '✓ Valider et transmettre'}
                </button>
                <button onClick={() => { setIncompletModal(detailDossier.id); setDetailDossier(null) }}
                  style={{ padding: '11px', background: '#fff3e0', color: '#E65100', border: '1px solid #E65100', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
                  ⚠️ Marquer comme incomplet
                </button>
              </div>
            )}
            {detailDossier.colonne === 'transmis' && (
              <p style={{ textAlign: 'center', color: '#2E7D32', fontWeight: 700, fontSize: 14 }}>✅ Dossier déjà transmis</p>
            )}
          </div>
        </div>
      )}

      {/* Modal marquer incomplet */}
      {incompletModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 100 }}>
          <div style={{ background: 'white', borderRadius: 12, padding: 28, width: '100%', maxWidth: 400 }}>
            <h3 style={{ color: '#E65100', fontWeight: 700, marginBottom: 12 }}>⚠️ Marquer comme incomplet</h3>
            <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 12 }}>Précisez la pièce manquante ou non conforme :</p>
            <textarea value={raisonIncomplet} onChange={e => setRaisonIncomplet(e.target.value)}
              placeholder="Ex: Certificat médical expiré, photo non conforme..."
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 14, resize: 'vertical', minHeight: 80, outline: 'none' }}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button onClick={() => { setIncompletModal(null); setRaisonIncomplet('') }}
                style={{ flex: 1, padding: '10px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
                Annuler
              </button>
              <button onClick={() => marquerIncomplet(incompletModal)}
                style={{ flex: 1, padding: '10px', background: '#E65100', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal ajouter dossier */}
      {ajoutModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 100 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 28, width: '100%', maxWidth: 420 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ color: '#2E7D32', fontWeight: 700, fontSize: 18 }}>＋ Nouveau dossier</h3>
              <button onClick={() => setAjoutModal(false)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#6b7280' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Nom du candidat</label>
                <input value={nouveauDossier.nom} onChange={e => setNouveauDossier(p => ({ ...p, nom: e.target.value }))}
                  placeholder="Ex: Rabe Hery"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 14, outline: 'none' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Catégorie permis</label>
                  <select value={nouveauDossier.categorie} onChange={e => setNouveauDossier(p => ({ ...p, categorie: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 14, outline: 'none' }}>
                    {['A','B','C','D','E'].map(c => <option key={c} value={c}>Permis {c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Niveau requis</label>
                  <select value={nouveauDossier.niveauRequis} onChange={e => setNouveauDossier(p => ({ ...p, niveauRequis: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 14, outline: 'none' }}>
                    {[1,2,3,4].map(n => <option key={n} value={n}>Niveau {n}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
              <button onClick={() => setAjoutModal(false)}
                style={{ flex: 1, padding: '11px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
                Annuler
              </button>
              <button onClick={ajouterDossier}
                style={{ flex: 1, padding: '11px', background: '#2E7D32', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>
                ＋ Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function DetailRow({ label, val, color }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
      <span style={{ fontSize: 13, color: '#6b7280' }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 600, color: color || '#1f2937' }}>{val}</span>
    </div>
  )
}
