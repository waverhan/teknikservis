import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'
import 'dotenv/config'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log('🌱 Yerleştirme başlatılıyor...')

    const testEmail = 'hizli@test.com'
    const hashedPassword = await bcrypt.hash('123456', 10)

    // Önce varsa temizleyelim (Opsiyonel)
    const existing = await prisma.business.findUnique({
        where: { email: testEmail }
    })

    if (existing) {
        console.log('ℹ️ Test hesabı zaten mevcut.')
    } else {
        const business = await prisma.business.create({
            data: {
                email: testEmail,
                hashedPassword: hashedPassword,
                name: 'Hızlı Teknik Servis',
                slug: 'hizli-teknik',
                phone: '05554443322',
                address: 'Test Mah. Örnek Sok. No:1 İstanbul',
                isPublic: true,
                primaryColor: '#3B82F6',
                publicDescription: 'Hızlı ve güvenilir teknik servis çözümleri.'
            }
        })
        console.log(`✅ Test hesabı oluşturuldu: ${business.name} (${business.slug})`)
    }

    console.log('🌱 Yerleştirme tamamlandı.')
}

main()
    .catch((e) => {
        console.error('❌ Hata oluştu:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
        await pool.end()
    })
