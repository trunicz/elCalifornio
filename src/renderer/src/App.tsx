import { ReactElement } from 'react'
import { Route, Switch } from 'wouter'
import {
  AuditPage,
  BillsPage,
  ClientsPage,
  ContractsPage,
  ErrorPage,
  InventoryPage,
  MainPage,
  RentPage,
  SecondPage,
  UsersPage
} from './pages'

function App(): ReactElement {
  return (
    <>
      <Switch>
        <Route path="/" component={MainPage} />
        <Route path="/second" component={SecondPage} />
        <Route path="/users" component={UsersPage} />
        <Route path="/clients" component={ClientsPage} />
        <Route path="/inventory" component={InventoryPage} />
        <Route path="/rent" component={RentPage} />
        <Route path="/contracts" component={ContractsPage} />
        <Route path="/bills" component={BillsPage} />
        <Route path="/audit" component={AuditPage} />
        <Route path="*" component={ErrorPage} />
      </Switch>
    </>
  )
}

export default App
