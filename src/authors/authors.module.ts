import { Module } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { AuthorsController } from './authors.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthorsListener } from './authors.listener';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [AuthorsController],
  providers: [AuthorsService, AuthorsListener, PrismaService],
  imports: [PrismaModule],
})
export class AuthorsModule {}
