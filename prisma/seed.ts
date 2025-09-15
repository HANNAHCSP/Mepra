import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const product1 = await prisma.product.create({
    data: {
      name: 'Classic White T-Shirt',
      description: 'A timeless classic, perfect for any occasion.',
      handle: 'classic-white-t-shirt',
      imageUrl: '/images/t-shirt-white.jpeg',
      variants: {
        create: [
          { sku: 'CWT-S', price: 2500, stock: 100, attributes: { size: 'S' } },
          { sku: 'CWT-M', price: 2500, stock: 150, attributes: { size: 'M' } },
          { sku: 'CWT-L', price: 2500, stock: 120, attributes: { size: 'L' } },
        ],
      },
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Denim Jeans',
      description: 'Comfortable and stylish denim jeans.',
      handle: 'denim-jeans',
      imageUrl: '/images/denim-jeans.jpeg',
      variants: {
        create: [
          { sku: 'DJ-30', price: 7500, stock: 80, attributes: { size: '30' } },
          { sku: 'DJ-32', price: 7500, stock: 100, attributes: { size: '32' } },
          { sku: 'DJ-34', price: 7500, stock: 90, attributes: { size: '34' } },
        ],
      },
    },
  });

  console.log({ product1, product2 })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })