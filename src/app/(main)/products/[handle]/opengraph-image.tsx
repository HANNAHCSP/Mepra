// src/app/(main)/products/[handle]/opengraph-image.tsx
import { ImageResponse } from 'next/og';
import { prisma } from '@/lib/prisma';

export const runtime = 'edge';
export const alt = 'Mepra Product';
export const size = {
  width: 1200,
  height: 630,
};

// You can dynamically set the content type based on the source image
export const contentType = 'image/png'; // or 'image/jpeg'

// Helper function to get image format from URL
function getImageFormat(url: string | null): string {
  if (!url) return 'png';
  
  const extension = url.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'jpeg';
    case 'png':
      return 'png';
    case 'webp':
      return 'webp';
    case 'gif':
      return 'gif';
    default:
      return 'png'; // fallback
  }
}

// Helper function to validate image URL and format
async function validateImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentType = response.headers.get('content-type');
    
    return contentType?.startsWith('image/') ?? false;
  } catch {
    return false;
  }
}

export default async function Image({ params }: { params: { handle: string } }) {
  const product = await prisma.product.findUnique({
    where: { handle: params.handle },
    select: {
      name: true,
      imageUrl: true,
      variants: {
        orderBy: { price: 'asc' },
        take: 1,
        select: { price: true },
      },
    },
  });

  if (!product) {
    return new Response('Product not found', { status: 404 });
  }

  const price = product.variants[0] ? `$${(product.variants[0].price / 100).toFixed(2)}` : '';
  
  // Validate image URL if it exists
  let imageUrl = product.imageUrl;
  let showImage = false;
  
  if (imageUrl) {
    try {
      // Convert relative URLs to absolute if needed
      if (imageUrl.startsWith('/')) {
        imageUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com'}${imageUrl}`;
      }
      
      // Optional: Validate the image (be careful with this in production as it adds latency)
      // showImage = await validateImageUrl(imageUrl);
      showImage = true; // Skip validation for better performance
    } catch {
      showImage = false;
    }
  }

  // Determine output format based on source image or preference
  const imageFormat = getImageFormat(product.imageUrl);
  const outputContentType = imageFormat === 'jpeg' ? 'image/jpeg' : 'image/png';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          backgroundColor: '#f9fafb',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Image Section */}
        <div 
          style={{ 
            display: 'flex', 
            width: showImage ? '50%' : '0%', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: showImage ? '40px' : '0px',
            transition: 'all 0.3s ease',
          }}
        >
          {showImage && imageUrl && (
            <img
              src={imageUrl}
              alt={product.name}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover', 
                borderRadius: '24px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              }}
            />
          )}
        </div>
        
        {/* Content Section */}
        <div
          style={{
            display: 'flex',
            width: showImage ? '50%' : '100%',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '48px',
            color: '#111827',
            textAlign: showImage ? 'left' : 'center',
          }}
        >
          <div
            style={{
              fontSize: 24,
              fontWeight: 500,
              color: '#6b7280',
              letterSpacing: '0.1em',
              marginBottom: '24px',
            }}
          >
            MEPRA | THE LUXURY ART
          </div>
          
          <h1 
            style={{ 
              fontSize: showImage ? 52 : 72, 
              fontWeight: 700, 
              lineHeight: 1.1, 
              margin: '0 0 24px 0',
              color: '#111827',
              wordWrap: 'break-word',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: showImage ? 3 : 4,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {product.name}
          </h1>
          
          {price && (
            <div 
              style={{ 
                fontSize: showImage ? 48 : 56, 
                fontWeight: 700, 
                color: '#059669',
                textShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              }}
            >
              {price}
            </div>
          )}

          {/* Fallback icon when no image */}
          {!showImage && (
            <div
              style={{
                width: '120px',
                height: '120px',
                backgroundColor: '#e5e7eb',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '32px',
                fontSize: '48px',
              }}
            >
              🏺
            </div>
          )}
        </div>
      </div>
    ),
    {
      ...size,
      // You could dynamically set this based on the source image
      headers: {
        'Content-Type': outputContentType,
      },
    }
  );
}