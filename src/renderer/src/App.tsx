import { ReactElement } from 'react'
import { Route, Switch } from 'wouter'
import { MainPage, SecondPage, UserPage } from './pages'

function App(): ReactElement {
  return (
    <>
      <Switch>
        <Route path="/" component={MainPage} />
        <Route path="/second" component={SecondPage} />
        <Route path="/users" component={UserPage} />
      </Switch>
    </>
  )
}

export default App
