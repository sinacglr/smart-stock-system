import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.order.deleteMany()
  await prisma.priceHistory.deleteMany()
  await prisma.product.deleteMany()
  await prisma.customer.deleteMany()


  const customers = [
    { name: 'Ahmet Yılmaz', email: 'ahmet@test.com' },
    { name: 'Ayşe Demir', email: 'ayse@test.com' },
    { name: 'Mehmet Öztürk', email: 'mehmet@test.com' },
    { name: 'Eren Dönmez', email: 'eren@test.com' },
    { name: 'Hüseyin Türkmen', email: 'huseyin@test.com' },
    { name: 'Berna Yıldırım', email: 'berna@test.com' },
    { name: 'Pelin Sönmez', email: 'pelin@test.com' },
    { name: 'Cansu Derman', email: 'cansu@test.com' },
    { name: 'Berk Polat', email: 'berk@test.com' },
  ]

  for (const c of customers) {
    await prisma.customer.create({ data: c })
  }

  const products = [
    { name: 'NVIDIA RTX 4090', price: 65000, stock: 5, cat: 'Video card' },
    { name: 'Intel i9 14900K', price: 22000, stock: 15, cat: 'Processor' },
    { name: 'Samsung 990 Pro 1TB', price: 4500, stock: 40, cat: 'Storage' },
    { name: 'Logitech G Pro X', price: 3500, stock: 60, cat: 'Equipment' },
    { name: 'Asus 27" Monitor', price: 9000, stock: 8, cat: 'Monitor' },
  ]

  for (const p of products) {
    const product = await prisma.product.create({
      data: {
        name: p.name,
        basePrice: p.price,
        currentPrice: p.price,
        stock: p.stock,
        category: p.cat,
        description: p.cat
      }
    })

    for (let i = 0; i < 6; i++) {
        const randomChange = (Math.random() * 500) - 250
        const fakePrice = p.price + randomChange
        
        await prisma.priceHistory.create({
            data: {
                productId: product.id,
                price: fakePrice,
                createdAt: new Date(Date.now() - (10000000 * (6 - i))) 
            }
        })
    }
  }

}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })