// src/export/export.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as XLSX from 'xlsx';

@Injectable()
export class ExportService {
    constructor(private prisma: PrismaService) { }

    async exportAuthorsToExcel(): Promise<Buffer> {
        // Obtener todos los autores con sus libros
        const authors = await this.prisma.author.findMany({
            include: {
                books: {
                    select: {
                        id: true,
                        title: true,
                        isbn: true
                    }
                }
            },
            orderBy: {
                lastName: 'asc'
            }
        });

        // Formatear datos para Excel
        const authorData = authors.map(author => ({
            'ID': author.id,
            'Nombre': author.firstName,
            'Apellido': author.lastName,
            'Contador de Libros': author.booksCount,
            'Libros Reales': author.books.length,
            'Títulos de Libros': author.books.length > 0 
                ? author.books.map(book => book.title).join(', ') 
                : 'Sin libros',
            'Fecha de Creación': new Date(author.createdAt).toLocaleDateString('es-ES'),
            'Última Actualización': new Date(author.updatedAt).toLocaleDateString('es-ES')
        }));

        // Crear workbook y worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(authorData);

        // Configurar ancho de columnas
        worksheet['!cols'] = [
            { wch: 15 },  // ID
            { wch: 15 },  // Nombre
            { wch: 15 },  // Apellido
            { wch: 12 },  // Contador Libros
            { wch: 12 },  // Libros Reales
            { wch: 50 },  // Títulos de Libros
            { wch: 15 },  // Fecha Creación
            { wch: 15 }   // Última Actualización
        ];

        // Agregar worksheet al workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Autores');

        // Convertir a buffer
        const excelBuffer = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'buffer'
        });

        return Buffer.from(excelBuffer);
    }

    async exportBooksToExcel(): Promise<Buffer> {
        // Obtener todos los libros con información del autor
        const books = await this.prisma.book.findMany({
            include: {
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        booksCount: true
                    }
                }
            },
            orderBy: {
                title: 'asc'
            }
        });

        // Formatear datos para Excel
        const bookData = books.map(book => ({
            'ID': book.id,
            'Título': book.title,
            'ISBN': book.isbn || 'Sin ISBN',
            'Descripción': book.description || 'Sin descripción',
            'ID del Autor': book.authorId,
            'Nombre del Autor': `${book.author.firstName} ${book.author.lastName}`,
            'Total Libros del Autor': book.author.booksCount,
            'Fecha de Creación': new Date(book.createdAt).toLocaleDateString('es-ES'),
            'Última Actualización': new Date(book.updatedAt).toLocaleDateString('es-ES')
        }));

        // Crear workbook y worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(bookData);

        // Configurar ancho de columnas
        worksheet['!cols'] = [
            { wch: 15 },  // ID
            { wch: 30 },  // Título
            { wch: 15 },  // ISBN
            { wch: 40 },  // Descripción
            { wch: 15 },  // ID Autor
            { wch: 20 },  // Nombre Autor
            { wch: 12 },  // Total Libros Autor
            { wch: 15 },  // Fecha Creación
            { wch: 15 }   // Última Actualización
        ];

        // Agregar worksheet al workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Libros');

        // Convertir a buffer
        const excelBuffer = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'buffer'
        });

        return Buffer.from(excelBuffer);
    }

    async exportCombinedToExcel(): Promise<Buffer> {
        // Obtener datos completos
        const authors = await this.prisma.author.findMany({
            include: {
                books: true
            },
            orderBy: {
                lastName: 'asc'
            }
        });

        const books = await this.prisma.book.findMany({
            include: {
                author: true
            },
            orderBy: {
                title: 'asc'
            }
        });

        // Crear workbook
        const workbook = XLSX.utils.book_new();

        // === WORKSHEET 1: AUTORES ===
        const authorData = authors.map(author => ({
            'ID': author.id,
            'Nombre Completo': `${author.firstName} ${author.lastName}`,
            'Nombre': author.firstName,
            'Apellido': author.lastName,
            'Contador de Libros': author.booksCount,
            'Libros Actuales': author.books.length,
            'Diferencia': author.booksCount - author.books.length, // Para detectar inconsistencias
            'Fecha de Creación': new Date(author.createdAt).toLocaleDateString('es-ES'),
            'Última Actualización': new Date(author.updatedAt).toLocaleDateString('es-ES')
        }));

        const authorsWorksheet = XLSX.utils.json_to_sheet(authorData);
        authorsWorksheet['!cols'] = [
            { wch: 15 }, // ID
            { wch: 25 }, // Nombre Completo
            { wch: 15 }, // Nombre
            { wch: 15 }, // Apellido
            { wch: 12 }, // Contador
            { wch: 12 }, // Actuales
            { wch: 10 }, // Diferencia
            { wch: 15 }, // Fecha Creación
            { wch: 15 }  // Última Actualización
        ];

        // === WORKSHEET 2: LIBROS ===
        const bookData = books.map(book => ({
            'ID': book.id,
            'Título': book.title,
            'ISBN': book.isbn || 'Sin ISBN',
            'Descripción': book.description || 'Sin descripción',
            'Autor': `${book.author.firstName} ${book.author.lastName}`,
            'ID del Autor': book.authorId,
            'Fecha de Creación': new Date(book.createdAt).toLocaleDateString('es-ES'),
            'Última Actualización': new Date(book.updatedAt).toLocaleDateString('es-ES')
        }));

        const booksWorksheet = XLSX.utils.json_to_sheet(bookData);
        booksWorksheet['!cols'] = [
            { wch: 15 }, // ID
            { wch: 35 }, // Título
            { wch: 15 }, // ISBN
            { wch: 40 }, // Descripción
            { wch: 25 }, // Autor
            { wch: 15 }, // ID Autor
            { wch: 15 }, // Fecha Creación
            { wch: 15 }  // Última Actualización
        ];

        // === WORKSHEET 3: ESTADÍSTICAS ===
        const totalAuthors = authors.length;
        const totalBooks = books.length;
        const authorsWithBooks = authors.filter(author => author.books.length > 0).length;
        const authorsWithoutBooks = totalAuthors - authorsWithBooks;
        const averageBooksPerAuthor = totalAuthors > 0 ? (totalBooks / totalAuthors).toFixed(2) : '0';

        // Encontrar autor con más libros
        const authorWithMostBooks = authors.length > 0 
            ? authors.reduce((prev, current) => 
                prev.books.length > current.books.length ? prev : current
            ) : null;

        // Detectar inconsistencias en el contador
        const authorsWithInconsistencies = authors.filter(
            author => author.booksCount !== author.books.length
        );

        const statsData = [
            { 'Métrica': 'RESUMEN GENERAL', 'Valor': '' },
            { 'Métrica': 'Total de Autores', 'Valor': totalAuthors.toString() },
            { 'Métrica': 'Total de Libros', 'Valor': totalBooks.toString() },
            { 'Métrica': 'Promedio Libros por Autor', 'Valor': averageBooksPerAuthor },
            { 'Métrica': '', 'Valor': '' },
            { 'Métrica': 'DISTRIBUCIÓN', 'Valor': '' },
            { 'Métrica': 'Autores con Libros', 'Valor': authorsWithBooks.toString() },
            { 'Métrica': 'Autores sin Libros', 'Valor': authorsWithoutBooks.toString() },
            { 'Métrica': '', 'Valor': '' },
            { 'Métrica': 'DESTACADOS', 'Valor': '' },
            { 
                'Métrica': 'Autor con Más Libros', 
                'Valor': authorWithMostBooks 
                    ? `${authorWithMostBooks.firstName} ${authorWithMostBooks.lastName} (${authorWithMostBooks.books.length} libros)`
                    : 'N/A'
            },
            { 'Métrica': '', 'Valor': '' },
            { 'Métrica': 'VALIDACIÓN DE DATOS', 'Valor': '' },
            { 'Métrica': 'Autores con Contador Inconsistente', 'Valor': authorsWithInconsistencies.length.toString() },
            { 'Métrica': '', 'Valor': '' },
            { 'Métrica': 'INFORMACIÓN DEL REPORTE', 'Valor': '' },
            { 'Métrica': 'Fecha de Generación', 'Valor': new Date().toLocaleDateString('es-ES') },
            { 'Métrica': 'Hora de Generación', 'Valor': new Date().toLocaleTimeString('es-ES') }
        ];

        const statsWorksheet = XLSX.utils.json_to_sheet(statsData);
        statsWorksheet['!cols'] = [{ wch: 35 }, { wch: 40 }];

        // === WORKSHEET 4: RELACIÓN AUTOR-LIBROS (Detallado) ===
        const relationData = [];
        authors.forEach(author => {
            if (author.books.length > 0) {
                author.books.forEach((book, index) => {
                    relationData.push({
                        'Autor ID': author.id,
                        'Autor': `${author.firstName} ${author.lastName}`,
                        'Libro #': index + 1,
                        'Libro ID': book.id,
                        'Título del Libro': book.title,
                        'ISBN': book.isbn || 'Sin ISBN',
                        'Descripción': book.description ? 
                            (book.description.length > 50 ? 
                                book.description.substring(0, 50) + '...' : 
                                book.description) : 'Sin descripción'
                    });
                });
            } else {
                relationData.push({
                    'Autor ID': author.id,
                    'Autor': `${author.firstName} ${author.lastName}`,
                    'Libro #': 0,
                    'Libro ID': 'N/A',
                    'Título del Libro': 'SIN LIBROS',
                    'ISBN': 'N/A',
                    'Descripción': 'Este autor no tiene libros asociados'
                });
            }
        });

        const relationWorksheet = XLSX.utils.json_to_sheet(relationData);
        relationWorksheet['!cols'] = [
            { wch: 15 }, // Autor ID
            { wch: 25 }, // Autor
            { wch: 8 },  // Libro #
            { wch: 15 }, // Libro ID
            { wch: 30 }, // Título
            { wch: 15 }, // ISBN
            { wch: 35 }  // Descripción
        ];

        // Agregar todos los worksheets al workbook
        XLSX.utils.book_append_sheet(workbook, authorsWorksheet, 'Autores');
        XLSX.utils.book_append_sheet(workbook, booksWorksheet, 'Libros');
        XLSX.utils.book_append_sheet(workbook, statsWorksheet, 'Estadísticas');
        XLSX.utils.book_append_sheet(workbook, relationWorksheet, 'Relación Autor-Libros');

        // Convertir a buffer
        const excelBuffer = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'buffer'
        });

        return Buffer.from(excelBuffer);
    }

    // Método auxiliar para obtener estadísticas rápidas
    async getExportStats() {
        const [authorsCount, booksCount] = await Promise.all([
            this.prisma.author.count(),
            this.prisma.book.count()
        ]);

        return {
            totalAuthors: authorsCount,
            totalBooks: booksCount,
            lastUpdated: new Date().toISOString()
        };
    }
}