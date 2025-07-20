import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { ExportService } from './export.service';
import { ApiTags, ApiOperation, ApiResponse, ApiProduces } from '@nestjs/swagger';

@ApiTags('Exportación')
@Controller('export')
export class ExportController {
    constructor(private exportService: ExportService) { }

    @Get('authors/excel')
    @ApiOperation({ summary: 'Exportar autores a Excel' })
    @ApiProduces('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    @ApiResponse({ status: 200, description: 'Archivo Excel generado correctamente' })
    @ApiResponse({ status: 500, description: 'Error al exportar autores' })
    async exportAuthorsToExcel(@Res() res: Response) {
        try {
            const buffer = await this.exportService.exportAuthorsToExcel();
            const fileName = `autores_${new Date().toISOString().split('T')[0]}.xlsx`;

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
            res.setHeader('Content-Length', buffer.length);
            res.send(buffer);
        } catch (error) {
            res.status(500).json({
                error: 'Error al exportar autores',
                message: error.message,
            });
        }
    }

    @Get('books/excel')
    @ApiOperation({ summary: 'Exportar libros a Excel' })
    @ApiProduces('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    @ApiResponse({ status: 200, description: 'Archivo Excel generado correctamente' })
    @ApiResponse({ status: 500, description: 'Error al exportar libros' })
    async exportBooksToExcel(@Res() res: Response) {
        try {
            const buffer = await this.exportService.exportBooksToExcel();
            const fileName = `libros_${new Date().toISOString().split('T')[0]}.xlsx`;

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
            res.setHeader('Content-Length', buffer.length);
            res.send(buffer);
        } catch (error) {
            res.status(500).json({
                error: 'Error al exportar libros',
                message: error.message,
            });
        }
    }

    @Get('combined/excel')
    @ApiOperation({ summary: 'Exportar autores + libros combinados a Excel' })
    @ApiProduces('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    @ApiResponse({ status: 200, description: 'Archivo Excel generado correctamente' })
    @ApiResponse({ status: 500, description: 'Error al exportar datos combinados' })
    async exportCombinedToExcel(@Res() res: Response) {
        try {
            const buffer = await this.exportService.exportCombinedToExcel();
            const fileName = `biblioteca_completa_${new Date().toISOString().split('T')[0]}.xlsx`;

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
            res.setHeader('Content-Length', buffer.length);
            res.send(buffer);
        } catch (error) {
            res.status(500).json({
                error: 'Error al exportar datos combinados',
                message: error.message,
            });
        }
    }

    @Get('info')
    @ApiOperation({ summary: 'Obtener información de los tipos de exportación disponibles' })
    @ApiResponse({ status: 200, description: 'Lista de endpoints de exportación y formatos' })
    async getExportInfo() {
        return {
            availableExports: [
                {
                    endpoint: '/export/authors/excel',
                    description: 'Exportar solo autores',
                    filename: 'autores_YYYY-MM-DD.xlsx',
                },
                {
                    endpoint: '/export/books/excel',
                    description: 'Exportar solo libros',
                    filename: 'libros_YYYY-MM-DD.xlsx',
                },
                {
                    endpoint: '/export/combined/excel',
                    description: 'Exportar autores, libros y estadísticas',
                    filename: 'biblioteca_completa_YYYY-MM-DD.xlsx',
                },
            ],
            format: 'Microsoft Excel (.xlsx)',
            authentication: 'Bearer Token requerido',
        };
    }
}
