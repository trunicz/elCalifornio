import { ReactElement } from 'react'
import { Route, Switch } from 'wouter'
import { MainPage, SecondPage } from './pages'

function App(): ReactElement {
  return (
    <>
      <Switch>
        <Route path="/" component={MainPage} />
        <Route path="/second" component={SecondPage} />
      </Switch>
    </>
  )
}

export default App
