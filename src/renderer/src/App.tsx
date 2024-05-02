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
  UsersPage,
  CreateUserPage,
  AuthPage
} from './pages'
import { ProtectedRoute } from './components'

function App(): ReactElement {
  return (
    <>
      <Switch>
        <Route path="/login" component={AuthPage} />
        <ProtectedRoute>
          <Route path="/" component={MainPage} />
          <Route path="/users" component={UsersPage} />
          <Route path="/users/create" component={CreateUserPage} />
          <Route path="/clients" component={ClientsPage} />
          <Route path="/inventory" component={InventoryPage} />
          <Route path="/rent" component={RentPage} />
          <Route path="/contracts" component={ContractsPage} />
          <Route path="/bills" component={BillsPage} />
          <Route path="/audit" component={AuditPage} />
          <Route path="*" component={ErrorPage} />
        </ProtectedRoute>
      </Switch>
    </>
  )
}

export default App
