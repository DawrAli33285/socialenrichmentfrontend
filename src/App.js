import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Uploadfile from './Uploadfile';
function App() {
  return (
    <Router>
<Routes>
<Route path='/' element={<Uploadfile/>}/>

</Routes>

    </Router>
  );
}

export default App;
