import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './app.css'

function App() {
  return (
    <div className="App m-0 p-0">
      <Navbar />
      <div className="container-fluid m-0 p-0 justify-content-center">
          <Outlet />
      </div>
    </div>
  )
}

export default App
