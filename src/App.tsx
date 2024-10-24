import { HashRouter, Routes, Route } from 'react-router-dom'
import Layout from './layout'
import {HomePage, CashPage, PaymentPage} from './pages'


function App() {

  return (
    <>
      <HashRouter>
        <Routes>
          <Route path='/' element={ <Layout/> } >
            <Route index element={ <HomePage/> } />
            <Route path='/cash' element={ <CashPage/> } />
            <Route path='/payment' element={ <PaymentPage/> } />
          </Route>
        </Routes>
      </HashRouter>
    </>
  )
}

export default App
