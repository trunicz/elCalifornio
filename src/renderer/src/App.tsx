import { ReactElement } from 'react'
import { Route, Router, Switch } from 'wouter'
import {
  AuditPage,
  BillsPage,
  ClientsPage,
  ContractsPage,
  ErrorPage,
  InventoryPage,
  MainPage,
  RentPage,
  UsersPage,
  CreateUserPage
} from './pages'
import { ProtectedRoute } from './components'

function App(): ReactElement {
  return (
    <>
      <Switch>
        <ProtectedRoute>
          <Router base="/app">
            <Route path="/" component={MainPage} />
            <Route path="/users" component={UsersPage}>
              <Route path="/create" component={CreateUserPage} />
              <Route path="/edit" component={CreateUserPage} />
              <Route path="/delete" component={CreateUserPage} />
            </Route>
            <Route path="/clients" component={ClientsPage} />
            <Route path="/inventory" component={InventoryPage} />
            <Route path="/rent" component={RentPage} />
            <Route path="/contracts" component={ContractsPage} />
            <Route path="/bills" component={BillsPage} />
            <Route path="/audit" component={AuditPage} />
          </Router>
          <Route path="*" component={ErrorPage} />
        </ProtectedRoute>
      </Switch>
    </>
  )
}

export default App
