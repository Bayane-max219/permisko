import { useState } from 'react'
import Accueil from './pages/Accueil'
import SuiviDossier from './pages/SuiviDossier'
import Checklist from './pages/Checklist'
import LoginAgent from './pages/LoginAgent'
import KanbanAgent from './pages/KanbanAgent'

export default function App() {
  const [page, setPage] = useState('accueil')
  const [dossierId, setDossierId] = useState(null)
  const [agentConnecte, setAgentConnecte] = useState(null)
  const [langue, setLangue] = useState('fr')

  const navigate = (p, data) => {
    setPage(p)
    if (data?.dossierId) setDossierId(data.dossierId)
    if (data?.agent) setAgentConnecte(data.agent)
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      {page === 'accueil' && <Accueil navigate={navigate} langue={langue} setLangue={setLangue} />}
      {page === 'suivi' && <SuiviDossier dossierId={dossierId} navigate={navigate} langue={langue} setLangue={setLangue} />}
      {page === 'checklist' && <Checklist navigate={navigate} langue={langue} setLangue={setLangue} />}
      {page === 'login-agent' && <LoginAgent navigate={navigate} langue={langue} setLangue={setLangue} />}
      {page === 'kanban' && <KanbanAgent agent={agentConnecte} navigate={navigate} />}
    </div>
  )
}
