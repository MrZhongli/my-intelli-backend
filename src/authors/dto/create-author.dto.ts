import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthorDto {
    @ApiProperty({ example: 'Gabriel' })
    @IsString()
    firstName: string;

    @ApiProperty({ example: 'García Márquez' })
    @IsString()
    lastName: string;

}
