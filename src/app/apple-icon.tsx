import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

/**
 * Icône « Apple touch » (écran d'accueil iOS / raccourcis). Même
 * identité visuelle que le favicon, dimensionnée pour les grands écrans.
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000000',
          backgroundImage:
            'radial-gradient(circle at 50% 40%, rgba(255,30,90,0.25) 0%, rgba(0,0,0,0) 65%)',
          fontSize: 96,
          fontWeight: 800,
          letterSpacing: -4,
        }}
      >
        <span style={{ color: 'rgb(255,30,90)' }}>L</span>
        <span style={{ color: '#e5e7eb' }}>V</span>
      </div>
    ),
    { ...size }
  )
}
