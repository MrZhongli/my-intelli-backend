// src/books/books.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from 'src/prisma/prisma.service';
import { Book } from '@prisma/client';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(dto: CreateBookDto): Promise<Book> {
    const book = await this.prisma.book.create({
      data: {
        title: dto.title,
        isbn: dto.isbn,
        description: dto.description,
        authorId: dto.authorId,
      },
      include: { author: true },
    });
    this.eventEmitter.emit('book.created', {
      authorId: book.authorId,
      bookId: book.id,
    });
    return book;
  }

  async findAll(): Promise<Book[]> {
    return this.prisma.book.findMany({ include: { author: true } });
  }

  async findOne(id: string): Promise<Book> {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: { author: true },
    });
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  async update(id: string, dto: UpdateBookDto): Promise<Book> {
    await this.findOne(id);
    const updated = await this.prisma.book.update({
      where: { id },
      data: {
        title: dto.title,
        isbn: dto.isbn,
        description: dto.description,
        authorId: dto.authorId,
      },
      include: { author: true },
    });
    return updated;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const book = await this.findOne(id);
    await this.prisma.book.delete({ where: { id } });
    this.eventEmitter.emit('book.deleted', {
      authorId: book.authorId,
      bookId: book.id,
    });
    return { deleted: true };
  }

  async findByAuthor(authorId: string): Promise<Book[]> {
    return this.prisma.book.findMany({
      where: { authorId },
      include: { author: true },
    });
  }
}
