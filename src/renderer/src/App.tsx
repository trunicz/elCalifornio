import { ReactElement } from 'react'
import { AppLayout, Button } from './components'

function App(): ReactElement {
  return (
    <AppLayout>
      <AppLayout.Header>
        <h1 className="text-4xl">App Name</h1>
      </AppLayout.Header>
      <AppLayout.Menu>
        <Button>fs</Button>
      </AppLayout.Menu>
    </AppLayout>
  )
}

export default App
