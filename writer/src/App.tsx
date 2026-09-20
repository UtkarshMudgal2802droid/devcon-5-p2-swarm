import { useState, useEffect } from 'react'
import { SwarmIdClient } from '@snaha/swarm-id'
import { Bee } from '@ethersphere/bee-js'
import { createSightingRecord } from './schema'

const GATEWAY_URL = 'https://api.gateway.ethswarm.org/';

const swarmId = new SwarmIdClient({ 
  iframeOrigin: 'https://swarm-id.snaha.net', 
  subsidisedGatewayUrl: GATEWAY_URL 
})

// We connect a Bee instance exclusively pointing to the subsidised gateway.
const bee = new Bee(GATEWAY_URL);

function App() {
  const [address, setAddress] = useState<string | null>(null)
  const [canUpload, setCanUpload] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string>('')
  const [reference, setReference] = useState<string | null>(null)

  // Form states
  const [species, setSpecies] = useState('')
  const [location, setLocation] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    // Attempt silent relogin if session exists
    swarmId.getCurrentAddress().then(addr => {
      if (addr) {
        setAddress(addr)
        checkCapability()
      }
    }).catch(console.error)
  }, [])

  const checkCapability = async () => {
    try {
      const allowed = await swarmId.canUpload()
      setCanUpload(allowed)
    } catch (e) {
      console.error(e)
    }
  }

  const handleLogin = async () => {
    try {
      const addr = await swarmId.login()
      setAddress(addr)
      await checkCapability()
    } catch (e: any) {
      setError(e.message)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setReference(null)
    
    // Capability Guarding (Test Case 1 & 7)
    if (!canUpload) {
      setError("Upload Failed: Your Swarm ID account lacks an active drive/postage stamp capability.")
      return
    }

    try {
      setStatus("Preparing record...")
      // Create self-describing record (Test Case 3)
      const record = createSightingRecord(species, location, notes)
      const dataString = JSON.stringify(record)

      setStatus("Fetching postage batch from Swarm ID...")
      const batchId = await swarmId.getPostageBatchId()
      
      setStatus("Uploading to subsidised gateway (no pinning)...")
      // Upload using Bee JS but strictly preventing pin/tag due to gateway constraints (Test Case 6)
      const uploadResult = await bee.data.upload(batchId, dataString)

      setReference(uploadResult.reference)
      setStatus("Upload successful!")
      
      // Clear form
      setSpecies('')
      setLocation('')
      setNotes('')
    } catch (err: any) {
      setError(err.message || 'An error occurred during upload')
      setStatus('')
    }
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Deccan Birders - Sighting Writer</h1>
      
      {!address ? (
        <button onClick={handleLogin} style={{ padding: '0.5rem 1rem', fontSize: '1.2rem' }}>
          Sign in with Swarm ID
        </button>
      ) : (
        <div>
          <p><strong>Account:</strong> {address}</p>
          <p>
            <strong>Upload Capability:</strong>{' '}
            {canUpload === null ? 'Checking...' : canUpload ? '✅ Authorized' : '❌ No active drive'}
          </p>

          <hr style={{ margin: '2rem 0' }} />
          
          <h2>Log a New Sighting</h2>
          {error && <div style={{ color: 'red', marginBottom: '1rem', padding: '1rem', border: '1px solid red' }}>{error}</div>}
          
          <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block' }}>Species Name</label>
              <input required value={species} onChange={e => setSpecies(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
            </div>
            <div>
              <label style={{ display: 'block' }}>Location</label>
              <input required value={location} onChange={e => setLocation(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
            </div>
            <div>
              <label style={{ display: 'block' }}>Notes (Optional)</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} style={{ width: '100%', padding: '0.5rem', minHeight: '80px' }} />
            </div>
            <button type="submit" disabled={!canUpload || !!status.includes('Uploading')} style={{ padding: '0.75rem', fontSize: '1.1rem' }}>
              Publish Record
            </button>
          </form>

          {status && <p style={{ color: '#0984e3', marginTop: '1.5rem', fontSize: '1.2rem' }}>{status}</p>}
          {reference && (
            <div style={{ marginTop: '1.5rem', padding: '1.5rem', backgroundColor: '#eef', borderRadius: '8px' }}>
              <h3 style={{ margin: '0 0 1rem 0' }}>✅ Record Published Successfully!</h3>
              <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Share this link with your group:</p>
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  readOnly 
                  value={`${window.location.origin}/reader/#?record=${reference}`} 
                  style={{ flex: 1, padding: '0.75rem', fontSize: '1.1rem', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/reader/#?record=${reference}`);
                    alert("Link copied to clipboard!");
                  }}
                  style={{ padding: '0.75rem 1.5rem', fontSize: '1.1rem', backgroundColor: '#0984e3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Copy Link
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App
