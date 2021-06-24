import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MasksService } from '../masks.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

    timerOption: any;
    saveClicked = false;

    showHint = false;
    percentage = 0;

    notification: any;

    constructor(
        public masks: MasksService,
        private _snackBar: MatSnackBar,
        private _router: Router
    ) { }

    settings = new FormGroup({
        randomize: new FormControl(false),
        timer: new FormControl(''),
        timerOption: new FormControl(''),
        margin: new FormControl(''),
        vibration: new FormControl(false),
        notification: new FormControl(false)
    });

    ngOnInit(): void {
        this.settings.get('timer')?.valueChanges.subscribe(() => {
            if (this.settings.get('timer')?.value === null || this.settings.get('timer')?.value === '') {
                this.settings.get('timerOption')?.setValue(null);
            }
        });

        this.settings.get('notification')?.valueChanges.subscribe(() => {
        });
    }

    vibrate(): void {
        window.navigator.vibrate([100, 200, 300, 400, 500, 600, 700]);
        this.showHint = true;
        this._snackBar.open('Comprueba que no tengas el móvil sin vibración', 'Cerrar', {
            duration: 5000
        });
        for (let i = 0; i <= 100; i++) {
            setTimeout(() => {
                if (i === 100) {
                    setTimeout(() => {
                        this.showHint = false;
                        this.percentage = 0;
                    }, 300);
                }
                this.percentage = i;
            }, i * 50);
        }
    }

    notify(): void {
        const date = new Date().toISOString();
        alert('Notificación de prueba de las ' + date);
    }

    delayedNotify(): void {
        this._snackBar.open('Se te enviará una notificación dentro de 15 segundos. Puedes cambiar de aplicación.', 'Cerrar', {
            duration: 7000
        });

        setTimeout(() => {
            this.notify();
        }, 15000);
    }

    back(): void {
        this._router.navigate(['/home']);
    }

}
