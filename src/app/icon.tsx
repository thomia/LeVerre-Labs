import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

/**
 * Favicon généré dynamiquement aux couleurs de la marque (monogramme
 * « LV » sur fond noir), cohérent avec l'image Open Graph. Next.js
 * l'expose automatiquement comme icône du site (onglet, favoris).
 */
export default function Icon() {
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
          borderRadius: 6,
          fontSize: 20,
          fontWeight: 800,
          letterSpacing: -1,
        }}
      >
        <span style={{ color: 'rgb(255,30,90)' }}>L</span>
        <span style={{ color: '#e5e7eb' }}>V</span>
      </div>
    ),
    { ...size }
  )
}
