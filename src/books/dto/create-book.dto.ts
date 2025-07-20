import { IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookDto {
    @ApiProperty({ example: 'El Principito' })
    @IsString()
    title: string;

    @ApiPropertyOptional({ example: '978-9876543210' })
    @IsOptional()
    @IsString()
    isbn?: string;

    @ApiPropertyOptional({ example: 'Un libro clásico infantil' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ example: 'uuid-del-autor' })
    @IsUUID()
    authorId: string;
}
