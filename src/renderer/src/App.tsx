import { ReactElement, useEffect } from 'react'
import { Redirect, Route, Switch, Router } from 'wouter'
import { useHashLocation } from 'wouter/use-hash-location'
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
  CreateEditUserPage
} from '@renderer/pages'
import { AuthPage } from '@renderer/pages/AuthPage'
import { useAuthStore } from '@renderer/stores/useAuth'
import { Loading } from '@renderer/components/Loading'
import { CreateEditClientPage } from '@renderer/pages/Clients/CreateEditClientPage'
import { CreateEditInventoryPage } from '@renderer/pages/Inventory/CreateEditInventoryPage'
import { CreateEditRentPage } from '@renderer/pages/Rent/CreateEditRentPage'
import { RentHistory } from '@renderer/pages/Rent/RentHistory'

function App(): ReactElement {
  const { user, isLoading, initializeUser } = useAuthStore()
  useEffect(() => {
    initializeUser()
  }, [])

  if (isLoading) {
    return <Loading />
  }
  return (
    <Router hook={useHashLocation}>
      <Switch>
        <Route path="/login">{!user ? <AuthPage /> : <Redirect to="/" />}</Route>
        {user ? (
          <>
            <Route path="/" component={MainPage} />
            <Route path="/users" component={UsersPage} />
            <Route path="/users/create" component={CreateEditUserPage} />
            <Route path="/users/:id" component={CreateEditUserPage} />
            <Route path="/clients" component={ClientsPage} />
            <Route path="/clients/create" component={CreateEditClientPage} />
            <Route path="/clients/:id" component={CreateEditClientPage} />
            <Route path="/clients/create/:enable" component={CreateEditClientPage} />
            <Route path="/inventory" component={InventoryPage} />
            <Route path="/inventory/add" component={CreateEditInventoryPage} />
            <Route path="/inventory/:id" component={CreateEditInventoryPage} />
            <Route path="/rent" component={RentPage} />
            <Route path="/rent/:search" component={RentPage} />
            <Route path="/rents/create" component={CreateEditRentPage} />
            <Route path="/rent/edit/:id" component={CreateEditRentPage} />
            <Route path="/rentals/history" component={RentHistory} />
            <Route path="/contracts" component={ContractsPage} />
            <Route path="/bills" component={BillsPage} />
            <Route path="/audit" component={AuditPage} />
            <Route path="*" component={ErrorPage} />
          </>
        ) : (
          <Redirect to="/login" />
        )}
      </Switch>
    </Router>
  )
}

export default App
