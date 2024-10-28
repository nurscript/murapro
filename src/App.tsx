import { HashRouter, Routes, Route } from 'react-router-dom'
import Layout from './layout'
import { HomePage, CashPage, PaymentPage } from './pages'
import ProtectedRoute from './protected-route'
import { AuthProvider } from './AuthProvider'


function App() {

  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path='/' element={<Layout />} >
            <Route index element={<HomePage />} />
            <Route path='/cash' element={
              <ProtectedRoute>
                <CashPage />
              </ProtectedRoute>
            } />
            <Route path='/payment' element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </HashRouter>
    </AuthProvider>
  )
}

export default App
