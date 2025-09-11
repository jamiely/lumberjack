import './style.css'
import SceneManager from './components/SceneManager'
import { AudioProvider } from './audio'

function App() {
  return (
    <AudioProvider>
      <SceneManager />
    </AudioProvider>
  )
}

export default App