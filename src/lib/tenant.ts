import prisma from './prisma';

export async function getTenantByHost(host: string) {
    const rootDomain = process.env.ROOT_DOMAIN || 'localhost:3000';

    // 1. Try resolving by custom domain exactly
    let tenant = await prisma.business.findUnique({
        where: {
            customDomain: host,
        },
    });

    if (tenant) return tenant;

    // 2. Try resolving by subdomain
    if (host.endsWith(`.${rootDomain}`)) {
        const slug = host.replace(`.${rootDomain}`, '');

        // Ignore common subdomains
        if (['www', 'app', 'admin', 'api'].includes(slug.toLowerCase())) {
            return null;
        }

        tenant = await prisma.business.findUnique({
            where: {
                slug: slug,
            },
        });
    }

    return tenant;
}

export async function getTenantBySlug(slug: string) {
    if (['www', 'app', 'admin', 'api'].includes(slug.toLowerCase())) {
        return null;
    }

    return await prisma.business.findUnique({
        where: {
            slug: slug,
        },
    });
}
