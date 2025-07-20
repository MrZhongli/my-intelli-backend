import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    EventEmitterModule.forRoot(), // en AppModule si lo usarás en varios
    PrismaModule,
  ],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
