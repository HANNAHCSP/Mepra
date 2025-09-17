// src/app/opengraph-image.tsx
import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const alt = 'Mepra | The Luxury Art';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

// Image generation
export default async function Image() {
  // You can customize this with fonts, logos, etc.
  // For now, a clean and simple design is effective.
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 84,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: '"Inter", sans-serif',
          color: 'black',
          border: '24px solid black'
        }}
      >
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            letterSpacing: '-0.05em',
        }}>
            
            <p style={{ margin: '0 0 20px 0', fontSize: 120, fontWeight: 700 }}>MEPRAEG</p>
            <p style={{ margin: 0, fontSize: 40, fontWeight: 400 }}>Official Store | Since 1947</p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}