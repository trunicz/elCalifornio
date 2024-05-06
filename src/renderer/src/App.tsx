import { ReactElement, useEffect } from 'react'
import { Redirect, Route, Switch } from 'wouter'
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
  CreateEditUserPage,
  AuthPage
} from './pages'
import { useAuthStore } from './stores/useAuth'
import { Loading } from './components/Loading'

function App(): ReactElement {
  const { user, isLoading, initializeUser } = useAuthStore()
  useEffect(() => {
    initializeUser()
  }, [])

  if (isLoading) {
    return <Loading />
  }
  return (
    <>
      <Switch>
        <Route path="/login">{!user ? <AuthPage /> : <Redirect to="/" />}</Route>
        {user ? (
          <>
            <Route path="/" component={MainPage} />
            <Route path="/users" component={UsersPage} />
            <Route path="/users/create" component={CreateEditUserPage} />
            <Route path="/users/:id" component={CreateEditUserPage} />
            <Route path="/clients" component={ClientsPage} />
            <Route path="/inventory" component={InventoryPage} />
            <Route path="/rent" component={RentPage} />
            <Route path="/contracts" component={ContractsPage} />
            <Route path="/bills" component={BillsPage} />
            <Route path="/audit" component={AuditPage} />
            <Route path="*" component={ErrorPage} />
          </>
        ) : (
          <Redirect to="/login" />
        )}
      </Switch>
    </>
  )
}

export default App
