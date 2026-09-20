import { useState } from 'react'


const GATEWAY_URL = 'https://api.gateway.ethswarm.org'

function App() {
  const [reference, setReference] = useState('')
  const [record, setRecord] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setRecord(null)
    setLoading(true)

    try {
      // Test Case 5: Must be read back from /bytes
      const res = await fetch(`${GATEWAY_URL}/bytes/${reference}`)
      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`)
      }
      
      const data = await res.json()
      
      // Test Case 3: Verify format identifier and version natively without shared code
      if (!data || data._format !== 'deccan-birders-sighting' || data._version !== '1.0.0') {
        throw new Error("The fetched data is not a valid Deccan Birders Sighting Record (invalid format or version).")
      }
      
      setRecord(data)
    } catch (err: any) {
      setError(err.message || 'Unknown error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Deccan Birders - Independent Reader</h1>
      <p>Enter the Swarm reference of a Sighting Record to view it.</p>
      
      <form onSubmit={handleFetch} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <input 
          required 
          value={reference} 
          onChange={e => setReference(e.target.value.trim())} 
          placeholder="Swarm Reference (Hash)" 
          style={{ flex: 1, padding: '0.5rem' }} 
        />
        <button type="submit" disabled={loading} style={{ padding: '0.5rem 1rem' }}>
          {loading ? 'Fetching...' : 'Read Record'}
        </button>
      </form>

      {error && <div style={{ color: 'red', padding: '1rem', border: '1px solid red' }}>{error}</div>}

      {record && (
        <div style={{ border: '1px solid #ccc', padding: '1.5rem', borderRadius: '8px', backgroundColor: '#fafafa' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#666' }}>Format: {record._format} v{record._version}</span>
            <span style={{ fontSize: '0.8rem', color: '#666' }}>Date: {new Date(record.date).toLocaleString()}</span>
          </div>
          
          <h2 style={{ marginTop: 0 }}>{record.species}</h2>
          <p><strong>Location:</strong> {record.location}</p>
          
          {record.notes && (
            <div style={{ marginTop: '1rem' }}>
              <strong>Notes:</strong>
              <p style={{ marginTop: '0.25rem', fontStyle: 'italic' }}>{record.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App
