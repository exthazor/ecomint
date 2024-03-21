import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
    const categories = new Set<string>();
    let attempts = 0;

    while (categories.size < 100 && attempts < 200) {
        const potentialName = `${faker.commerce.department()} ${faker.random.word()}`;
        categories.add(potentialName);
        attempts++;
    }

    console.log(`Generated ${categories.size} unique categories.`);

    for (const name of categories) {
        await prisma.category.create({
            data: {
                name,
            },
        }).catch(e => console.log(`Error inserting ${name}:`, e.message));
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
