import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const dbUrl = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Starting data migration...');

    const businesses = await prisma.business.findMany();
    console.log(`Found ${businesses.length} businesses.`);

    for (const biz of businesses) {
        // Check if admin user already exists for this business
        const existingUser = await prisma.user.findFirst({
            where: { email: biz.email }
        });

        if (!existingUser) {
            console.log(`Migrating business: ${biz.name} (${biz.email})`);
            await prisma.user.create({
                data: {
                    email: biz.email,
                    hashedPassword: (biz as any).hashedPassword,
                    name: biz.name,
                    role: 'ADMIN',
                    businessId: biz.id,
                }
            });
        } else {
            console.log(`Admin user already exists for business: ${biz.name}`);
        }
    }

    console.log('Migration completed successfully.');
}

main()
    .catch((e) => {
        console.error('Migration failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
