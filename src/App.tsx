import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Homepage from './pages/Homepage';

function App() {

  return (
    <Router>
      <div className="bg-coral min-h-[100vh] min-w-[100vw]">
        <Homepage />
      </div>
    </Router>
  )
}

export default App
