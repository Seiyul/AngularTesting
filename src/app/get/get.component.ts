import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { ComponentService } from '../component.service';

@Component({
    selector: 'app-get',
    templateUrl: './get.component.html',
    styleUrls: ['./get.component.scss']
})
// Componente creado únicamente para el control de las queryParams
export class GetComponent implements OnInit {

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _service: ComponentService
    ) { }

    ngOnInit(): void {
        this._route.queryParams.subscribe(params => {
            this._service.setParams(JSON.stringify(params));
            this._router.navigate(['']);
        });
    }
}
