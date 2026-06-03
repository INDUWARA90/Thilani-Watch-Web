import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [apiStatus, setApiStatus] = useState('Checking API...')
  const [error, setError] = useState('')

  useEffect(() => {
    const checkApi = async () => {
      try {
        const response = await fetch('/api/health')
        const data = await response.json()
        setApiStatus(data.message)
      } catch (err) {
        setError('Start the backend server to connect the API.')
        setApiStatus('API is offline')
      }
    }

    checkApi()
  }, [])

  return (
    <main className="app-shell">
      <section className="panel">
        <p className="eyebrow">MERN Starter</p>
        <h1>Thilani Watch Web</h1>
        <p className="intro">
          React, Vite, Express, and MongoDB are ready for your watch store
          project.
        </p>

        <div className="status-row">
          <span className={error ? 'status-dot offline' : 'status-dot'} />
          <div>
            <strong>{apiStatus}</strong>
            {error && <p>{error}</p>}
          </div>
        </div>
      </section>

      <section className="grid">
        <article>
          <h2>Frontend</h2>
          <p>Vite React app with an API proxy configured for local requests.</p>
          <code>cd frontend && npm run dev</code>
        </article>
        <article>
          <h2>Backend</h2>
          <p>Express server with MongoDB connection, routes, controllers, and a model.</p>
          <code>cd backend && npm run dev</code>
        </article>
        <article>
          <h2>API</h2>
          <p>Use the watch endpoints to build product listing and admin features.</p>
          <code>/api/watches</code>
        </article>
      </section>
    </main>
  )
}

export default App
