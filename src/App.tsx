import viteLogo from '/vite.svg'
import typescriptLogo from './typescript.svg'
import { Counter } from './Counter'
import './style.css'

function App() {
  return (
    <div>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://www.typescriptlang.org/" target="_blank">
          <img src={typescriptLogo} className="logo vanilla" alt="TypeScript logo" />
        </a>
      </div>
      <h1>Vite + TypeScript + React</h1>
      <div className="card">
        <Counter />
      </div>
      <p className="read-the-docs">
        Click on the Vite and TypeScript logos to learn more
      </p>
    </div>
  )
}

export default App