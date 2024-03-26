
import { Route } from 'react-router-dom';
import './App.css';

import Chatpage from "./pages/Chatpage"
import Homepage from "./pages/Homepage"

function App() {
  return (
    <div className="App">
      <Route path={'/'} component={Homepage} exact/>
      <Route path={'/chat'} component={Chatpage}/>
    </div>
  );
}

export default App;
