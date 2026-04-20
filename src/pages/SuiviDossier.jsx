const DOSSIERS = {
  A7K29: { nom: 'Jean Rakoto', statut: 'EN COURS', niveau: 3, depot: '13 avr.', historique: [
    { date: '13 avr. 09:14', msg: { fr: 'Dossier reçu au niveau 1 — Réception', mg: 'Dossier noraisina tao niveau 1 — Fandraisana' } },
    { date: '14 avr. 11:30', msg: { fr: 'Transmis au niveau 2 — Validation administrative', mg: 'Nalefa tany niveau 2 — Fanamafisana ara-pitantanana' } },
    { date: '15 avr. 14:32', msg: { fr: 'Transmis au niveau 3 — Traitement technique', mg: 'Nalefa tany niveau 3 — Fikirakirana teknika' } },
  ]},
  B3M71: { nom: 'Marie Rasoa', statut: 'INCOMPLET', niveau: 1, depot: '15 avr.', pieceManquante: { fr: 'Certificat médical expiré', mg: 'Taratasin\'ny dokotera tsy ampy' }, historique: [
    { date: '15 avr. 08:20', msg: { fr: 'Dossier reçu au niveau 1 — Réception', mg: 'Dossier noraisina tao niveau 1 — Fandraisana' } },
    { date: '15 avr. 15:45', msg: { fr: 'Dossier marqué incomplet — Certificat médical expiré', mg: 'Dossier nataon-dratsy — Taratasin\'ny dokotera tsy ampy' } },
  ]},
  C9P04: { nom: 'Paul Randria', statut: 'DISPONIBLE', niveau: 5, depot: '10 avr.', retrait: { fr: '18 avr. à 15h — Guichet 306', mg: '18 avr. amin\'ny 15h — Varavaran\'asa 306' }, historique: [
    { date: '10 avr. 10:00', msg: { fr: 'Dossier reçu au niveau 1 — Réception', mg: 'Dossier noraisina tao niveau 1 — Fandraisana' } },
    { date: '11 avr. 14:00', msg: { fr: 'Transmis au niveau 2 — Validation administrative', mg: 'Nalefa tany niveau 2 — Fanamafisana ara-pitantanana' } },
    { date: '12 avr. 09:00', msg: { fr: 'Transmis au niveau 3 — Traitement technique', mg: 'Nalefa tany niveau 3 — Fikirakirana teknika' } },
    { date: '13 avr. 11:00', msg: { fr: 'Transmis au niveau 4 — Validation finale', mg: 'Nalefa tany niveau 4 — Fanamafisana farany' } },
    { date: '17 avr. 08:30', msg: { fr: 'Permis disponible — Guichet 306', mg: 'Permis vonona — Varavaran\'asa 306' } },
  ]},
}

const ETAPES = {
  fr: [
    'Réception et vérification initiale',
    'Validation administrative',
    'Traitement technique et saisie',
    'Validation finale et impression',
    'Disponible au guichet',
  ],
  mg: [
    'Fandraisana sy fanamarinana',
    'Fanamafisana ara-pitantanana',
    'Fikirakirana teknika',
    'Fanamafisana farany sy fanontana',
    'Vonona ao am-paotera',
  ],
}

export default function SuiviDossier({ dossierId, navigate, langue, setLangue }) {
  const dossier = DOSSIERS[dossierId]
  const etapes = ETAPES[langue]

  const T = {
    fr: {
      retour: '← Retour',
      progression: 'Progression du dossier',
      historique: 'Historique des changements',
      smsLabel: '📱 Recevoir les notifications SMS',
      smsDesc: 'Soyez averti à chaque changement de statut',
      activer: 'Activer',
      introuvable: 'Dossier introuvable',
      introuvableDesc: 'Identifiant',
      introuvableSub: 'non reconnu. Essayez : A7K29, B3M71 ou C9P04',
      retourAccueil: 'Retour à l\'accueil',
      depose: 'Déposé le',
      retrait: '📍 Retrait :',
    },
    mg: {
      retour: '← Hiverina',
      progression: 'Fivoaran\'ny dossier',
      historique: 'Tantara ny fiovana',
      smsLabel: '📱 Mandray SMS',
      smsDesc: 'Ho fantatra isaky ny fiovana',
      activer: 'Ampifanaraho',
      introuvable: 'Dossier tsy hita',
      introuvableDesc: 'Laharana',
      introuvableSub: 'tsy fantatra. Andramo : A7K29, B3M71 na C9P04',
      retourAccueil: 'Hiverina any am-piandohana',
      depose: 'Nalefa tamin\'ny',
      retrait: '📍 Faritana :',
    }
  }[langue]

  const statutConfig = {
    'EN COURS': {
      bg: '#e3f2fd', color: '#1A3C5E',
      label: { fr: '🔵 EN COURS', mg: '🔵 MANDROSO' }
    },
    'INCOMPLET': {
      bg: '#fff3e0', color: '#E65100',
      label: { fr: '⚠️ INCOMPLET', mg: '⚠️ TSY FENO' }
    },
    'DISPONIBLE': {
      bg: '#e8f5e9', color: '#2E7D32',
      label: { fr: '✅ DISPONIBLE', mg: '✅ VONONA' }
    },
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ background: '#1A3C5E', color: 'white', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => navigate('accueil')} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.4)', color: 'white', borderRadius: 6, padding: '6px 12px', cursor: 'pointer' }}>{T.retour}</button>
          <div>
            <img src="/logo.png" alt="PermisKo" style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'cover' }} />
          <span style={{ fontWeight: 700, fontSize: 18 }}>PermisKo</span>
            {dossier && <span style={{ opacity: 0.8, marginLeft: 12, fontSize: 14 }}>#{dossierId} — {dossier.nom.split(' ')[0]} {dossier.nom.split(' ')[1][0]}.</span>}
          </div>
        </div>
        <LangueToggle langue={langue} setLangue={setLangue} />
      </header>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px', width: '100%' }}>
        {!dossier ? (
          <div style={{ background: 'white', borderRadius: 12, padding: 32, textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <h2 style={{ color: '#1A3C5E', marginBottom: 8 }}>{T.introuvable}</h2>
            <p style={{ color: '#6b7280' }}>{T.introuvableDesc} <strong>{dossierId}</strong> {T.introuvableSub}</p>
            <button onClick={() => navigate('accueil')} style={{ marginTop: 20, padding: '10px 24px', background: '#1A3C5E', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
              {T.retourAccueil}
            </button>
          </div>
        ) : (
          <>
            {/* Carte statut */}
            <div style={{ background: statutConfig[dossier.statut].bg, border: `2px solid ${statutConfig[dossier.statut].color}40`, borderRadius: 12, padding: '20px 24px', marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <span style={{ background: statutConfig[dossier.statut].color, color: 'white', borderRadius: 20, padding: '4px 14px', fontWeight: 700, fontSize: 14 }}>{statutConfig[dossier.statut].label[langue]}</span>
                  <p style={{ color: '#374151', marginTop: 10, fontWeight: 600, fontSize: 16 }}>{dossier.nom}</p>
                </div>
                <div style={{ textAlign: 'right', fontSize: 14, color: '#6b7280' }}>
                  <p>{T.depose} {dossier.depot}</p>
                  {dossier.statut === 'DISPONIBLE' && <p style={{ color: '#2E7D32', fontWeight: 600, marginTop: 4 }}>{T.retrait} {dossier.retrait[langue]}</p>}
                  {dossier.statut === 'INCOMPLET' && <p style={{ color: '#E65100', fontWeight: 600, marginTop: 4 }}>⚠️ {dossier.pieceManquante[langue]}</p>}
                </div>
              </div>
            </div>

            {/* Stepper 5 niveaux */}
            <div style={{ background: 'white', borderRadius: 12, padding: '24px', marginBottom: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <h3 style={{ color: '#1A3C5E', marginBottom: 20, fontWeight: 700 }}>{T.progression}</h3>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, overflowX: 'auto', paddingBottom: 8 }}>
                {etapes.map((etape, i) => {
                  const num = i + 1
                  const fait = num < dossier.niveau
                  const actuel = num === dossier.niveau
                  const futur = num > dossier.niveau
                  return (
                    <div key={i} style={{ flex: 1, minWidth: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                      {i < etapes.length - 1 && (
                        <div style={{ position: 'absolute', top: 16, left: '50%', width: '100%', height: 3, background: fait ? '#2E7D32' : '#e5e7eb', zIndex: 0 }} />
                      )}
                      <div style={{
                        width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: fait ? '#2E7D32' : actuel ? '#1A3C5E' : '#e5e7eb',
                        color: futur ? '#9ca3af' : 'white', fontWeight: 700, fontSize: 14, zIndex: 1, position: 'relative',
                        border: actuel ? '3px solid #1A3C5E' : 'none',
                        boxShadow: actuel ? '0 0 0 4px #1A3C5E30' : 'none'
                      }}>
                        {fait ? '✓' : num}
                      </div>
                      <p style={{ fontSize: 11, textAlign: 'center', marginTop: 8, color: futur ? '#9ca3af' : actuel ? '#1A3C5E' : '#2E7D32', fontWeight: actuel ? 700 : 400, padding: '0 4px' }}>
                        {etape}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Historique */}
            <div style={{ background: 'white', borderRadius: 12, padding: '24px', marginBottom: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <h3 style={{ color: '#1A3C5E', marginBottom: 16, fontWeight: 700 }}>{T.historique}</h3>
              {dossier.historique.map((h, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, paddingBottom: 12, borderBottom: i < dossier.historique.length - 1 ? '1px solid #f3f4f6' : 'none', marginBottom: i < dossier.historique.length - 1 ? 12 : 0 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#1A3C5E', marginTop: 6, flexShrink: 0 }} />
                  <div>
                    <span style={{ fontSize: 12, color: '#9ca3af', display: 'block' }}>{h.date}</span>
                    <span style={{ fontSize: 14, color: '#374151' }}>{h.msg[langue]}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* SMS */}
            <div style={{ background: '#f0f4f8', borderRadius: 12, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <p style={{ fontWeight: 600, color: '#1A3C5E' }}>{T.smsLabel}</p>
                <p style={{ fontSize: 13, color: '#6b7280' }}>{T.smsDesc}</p>
              </div>
              <button style={{ padding: '10px 20px', background: '#1A3C5E', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
                {T.activer}
              </button>
            </div>
          </>
        )}
      </div>
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
