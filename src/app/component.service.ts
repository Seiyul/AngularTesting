import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ComponentService {

    params: any;

    constructor() { }

    setQueryParams: EventEmitter<any> = new EventEmitter<any>();

    setParams(params: any): void {
        this.params = params;
        sessionStorage.setItem('params', JSON.stringify(params));
        console.log('setParams');
        this.setQueryParams.emit();
    }

    getParams(): any {
        return this.params;
    }

}
