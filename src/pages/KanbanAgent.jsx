import { useState } from 'react'

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
  { nom: 'Rakoto Hery',   niveau: 1, niveauLabel: 'Réception',               dossiers: 2, enRetard: 0 },
  { nom: 'Rasoa Miora',   niveau: 2, niveauLabel: 'Validation administrative', dossiers: 2, enRetard: 1 },
  { nom: 'Andry Feno',    niveau: 3, niveauLabel: 'Traitement technique',      dossiers: 2, enRetard: 0 },
  { nom: 'Hery Niaina',   niveau: 4, niveauLabel: 'Validation finale',         dossiers: 0, enRetard: 0 },
]

const COLONNES = [
  { id: 'a-traiter', label: 'À traiter',   color: '#1A3C5E' },
  { id: 'en-cours',  label: 'En cours',    color: '#E65100' },
  { id: 'transmis',  label: 'Transmis ✓',  color: '#2E7D32' },
]

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
  const [dossiers, setDossiers] = useState(DOSSIERS_INIT)
  const [incompletModal, setIncompletModal] = useState(null)
  const [raisonIncomplet, setRaisonIncomplet] = useState('')
  const [detailDossier, setDetailDossier] = useState(null)
  const [onglet, setOnglet] = useState('kanban')

  const isAdmin = agent?.niveau === 0

  const deplacer = (id, vers) => {
    setDossiers(d => d.map(x => x.id === id ? { ...x, colonne: vers } : x))
    setDetailDossier(null)
  }

  const marquerIncomplet = (id) => {
    if (raisonIncomplet.trim()) {
      setDossiers(d => d.map(x => x.id === id ? { ...x, incomplet: raisonIncomplet, colonne: 'a-traiter' } : x))
      setIncompletModal(null)
      setDetailDossier(null)
      setRaisonIncomplet('')
    }
  }

  const dossiersFiltres = isAdmin
    ? dossiers
    : dossiers.filter(d => d.niveauRequis === agent?.niveau || d.colonne === 'transmis')

  const metriques = [
    { label: 'Dossiers en cours',     val: dossiers.filter(d => d.colonne !== 'transmis').length,  color: '#1A3C5E' },
    { label: 'Dossiers bloqués +20j', val: dossiers.filter(d => d.joursEcoules > 20).length,       color: '#C62828' },
    { label: 'Dossiers transmis',     val: dossiers.filter(d => d.colonne === 'transmis').length,   color: '#2E7D32' },
    { label: 'Délai moyen (j)',        val: Math.round(dossiers.reduce((s, d) => s + d.joursEcoules, 0) / dossiers.length), color: '#E65100' },
  ]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      {/* Header */}
      <header style={{ background: '#1A3C5E', color: 'white', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontWeight: 700, fontSize: 18 }}>PermisKo</span>
          <span style={{ opacity: 0.5 }}>|</span>
          <span style={{ fontSize: 14, opacity: 0.9 }}>
            {isAdmin ? '👑 Super Administrateur' : `Agent — Niveau ${agent?.niveau} : ${agent?.niveauLabel}`}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, opacity: 0.8 }}>{agent?.nom}</span>
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

        {/* Métriques — admin seulement */}
        {isAdmin && onglet === 'kanban' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
            {metriques.map(m => (
              <div key={m.label} style={{ background: 'white', borderRadius: 10, padding: '16px 18px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: `4px solid ${m.color}` }}>
                <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>{m.label}</p>
                <p style={{ fontSize: 28, fontWeight: 800, color: m.color }}>{m.val}</p>
              </div>
            ))}
          </div>
        )}

        {/* Vue Gestion équipe (admin uniquement) */}
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
            {!isAdmin && (
              <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>
                📋 Affichage : dossiers assignés à votre niveau ({agent?.niveauLabel})
              </p>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              {COLONNES.map(col => (
                <div key={col.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: col.color }} />
                    <h3 style={{ fontWeight: 700, color: '#1f2937', fontSize: 15 }}>{col.label}</h3>
                    <span style={{ background: '#e5e7eb', borderRadius: 12, padding: '1px 8px', fontSize: 12, color: '#6b7280' }}>
                      {dossiersFiltres.filter(d => d.colonne === col.id).length}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {dossiersFiltres.filter(d => d.colonne === col.id).map(d => (
                      <div key={d.id}
                        onClick={() => setDetailDossier(d)}
                        style={{ background: 'white', borderRadius: 10, padding: '14px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: d.incomplet ? '4px solid #E65100' : '4px solid transparent', cursor: 'pointer', transition: 'box-shadow 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <p style={{ fontWeight: 700, fontSize: 13, color: '#1A3C5E' }}>#{d.id}</p>
                            <p style={{ fontSize: 14, color: '#1f2937', marginTop: 2 }}>{d.nom}</p>
                            <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>Déposé le {d.depot} · Permis {d.categorie}</p>
                          </div>
                          <DelaiBadge jours={d.joursEcoules} />
                        </div>
                        {d.incomplet && (
                          <p style={{ fontSize: 12, color: '#E65100', background: '#fff3e0', borderRadius: 4, padding: '4px 8px', marginTop: 8 }}>
                            ⚠️ {d.incomplet}
                          </p>
                        )}
                        <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 8, textAlign: 'right' }}>Cliquer pour voir les détails →</p>
                      </div>
                    ))}
                    {dossiersFiltres.filter(d => d.colonne === col.id).length === 0 && (
                      <div style={{ background: '#f9fafb', borderRadius: 10, padding: '24px 16px', textAlign: 'center', color: '#9ca3af', fontSize: 13, border: '2px dashed #e5e7eb' }}>
                        Aucun dossier
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

            {/* Actions */}
            {detailDossier.colonne !== 'transmis' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button
                  onClick={() => deplacer(detailDossier.id, detailDossier.colonne === 'a-traiter' ? 'en-cours' : 'transmis')}
                  style={{ padding: '11px', background: '#2E7D32', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 700 }}
                >
                  {detailDossier.colonne === 'a-traiter' ? '▶ Prendre en charge' : '✓ Valider et transmettre'}
                </button>
                <button
                  onClick={() => { setIncompletModal(detailDossier.id); setDetailDossier(null) }}
                  style={{ padding: '11px', background: '#fff3e0', color: '#E65100', border: '1px solid #E65100', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}
                >
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
