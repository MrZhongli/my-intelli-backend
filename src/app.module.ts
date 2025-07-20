import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthorsModule } from './authors/authors.module';
import { BooksModule } from './books/books.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ExportModule } from './export/export.module';

@Module({
    imports: [
    EventEmitterModule.forRoot(),
    PrismaModule,
    BooksModule,
    AuthorsModule,
    UsersModule,
    ExportModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
