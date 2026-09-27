import SecurityCard from './SecurityCard.jsx'
import WhatHappensNext from './WhatHappensNext.jsx'
import HelpCard from './HelpCard.jsx'
import CollaborationCard from './CollaborationCard.jsx'

export default function RightSidebar() {
  return (
    <aside className="side">
      <SecurityCard />
      <WhatHappensNext />
      <HelpCard />
      <CollaborationCard />
    </aside>
  )
}
