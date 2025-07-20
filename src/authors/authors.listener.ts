// src/authors/authors.listener.ts
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthorsListener {
    constructor(private readonly prisma: PrismaService) {}

    @OnEvent('book.created')
    async handleBookCreated(payload: { authorId: string }) {
        await this.prisma.author.update({
        where: { id: payload.authorId },
        data: { booksCount: { increment: 1 } },
        });
    }

    @OnEvent('book.deleted')
    async handleBookDeleted(payload: { authorId: string }) {
        await this.prisma.author.update({
        where: { id: payload.authorId },
        data: { booksCount: { decrement: 1 } },
        });
    }
}
