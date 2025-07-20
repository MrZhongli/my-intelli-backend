import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Bienvenido a la api del Test de intelli, te invito ver la docs en http://localhost:8000/docs!';
  }
}
