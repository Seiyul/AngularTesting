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
            if (this.settings.get('notification')?.value === true) {
                Notification.requestPermission();
            }
        });
    }

    vibrate(): void {
        window.navigator.vibrate([150, 50, 200, 200, 300]);
        this.showHint = true;
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
        if (Notification.permission !== 'denied') {
            var notification = new Notification('Notificación de prueba');
        }
    }

    back(): void {
        this._router.navigate(['/home']);
    }

}
