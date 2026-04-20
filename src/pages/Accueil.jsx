import { useState } from 'react'

export default function Accueil({ navigate, langue, setLangue }) {
  const [id, setId] = useState('')
  const [idErreur, setIdErreur] = useState(false)
  const [contactsModal, setContactsModal] = useState(false)

  const t = {
    fr: {
      titre: 'Suivez votre dossier de permis de conduire en temps réel',
      sousTitre: 'Centre Immatriculateur de Madagascar — CIM Ambohidahy',
      placeholder: 'Entrez votre identifiant de dossier (ex: A7K29)',
      bouton: 'Suivre mon dossier',
      erreurId: 'Veuillez entrer un identifiant de dossier',
      pieces: 'Pièces à fournir',
      piecesDesc: 'Consultez la liste des documents selon votre catégorie',
      resultats: 'Résultats d\'examens',
      resultatsDesc: 'Vérifiez vos résultats théoriques et pratiques',
      contacts: 'Contacts & localisation CIM',
      contactsDesc: 'Horaires, adresse et numéros utiles',
      agentBtn: 'Espace agent',
      footerAdresse: 'CIM Ambohidahy, Antananarivo — Lun–Ven 8h00–16h00',
      footerTel: 'Tél : +261 20 22 XXX XX',
      modalTitre: 'Contacts & localisation',
      adresse: 'Adresse',
      horaires: 'Horaires',
      telephone: 'Téléphone',
      guichets: 'Guichets',
      acces: 'Accès transport',
      fermer: 'Fermer',
    },
    mg: {
      titre: 'Araho ny dossier-nao momba ny permis fandehanan-tsary amin\'ny fotoana izy izy',
      sousTitre: 'Foibe Fanamarinana — CIM Ambohidahy',
      placeholder: 'Ampidiro ny laharanao (ohatra: A7K29)',
      bouton: 'Araho ny dossier-ko',
      erreurId: 'Ampidiro ny laharan\'ny dossier-nao',
      pieces: 'Antontan-taratasy ilaina',
      piecesDesc: 'Jereo ny lisitry ny taratasy araka ny sokajinao',
      resultats: 'Vokatra fanadinana',
      resultatsDesc: 'Hamarino ny vokatra teôrika sy pratika',
      contacts: 'Fifandraisana sy toerana',
      contactsDesc: 'Fotoana, adiresy ary nomerao ilaina',
      agentBtn: 'Hiditra ho mpiasa',
      footerAdresse: 'CIM Ambohidahy, Antananarivo — Alatsinainy–Zoma 8h00–16h00',
      footerTel: 'Tel : +261 20 22 XXX XX',
      modalTitre: 'Fifandraisana sy toerana',
      adresse: 'Adiresy',
      horaires: 'Fotoana fiasana',
      telephone: 'Laharana',
      guichets: 'Varavaran\'asa',
      acces: 'Fitaterana',
      fermer: 'Hidina',
    }
  }[langue]

  const handleSuivi = () => {
    if (id.trim()) {
      setIdErreur(false)
      navigate('suivi', { dossierId: id.trim().toUpperCase() })
    } else {
      setIdErreur(true)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ background: '#1A3C5E', color: 'white', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/logo.png" alt="PermisKo" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
          <span style={{ fontWeight: 700, fontSize: 20, letterSpacing: 1 }}>PermisKo</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={() => navigate('login-agent')}
            style={{ padding: '5px 14px', background: 'transparent', color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.35)', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}
          >
            🔐 {t.agentBtn}
          </button>
          <LangueToggle langue={langue} setLangue={setLangue} />
        </div>
      </header>

      {/* Hero — split layout */}
      <div style={{ background: 'linear-gradient(135deg, #1A3C5E 0%, #2a5a8e 100%)', color: 'white', padding: '40px 32px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 40, flexWrap: 'wrap', justifyContent: 'center' }}>

          {/* Texte + recherche */}
          <div style={{ flex: '1 1 340px', textAlign: 'left' }}>
            <h1 style={{ fontSize: 'clamp(20px, 3.5vw, 30px)', fontWeight: 700, lineHeight: 1.35, marginBottom: 12 }}>
              {t.titre}
            </h1>
            <p style={{ opacity: 0.85, marginBottom: 28, fontSize: 15 }}>{t.sousTitre}</p>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <input
                value={id}
                onChange={e => { setId(e.target.value); setIdErreur(false) }}
                onKeyDown={e => e.key === 'Enter' && handleSuivi()}
                placeholder={t.placeholder}
                style={{ flex: 1, minWidth: 200, padding: '13px 16px', borderRadius: 8, border: idErreur ? '2px solid #fca5a5' : '2px solid transparent', fontSize: 15, outline: 'none', color: '#1f2937', background: 'white' }}
              />
              <button
                onClick={handleSuivi}
                style={{ padding: '13px 22px', background: '#2E7D32', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                {t.bouton}
              </button>
            </div>
            {idErreur && (
              <p style={{ color: '#fca5a5', fontSize: 13, marginTop: 8 }}>⚠️ {t.erreurId}</p>
            )}
          </div>

          {/* Photo dans cadre */}
          <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 220, height: 260, borderRadius: 24,
              overflow: 'hidden',
              border: '3px solid rgba(255,255,255,0.35)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
            }}>
              <img src="/hero.png" alt="Agent CIM" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', imageOrientation: 'from-image' }} />
            </div>
            <span style={{ fontSize: 12, opacity: 0.7, letterSpacing: 0.5 }}>CIM Ambohidahy</span>
          </div>

        </div>
      </div>

      {/* 3 Cards navigation */}
      <div style={{ padding: '32px 24px', maxWidth: 900, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          <Card icon="📋" title={t.pieces} desc={t.piecesDesc} color="#1A3C5E" onClick={() => navigate('checklist')} />
          <Card icon="📅" title={t.resultats} desc={t.resultatsDesc} color="#2E7D32" onClick={() => navigate('suivi', { dossierId: 'A7K29' })} />
          <Card icon="📍" title={t.contacts} desc={t.contactsDesc} color="#E65100" onClick={() => setContactsModal(true)} />
        </div>

      </div>

      {/* Footer */}
      <footer style={{ marginTop: 'auto', background: '#1A3C5E', color: 'white', padding: '20px 24px', textAlign: 'center', fontSize: 14 }}>
        <p style={{ opacity: 0.9 }}>📍 {t.footerAdresse}</p>
        <p style={{ opacity: 0.7, marginTop: 4 }}>{t.footerTel} — Ministère de l'Intérieur et de la Décentralisation</p>
      </footer>

      {/* Modal Contacts CIM */}
      {contactsModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 100 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 28, width: '100%', maxWidth: 440 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ color: '#E65100', fontWeight: 700, fontSize: 18 }}>📍 {t.modalTitre}</h3>
              <button onClick={() => setContactsModal(false)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#6b7280', lineHeight: 1 }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <ContactInfo icon="🏛️" label={t.adresse} val="CIM Ambohidahy, Antananarivo 101" />
              <ContactInfo icon="🕐" label={t.horaires} val={langue === 'fr' ? 'Lundi–Vendredi, 8h00–16h00' : 'Alatsinainy–Zoma, 8h00–16h00'} />
              <ContactInfo icon="📞" label={t.telephone} val="+261 20 22 XXX XX" />
              <ContactInfo icon="🚪" label={t.guichets} val={langue === 'fr' ? 'Guichet 306 (1er permis)  •  Guichet 307 (renouvellement)' : 'Varavaran\'asa 306 (voalohany)  •  307 (fanavaozana)'} />
              <ContactInfo icon="🚌" label={t.acces} val={langue === 'fr' ? 'Bus 135 depuis Analakely — descendre Ambohidahy' : 'Bus 135 avy Analakely — midina Ambohidahy'} />
            </div>
            <button onClick={() => setContactsModal(false)} style={{ width: '100%', marginTop: 20, padding: '12px', background: '#1A3C5E', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 15 }}>
              {t.fermer}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function Card({ icon, title, desc, color, onClick }) {
  return (
    <button onClick={onClick} style={{ background: 'white', border: `2px solid ${color}20`, borderRadius: 12, padding: '24px 20px', textAlign: 'left', cursor: 'pointer', transition: 'box-shadow 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', width: '100%' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = `0 4px 20px ${color}30`}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'}
    >
      <div style={{ fontSize: 32, marginBottom: 12 }}>{icon}</div>
      <h3 style={{ color, fontWeight: 700, fontSize: 17, marginBottom: 8 }}>{title}</h3>
      <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.4 }}>{desc}</p>
    </button>
  )
}

function ContactInfo({ icon, label, val }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <span style={{ fontSize: 20, flexShrink: 0 }}>{icon}</span>
      <div>
        <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 2 }}>{label}</p>
        <p style={{ fontSize: 14, fontWeight: 600, color: '#1f2937' }}>{val}</p>
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
