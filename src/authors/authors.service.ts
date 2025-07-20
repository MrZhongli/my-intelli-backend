import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Author } from '@prisma/client';

@Injectable()
export class AuthorsService {
  constructor(private prisma: PrismaService) {}

  create(data: Omit<Author, 'id' | 'createdAt' | 'updatedAt'>): Promise<Author> {
    return this.prisma.author.create({ data });
  }

  findAll(): Promise<Author[]> {
    return this.prisma.author.findMany({ include: { books: true } });
  }

  findOne(id: string): Promise<Author | null> {
    return this.prisma.author.findUnique({ where: { id }, include: { books: true } });
  }

  update(id: string, data: Partial<Omit<Author, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Author> {
    return this.prisma.author.update({ where: { id }, data });
  }

  remove(id: string): Promise<Author> {
    return this.prisma.author.delete({ where: { id } });
  }
}
