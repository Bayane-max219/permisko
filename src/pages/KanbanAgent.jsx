import { useState } from 'react'

const DOSSIERS_INIT = [
  { id: 'A7K29', nom: 'Jean Rakoto', depot: '13 avr.', joursEcoules: 4, colonne: 'a-traiter' },
  { id: 'B3M71', nom: 'Marie Rasoa', depot: '15 avr.', joursEcoules: 2, colonne: 'a-traiter', incomplet: 'Certificat médical expiré' },
  { id: 'D2F88', nom: 'Luc Ramaroson', depot: '10 avr.', joursEcoules: 7, colonne: 'en-cours' },
  { id: 'C9P04', nom: 'Paul Randria', depot: '10 avr.', joursEcoules: 7, colonne: 'transmis' },
  { id: 'E1K55', nom: 'Fara Ravalison', depot: '8 avr.', joursEcoules: 9, colonne: 'transmis' },
]

const COLONNES = [
  { id: 'a-traiter', label: 'À traiter', color: '#1A3C5E' },
  { id: 'en-cours', label: 'En cours', color: '#E65100' },
  { id: 'transmis', label: 'Transmis ✓', color: '#2E7D32' },
]

function DelaiBadge({ jours }) {
  const color = jours < 10 ? '#2E7D32' : jours <= 20 ? '#E65100' : '#C62828'
  const bg = jours < 10 ? '#e8f5e9' : jours <= 20 ? '#fff3e0' : '#ffebee'
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

  const deplacer = (id, vers) => setDossiers(d => d.map(x => x.id === id ? { ...x, colonne: vers } : x))

  const marquerIncomplet = (id) => {
    if (raisonIncomplet.trim()) {
      setDossiers(d => d.map(x => x.id === id ? { ...x, incomplet: raisonIncomplet, colonne: 'a-traiter' } : x))
      setIncompletModal(null)
      setRaisonIncomplet('')
    }
  }

  const isAdmin = agent?.niveau === 0

  const metriques = [
    { label: 'Dossiers en cours', val: dossiers.filter(d => d.colonne !== 'transmis').length, color: '#1A3C5E' },
    { label: 'Dossiers bloqués (+20j)', val: dossiers.filter(d => d.joursEcoules > 20).length, color: '#C62828' },
    { label: 'Dossiers transmis', val: dossiers.filter(d => d.colonne === 'transmis').length, color: '#2E7D32' },
    { label: 'Délai moyen (j)', val: Math.round(dossiers.reduce((s, d) => s + d.joursEcoules, 0) / dossiers.length), color: '#E65100' },
  ]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      {/* Header */}
      <header style={{ background: '#1A3C5E', color: 'white', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontWeight: 700, fontSize: 18 }}>PermisKo</span>
          <span style={{ opacity: 0.7, fontSize: 14 }}>|</span>
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

      <div style={{ padding: '20px 16px', maxWidth: 1100, margin: '0 auto', width: '100%' }}>
        {/* Métriques */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
          {metriques.map(m => (
            <div key={m.label} style={{ background: 'white', borderRadius: 10, padding: '16px 18px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: `4px solid ${m.color}` }}>
              <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>{m.label}</p>
              <p style={{ fontSize: 28, fontWeight: 800, color: m.color }}>{m.val}</p>
            </div>
          ))}
        </div>

        {/* Kanban */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {COLONNES.map(col => (
            <div key={col.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: col.color }} />
                <h3 style={{ fontWeight: 700, color: '#1f2937', fontSize: 15 }}>{col.label}</h3>
                <span style={{ background: '#e5e7eb', borderRadius: 12, padding: '1px 8px', fontSize: 12, color: '#6b7280' }}>
                  {dossiers.filter(d => d.colonne === col.id).length}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {dossiers.filter(d => d.colonne === col.id).map(d => (
                  <div key={d.id} style={{ background: 'white', borderRadius: 10, padding: '14px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: d.incomplet ? '4px solid #E65100' : '4px solid transparent' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: 13, color: '#1A3C5E' }}>#{d.id}</p>
                        <p style={{ fontSize: 14, color: '#1f2937', marginTop: 2 }}>{d.nom}</p>
                        <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>Déposé le {d.depot}</p>
                      </div>
                      <DelaiBadge jours={d.joursEcoules} />
                    </div>
                    {d.incomplet && (
                      <p style={{ fontSize: 12, color: '#E65100', background: '#fff3e0', borderRadius: 4, padding: '4px 8px', marginTop: 8 }}>
                        ⚠️ {d.incomplet}
                      </p>
                    )}
                    {col.id !== 'transmis' && (
                      <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                        <button onClick={() => deplacer(d.id, col.id === 'a-traiter' ? 'en-cours' : 'transmis')}
                          style={{ flex: 1, padding: '6px', background: '#2E7D32', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                          {col.id === 'a-traiter' ? 'Prendre en charge →' : 'Valider et transmettre →'}
                        </button>
                        <button onClick={() => setIncompletModal(d.id)}
                          style={{ padding: '6px 10px', background: '#fff3e0', color: '#E65100', border: '1px solid #E65100', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                          ⚠️
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {dossiers.filter(d => d.colonne === col.id).length === 0 && (
                  <div style={{ background: '#f9fafb', borderRadius: 10, padding: '24px 16px', textAlign: 'center', color: '#9ca3af', fontSize: 13, border: '2px dashed #e5e7eb' }}>
                    Aucun dossier
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

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
