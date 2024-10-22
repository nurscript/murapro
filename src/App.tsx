import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './layout'
import {HomePage, CashPage, PaymentPage} from './pages'


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={ <Layout/> } >
            <Route index element={ <HomePage/> } />
            <Route path='/cash' element={ <CashPage/> } />
            <Route path='/payment' element={ <PaymentPage/> } />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
