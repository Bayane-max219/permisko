import { useState } from 'react'

const PIECES_BASE = {
  fr: [
    { id: 1, label: 'Copie d\'acte de naissance', alerte: null },
    { id: 2, label: '5 photos d\'identité (fond blanc, 3,5×4,5 cm, récentes)', alerte: null },
    { id: 3, label: 'Certificat de résidence', alerte: null },
    { id: 4, label: 'Copie légalisée de la CIN', alerte: null },
    { id: 5, label: 'Certificat médical', alerte: '⚠️ Doit dater de moins de 3 mois' },
    { id: 6, label: 'Bordereau d\'envoi remis par votre auto-école', alerte: null },
    { id: 7, label: 'Chemise cartonnée verte', alerte: null },
    { id: 8, label: '38 000 Ar en espèces (frais de dossier)', alerte: null },
  ],
  mg: [
    { id: 1, label: 'Kopia kara-pahaterahan\'ny', alerte: null },
    { id: 2, label: 'Sary 5 (fotsy ny ambadika, 3,5×4,5 cm, vaovao)', alerte: null },
    { id: 3, label: 'Taratasim-ponenana', alerte: null },
    { id: 4, label: 'Kopia legalizé ny CIN', alerte: null },
    { id: 5, label: 'Taratasin\'ny dokotera', alerte: '⚠️ Tsy tokony ho lasa 3 volana' },
    { id: 6, label: 'Bordereau avy amin\'ny auto-école-nao', alerte: null },
    { id: 7, label: 'Faribolana biraoka maitso', alerte: null },
    { id: 8, label: '38 000 Ar vola madinika (sara dossier)', alerte: null },
  ],
}

const PIECES_CDE = {
  fr: { id: 9, label: 'Certificat médical du BMH (Bureau Municipal d\'Hygiène)', alerte: '⚠️ Obligatoire pour C, D, E' },
  mg: { id: 9, label: 'Taratasin\'ny dokotera BMH (Birao Municipaly Hygiene)', alerte: '⚠️ Ilaina ho an\'ny C, D, E' },
}

const CATEGORIES = [
  { code: 'A', label: 'A — Moto', couleur: '#1A3C5E' },
  { code: 'B', label: 'B — Voiture', couleur: '#1A3C5E' },
  { code: 'C', label: 'C — Poids lourd', couleur: '#6d28d9' },
  { code: 'D', label: 'D — Transport en commun', couleur: '#6d28d9' },
  { code: 'E', label: 'E — Remorque', couleur: '#6d28d9' },
]

export default function Checklist({ navigate, langue, setLangue }) {
  const [categorie, setCategorie] = useState('B')
  const [cochees, setCochees] = useState({})

  const piecesBase = PIECES_BASE[langue]
  const pieces = ['C', 'D', 'E'].includes(categorie)
    ? [...piecesBase, PIECES_CDE[langue]]
    : piecesBase

  const toggle = (id) => setCochees(p => ({ ...p, [id]: !p[id] }))
  const nbCochees = pieces.filter(p => cochees[p.id]).length
  const pct = Math.round((nbCochees / pieces.length) * 100)

  const T = {
    fr: {
      retour: '← Retour',
      titre: 'Pièces à fournir',
      choixCat: 'Choisissez votre catégorie de permis',
      docsRequis: 'Documents requis — Catégorie',
      infoPratiques: '📋 Informations pratiques',
      dossierComplet: '✅ Dossier complet — Vous pouvez prendre rendez-vous !',
      preparees: 'pièces préparées',
      guichetLabel: 'Guichet dépôt',
      guichetVal: 'Porte 306 (1er permis) — Porte 307 (renouvellement)',
      horairesLabel: 'Horaires CIM',
      horairesVal: 'Lun–Ven, 8h00–16h00',
      delaiLabel: 'Délai estimé',
      delaiVal: '15 à 20 jours ouvrables',
      fraisLabel: 'Frais de dossier',
      fraisVal: '38 000 Ar (espèces uniquement)',
    },
    mg: {
      retour: '← Hiverina',
      titre: 'Antontan-taratasy ilaina',
      choixCat: 'Fidio ny sokajin\'ny permis-nao',
      docsRequis: 'Antontan-taratasy — Sokaji',
      infoPratiques: '📋 Fomba ampiasaina',
      dossierComplet: '✅ Dossier feno — Azonao atao ny manao rendez-vous !',
      preparees: 'antontan-taratasy voaomana',
      guichetLabel: 'Varavaran\'asa',
      guichetVal: 'Paotera 306 (voalohany) — Paotera 307 (fanavaozana)',
      horairesLabel: 'Fotoana CIM',
      horairesVal: 'Alatsinainy–Zoma, 8h00–16h00',
      delaiLabel: 'Faharetan\'ny fotoana',
      delaiVal: '15 hatramin\'ny 20 andro fiasana',
      fraisLabel: 'Sara dossier',
      fraisVal: '38 000 Ar (vola madinika ihany)',
    }
  }[langue]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ background: '#1A3C5E', color: 'white', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => navigate('accueil')} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.4)', color: 'white', borderRadius: 6, padding: '6px 12px', cursor: 'pointer' }}>{T.retour}</button>
          <img src="/logo.png" alt="PermisKo" style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'cover' }} />
          <span style={{ fontWeight: 700, fontSize: 18 }}>PermisKo — {T.titre}</span>
        </div>
        <LangueToggle langue={langue} setLangue={setLangue} />
      </header>

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '24px 16px', width: '100%' }}>
        {/* Sélecteur catégorie */}
        <div style={{ background: 'white', borderRadius: 12, padding: '20px 24px', marginBottom: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h3 style={{ color: '#1A3C5E', marginBottom: 14, fontWeight: 700 }}>{T.choixCat}</h3>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button key={cat.code} onClick={() => { setCategorie(cat.code); setCochees({}) }}
                style={{
                  padding: '8px 16px', borderRadius: 8, border: '2px solid',
                  borderColor: categorie === cat.code ? cat.couleur : '#e5e7eb',
                  background: categorie === cat.code ? cat.couleur : 'white',
                  color: categorie === cat.code ? 'white' : '#374151',
                  fontWeight: 700, cursor: 'pointer', fontSize: 14
                }}>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Barre de progression */}
        {nbCochees > 0 && (
          <div style={{ background: 'white', borderRadius: 12, padding: '16px 24px', marginBottom: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, fontWeight: 600, color: '#1A3C5E' }}>
              <span>{nbCochees} / {pieces.length} {T.preparees}</span>
              <span>{pct}%</span>
            </div>
            <div style={{ height: 10, background: '#e5e7eb', borderRadius: 10 }}>
              <div style={{ height: 10, width: `${pct}%`, background: pct === 100 ? '#2E7D32' : '#1A3C5E', borderRadius: 10, transition: 'width 0.3s' }} />
            </div>
            {pct === 100 && <p style={{ color: '#2E7D32', fontWeight: 700, marginTop: 10, fontSize: 14 }}>{T.dossierComplet}</p>}
          </div>
        )}

        {/* Liste des pièces */}
        <div style={{ background: 'white', borderRadius: 12, padding: '20px 24px', marginBottom: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h3 style={{ color: '#1A3C5E', marginBottom: 16, fontWeight: 700 }}>
            {T.docsRequis} {categorie}
          </h3>
          {pieces.map((piece, i) => (
            <div key={piece.id} onClick={() => toggle(piece.id)}
              style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 0', borderBottom: i < pieces.length - 1 ? '1px solid #f3f4f6' : 'none', cursor: 'pointer' }}>
              <div style={{
                width: 22, height: 22, borderRadius: 4, border: `2px solid ${cochees[piece.id] ? '#2E7D32' : '#d1d5db'}`,
                background: cochees[piece.id] ? '#2E7D32' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, marginTop: 2
              }}>
                {cochees[piece.id] && <span style={{ color: 'white', fontSize: 13, fontWeight: 700 }}>✓</span>}
              </div>
              <div>
                <p style={{ fontSize: 15, color: cochees[piece.id] ? '#9ca3af' : '#1f2937', textDecoration: cochees[piece.id] ? 'line-through' : 'none' }}>
                  {piece.label}
                </p>
                {piece.alerte && !cochees[piece.id] && (
                  <p style={{ fontSize: 12, color: '#E65100', marginTop: 3 }}>{piece.alerte}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Image documents */}
        <div style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
          <img src="/documents.png" alt="Documents requis" style={{ width: '100%', height: 180, objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
        </div>

        {/* Bloc informatif */}
        <div style={{ background: '#f0f4f8', borderRadius: 12, padding: '20px 24px' }}>
          <h4 style={{ color: '#1A3C5E', marginBottom: 12, fontWeight: 700 }}>{T.infoPratiques}</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            <InfoBlock icon="🚪" label={T.guichetLabel} val={T.guichetVal} />
            <InfoBlock icon="🕐" label={T.horairesLabel} val={T.horairesVal} />
            <InfoBlock icon="⏱️" label={T.delaiLabel} val={T.delaiVal} />
            <InfoBlock icon="💰" label={T.fraisLabel} val={T.fraisVal} />
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoBlock({ icon, label, val }) {
  return (
    <div style={{ background: 'white', borderRadius: 8, padding: '12px 14px' }}>
      <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>{icon} {label}</p>
      <p style={{ fontSize: 13, fontWeight: 600, color: '#1A3C5E' }}>{val}</p>
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
