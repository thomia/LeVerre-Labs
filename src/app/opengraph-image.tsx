import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'LeVerre Labs - Prévention des TMS en entreprise'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Image Open Graph par défaut, réutilisée par toutes les pages qui ne
 * définissent pas leur propre `opengraph-image`. Sert aux partages
 * (LinkedIn, etc.) et améliore indirectement le référencement.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000000',
          backgroundImage:
            'radial-gradient(circle at 50% 35%, rgba(255,30,90,0.25) 0%, rgba(0,0,0,0) 60%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 108,
            fontWeight: 800,
            letterSpacing: -2,
          }}
        >
          <span style={{ color: 'rgb(255,30,90)' }}>LeVerre</span>
          <span style={{ color: '#9ca3af', marginLeft: 24 }}>Labs</span>
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 34,
            fontWeight: 500,
            color: '#e5e7eb',
          }}
        >
          Prévention des TMS en entreprise
        </div>
      </div>
    ),
    { ...size }
  )
}
