import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-get',
    templateUrl: './get.component.html',
    styleUrls: ['./get.component.scss']
})
// Componente creado únicamente para el control de las queryParams
export class GetComponent implements OnInit {

    constructor(
        private _route: ActivatedRoute,
        private _router: Router
    ) { }

    ngOnInit(): void {
        this._route.queryParams.subscribe(params => {
            console.log(params);
            sessionStorage.setItem('params', JSON.stringify(params));
            this._router.navigate(['']);
        });
    }
}
