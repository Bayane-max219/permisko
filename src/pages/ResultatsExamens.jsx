import { useState } from 'react'

const CANDIDATS = [
  { id: 'A7K29', nom: 'Jean Rakoto',     categorie: 'B', theorie: 'admis',      pratique: 'en-attente', date: '12 avr.' },
  { id: 'B3M71', nom: 'Marie Rasoa',     categorie: 'B', theorie: 'admis',      pratique: 'refuse',     date: '12 avr.' },
  { id: 'C9P04', nom: 'Paul Randria',    categorie: 'C', theorie: 'admis',      pratique: 'admis',      date: '10 avr.' },
  { id: 'D2F88', nom: 'Luc Ramaroson',   categorie: 'A', theorie: 'refuse',     pratique: null,         date: '14 avr.' },
  { id: 'E1K55', nom: 'Fara Ravalison',  categorie: 'B', theorie: 'admis',      pratique: 'admis',      date: '8 avr.'  },
  { id: 'F3K22', nom: 'Solo Andria',     categorie: 'A', theorie: 'en-attente', pratique: null,         date: '15 avr.' },
  { id: 'G7P11', nom: 'Haja Rabe',       categorie: 'D', theorie: 'admis',      pratique: 'en-attente', date: '11 avr.' },
  { id: 'H5M33', nom: 'Vola Razafy',     categorie: 'B', theorie: 'admis',      pratique: 'admis',      date: '9 avr.'  },
  { id: 'I2N66', nom: 'Tojo Rakotondr.', categorie: 'C', theorie: 'en-attente', pratique: null,         date: '16 avr.' },
  { id: 'J8P44', nom: 'Nirina Andria',   categorie: 'A', theorie: 'admis',      pratique: 'refuse',     date: '7 avr.'  },
]

const STATUT_CONFIG = {
  admis:      { label: { fr: 'Admis',      mg: 'Nandalo'    }, bg: '#e8f5e9', color: '#2E7D32' },
  refuse:     { label: { fr: 'Refusé',     mg: 'Nampody'    }, bg: '#ffebee', color: '#C62828' },
  'en-attente':{ label: { fr: 'En attente', mg: 'Miandry'   }, bg: '#fff3e0', color: '#E65100' },
}

export default function ResultatsExamens({ navigate, langue, setLangue }) {
  const [filtre, setFiltre] = useState('Tous')

  const T = {
    fr: {
      retour: '← Retour',
      titre: 'Résultats d\'examens',
      sousTitre: 'Liste des candidats — Session avril 2026',
      tousCategories: 'Toutes catégories',
      theorie: 'Théorie',
      pratique: 'Pratique',
      date: 'Date examen',
      voirDossier: 'Voir dossier',
      nonPasse: 'Non passé',
      total: 'candidats',
    },
    mg: {
      retour: '← Hiverina',
      titre: 'Vokatra fanadinana',
      sousTitre: 'Lisitry ny mpandalo — Fivoriana aprily 2026',
      tousCategories: 'Sokaji rehetra',
      theorie: 'Teôrika',
      pratique: 'Pratika',
      date: 'Daty fanadinana',
      voirDossier: 'Jereo dossier',
      nonPasse: 'Tsy nandalo',
      total: 'mpandalo',
    }
  }[langue]

  const categories = ['Tous', 'A', 'B', 'C', 'D', 'E']
  const candidatsFiltres = filtre === 'Tous' ? CANDIDATS : CANDIDATS.filter(c => c.categorie === filtre)

  const stats = {
    admisTheorie: CANDIDATS.filter(c => c.theorie === 'admis').length,
    admisTotal: CANDIDATS.filter(c => c.pratique === 'admis').length,
    enAttente: CANDIDATS.filter(c => c.theorie === 'en-attente' || c.pratique === 'en-attente').length,
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      <header style={{ background: '#1A3C5E', color: 'white', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => navigate('accueil')} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.4)', color: 'white', borderRadius: 6, padding: '6px 12px', cursor: 'pointer' }}>{T.retour}</button>
          <img src="/logo.png" alt="PermisKo" style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'cover' }} />
          <span style={{ fontWeight: 700, fontSize: 18 }}>PermisKo — {T.titre}</span>
        </div>
        <LangueToggle langue={langue} setLangue={setLangue} />
      </header>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px', width: '100%' }}>

        {/* Stats rapides */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
          <StatCard label={langue === 'fr' ? 'Total candidats' : 'Mpandalo rehetra'} val={CANDIDATS.length} color="#1A3C5E" />
          <StatCard label={langue === 'fr' ? 'Admis théorie' : 'Nandalo teôrika'} val={stats.admisTheorie} color="#2E7D32" />
          <StatCard label={langue === 'fr' ? 'Admis pratique' : 'Nandalo pratika'} val={stats.admisTotal} color="#2E7D32" />
          <StatCard label={langue === 'fr' ? 'En attente' : 'Miandry'} val={stats.enAttente} color="#E65100" />
        </div>

        {/* Filtre catégorie */}
        <div style={{ background: 'white', borderRadius: 12, padding: '16px 20px', marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 600 }}>Catégorie :</span>
          {categories.map(cat => (
            <button key={cat} onClick={() => setFiltre(cat)} style={{
              padding: '5px 14px', borderRadius: 20, border: '2px solid',
              borderColor: filtre === cat ? '#1A3C5E' : '#e5e7eb',
              background: filtre === cat ? '#1A3C5E' : 'white',
              color: filtre === cat ? 'white' : '#374151',
              fontWeight: 600, cursor: 'pointer', fontSize: 13
            }}>
              {cat === 'Tous' ? T.tousCategories : `Permis ${cat}`}
            </button>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: 13, color: '#6b7280' }}>{candidatsFiltres.length} {T.total}</span>
        </div>

        {/* Liste résultats */}
        <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          {/* Header tableau */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px 110px 110px 100px', gap: 8, padding: '12px 20px', background: '#f8fafc', borderBottom: '1px solid #e5e7eb', fontSize: 12, fontWeight: 700, color: '#6b7280' }}>
            <span>N° DOSSIER</span>
            <span>NOM</span>
            <span>CAT.</span>
            <span>{T.theorie}</span>
            <span>{T.pratique}</span>
            <span>{T.date}</span>
          </div>

          {candidatsFiltres.map((c, i) => (
            <div key={c.id} onClick={() => navigate('suivi', { dossierId: c.id })}
              style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr 80px 110px 110px 100px',
                gap: 8, padding: '14px 20px',
                borderBottom: i < candidatsFiltres.length - 1 ? '1px solid #f3f4f6' : 'none',
                cursor: 'pointer', transition: 'background 0.15s',
                alignItems: 'center',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#f0f4f8'}
              onMouseLeave={e => e.currentTarget.style.background = 'white'}
            >
              <span style={{ fontWeight: 700, color: '#1A3C5E', fontSize: 13 }}>#{c.id}</span>
              <span style={{ fontSize: 14, color: '#1f2937' }}>{c.nom}</span>
              <span style={{ background: '#e3f2fd', color: '#1A3C5E', borderRadius: 6, padding: '2px 8px', fontWeight: 700, fontSize: 12, textAlign: 'center' }}>{c.categorie}</span>
              <StatutBadge statut={c.theorie} langue={langue} />
              <StatutBadge statut={c.pratique} langue={langue} nonPasse={T.nonPasse} />
              <span style={{ fontSize: 12, color: '#9ca3af' }}>{c.date}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

function StatutBadge({ statut, langue, nonPasse }) {
  if (!statut) return <span style={{ fontSize: 12, color: '#9ca3af' }}>{nonPasse || '—'}</span>
  const cfg = STATUT_CONFIG[statut]
  return (
    <span style={{ background: cfg.bg, color: cfg.color, borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 700 }}>
      {cfg.label[langue]}
    </span>
  )
}

function StatCard({ label, val, color }) {
  return (
    <div style={{ background: 'white', borderRadius: 10, padding: '14px 18px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: `4px solid ${color}` }}>
      <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 26, fontWeight: 800, color }}>{val}</p>
    </div>
  )
}

function LangueToggle({ langue, setLangue }) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      <button onClick={() => setLangue('fr')} style={{ padding: '4px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', background: langue === 'fr' ? 'white' : 'transparent', color: langue === 'fr' ? '#1A3C5E' : 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: 13 }}>🇫🇷 Français</button>
      <button onClick={() => setLangue('mg')} style={{ padding: '4px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', background: langue === 'mg' ? 'white' : 'transparent', color: langue === 'mg' ? '#1A3C5E' : 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: 13 }}>🇲🇬 Malagasy</button>
    </div>
  )
}
