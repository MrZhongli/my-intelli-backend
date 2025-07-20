import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class CreateUserDto {
    @ApiProperty({ example: 'alice@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'alice_w' })
    @IsString()
    username: string;

    @ApiProperty({ example: '123456' })
    @IsString()
    password: string;

    @ApiPropertyOptional({ example: 'Alice' })
    @IsOptional()
    @IsString()
    firstName?: string;

    @ApiPropertyOptional({ example: 'Walker' })
    @IsOptional()
    @IsString()
    lastName?: string;

    @ApiPropertyOptional({ enum: Role, default: Role.USER })
    @IsOptional()
    @IsEnum(Role)
    role?: Role;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    isActive?: boolean;
}
