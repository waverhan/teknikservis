import prisma from './src/lib/prisma';

async function testConnection() {
    try {
        console.log('🔄 Veritabanı bağlantısı deneniyor...');
        const count = await prisma.business.count();
        console.log('✅ Bağlantı başarılı! Toplam işletme sayısı:', count);
    } catch (error: any) {
        console.error('❌ Bağlantı HATASI:');
        console.error('Mesaj:', error.message);
        console.error('Kod:', error.code);
        if (error.meta) console.error('Meta:', error.meta);
    } finally {
        process.exit();
    }
}

testConnection();
