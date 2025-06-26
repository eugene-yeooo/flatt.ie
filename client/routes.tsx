import { createRoutesFromElements, Route } from 'react-router-dom'
import App from './components/App.tsx'
import Flatties from './components/Flatties.tsx'

export default createRoutesFromElements(
  <>
<Route index element={<App />} />
<Route path="/flatties" element={<Flatties />} />
</>
)