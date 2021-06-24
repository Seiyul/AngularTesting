import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TelegramService {

    nombre = '';

    constructor() { }

    setNombre(nombre: string): void {
        this.nombre = nombre;
    }



}
