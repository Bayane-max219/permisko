import { useState } from 'react'

const AGENTS = {
  'agent1@cim.mg': { mdp: '1234', nom: 'Rakoto Hery', niveau: 2, niveauLabel: 'Validation administrative' },
  'admin@cim.mg': { mdp: 'admin', nom: 'Directeur CIM', niveau: 0, niveauLabel: 'Super Administrateur' },
}

export default function LoginAgent({ navigate, langue, setLangue }) {
  const [email, setEmail] = useState('')
  const [mdp, setMdp] = useState('')
  const [erreur, setErreur] = useState('')

  const T = {
    fr: {
      retour: '← Accueil',
      titre: 'Espace Agent',
      sousTitre: 'Connexion agent',
      accesReserve: 'Accès réservé au personnel CIM',
      labelEmail: 'Email / Identifiant',
      labelMdp: 'Mot de passe',
      boutonConnexion: 'Se connecter',
      erreurMsg: 'Email ou mot de passe incorrect',
      securite: '🔒 Connexion sécurisée — authentification à double facteur activée',
      compteDemo: 'Comptes de démo :',
    },
    mg: {
      retour: '← Fandraisana',
      titre: 'Faritra Mpiasa',
      sousTitre: 'Hiditra mpiasa',
      accesReserve: 'Fidirana ho an\'ny mpiasa CIM ihany',
      labelEmail: 'Email / Kaonta',
      labelMdp: 'Teny miafina',
      boutonConnexion: 'Hiditra',
      erreurMsg: 'Email na teny miafina diso',
      securite: '🔒 Fidirana voaaro — authentification roa dingana',
      compteDemo: 'Kaonta demo :',
    }
  }[langue]

  const handleLogin = () => {
    const agent = AGENTS[email]
    if (agent && agent.mdp === mdp) {
      navigate('kanban', { agent: { ...agent, email } })
    } else {
      setErreur(T.erreurMsg)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      <header style={{ background: '#1A3C5E', color: 'white', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => navigate('accueil')} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.4)', color: 'white', borderRadius: 6, padding: '6px 12px', cursor: 'pointer' }}>{T.retour}</button>
          <img src="/logo.png" alt="PermisKo" style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'cover' }} />
          <span style={{ fontWeight: 700, fontSize: 18 }}>PermisKo — {T.titre}</span>
        </div>
        <LangueToggle langue={langue} setLangue={setLangue} />
      </header>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative' }}>
        <img src="/batiment-cim.png" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', opacity: 0.12 }} />
        <div style={{ background: 'white', borderRadius: 16, padding: '40px 36px', width: '100%', maxWidth: 420, boxShadow: '0 4px 24px rgba(0,0,0,0.10)' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ width: 56, height: 56, background: '#1A3C5E', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 24 }}>🔐</div>
            <h2 style={{ color: '#1A3C5E', fontWeight: 700, fontSize: 22 }}>{T.sousTitre}</h2>
            <p style={{ color: '#6b7280', fontSize: 14, marginTop: 4 }}>{T.accesReserve}</p>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>{T.labelEmail}</label>
            <input value={email} onChange={e => { setEmail(e.target.value); setErreur('') }}
              placeholder="agent@cim.mg"
              style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 15, outline: 'none' }}
              onFocus={e => e.target.style.borderColor = '#1A3C5E'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>{T.labelMdp}</label>
            <input value={mdp} onChange={e => { setMdp(e.target.value); setErreur('') }}
              type="password" placeholder="••••••••"
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 15, outline: 'none' }}
              onFocus={e => e.target.style.borderColor = '#1A3C5E'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {erreur && <p style={{ color: '#C62828', fontSize: 13, marginBottom: 16, background: '#ffebee', padding: '8px 12px', borderRadius: 6 }}>⚠️ {erreur}</p>}

          <button onClick={handleLogin}
            style={{ width: '100%', padding: '13px', background: '#1A3C5E', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
            {T.boutonConnexion}
          </button>

          <p style={{ textAlign: 'center', fontSize: 12, color: '#9ca3af', marginTop: 16 }}>
            {T.securite}
          </p>

          <div style={{ marginTop: 20, background: '#f8fafc', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#6b7280' }}>
            <p style={{ fontWeight: 600, marginBottom: 4 }}>{T.compteDemo}</p>
            <p>agent1@cim.mg / 1234 (Niveau 2)</p>
            <p>admin@cim.mg / admin (Super Admin)</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function LangueToggle({ langue, setLangue }) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      <button onClick={() => setLangue('fr')} style={{ padding: '4px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', background: langue === 'fr' ? 'white' : 'transparent', color: langue === 'fr' ? '#1A3C5E' : 'rgba(255,255,255,0.8)', fontWeight: 600 }}>🇫🇷 FR</button>
      <button onClick={() => setLangue('mg')} style={{ padding: '4px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', background: langue === 'mg' ? 'white' : 'transparent', color: langue === 'mg' ? '#1A3C5E' : 'rgba(255,255,255,0.8)', fontWeight: 600 }}>🇲🇬 MG</button>
    </div>
  )
}
