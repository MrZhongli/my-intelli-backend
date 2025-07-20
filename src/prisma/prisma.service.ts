import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
        async onModuleInit() {
            await this.$connect();
        }

    async onModuleDestroy() {
        await this.$disconnect();
    }

    // Método helper para limpiar la base de datos en tests
    async cleanDatabase() {
        if (process.env.NODE_ENV === 'production') return;

        const models = Reflect.ownKeys(this).filter((key) => key[0] !== '_');

        return Promise.all(models.map((modelKey) => this[modelKey].deleteMany()));
    }
}