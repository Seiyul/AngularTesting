import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class MasksService {

    constructor() { }

    numberMask(field: any): void {
        let value = field.value;
        value = value.replace(/[^\d]|[\-+\.\,]/g, '');
        field.setValue(value);
    }
}
