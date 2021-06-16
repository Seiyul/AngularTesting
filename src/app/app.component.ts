import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentService } from './component.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'Testing';
    textToPrint = '';

    averageTime: number[] = [];
    averageAccuracy: number[] = [];

    watchPosition: any;

    showSelect = false;
    selectValue: any;

    isCalculateDistance = false;

    showForm = false;

    customPlace = new FormGroup({
        name: new FormControl(''),
        latitude: new FormControl('', [Validators.max(90), Validators.min(-90), Validators.required]),
        longitude: new FormControl('', [Validators.max(180), Validators.min(-180), Validators.required])
    })

    sampleCoordinates = [
        ['Acueducto de Segovia', 40.94791, -4.11788],
        ['Catedral de León', 42.59918, -5.56678],
        ['Puerta del Sol', 40.41664, -3.70381],
        ['Catedral de Santiago', 42.88054, -8.54527],
        ['Palacio de la Magdalena', 43.46917, -3.76636],
        ['Museo Guggenheim Bilbao', 43.26876, -2.93388],
        ['Sagrada Familia', 41.40344, 2.17409],
        ['Ciudad de las Artes y las Ciencias', 39.45556, -0.35184],
        ['Catedral de Málaga', 36.72012, -4.41950],
        ['Plaza Mayor de Salamanca', 40.96059, -5.66591],
        ['Teatro Romano de Mérida', 38.91534, -6.33864],
        ['La Giralda', 37.38620, -5.99254],
        ['Mezquita-Catedral de Córdoba', 37.87899, -4.77947]
    ];

    constructor(
        private _snackbar: MatSnackBar,
        private _route: ActivatedRoute,
        private _router: Router,
        private _service: ComponentService
    ) {

    }

    ngOnInit(): void {
        // Notification.requestPermission();
        this._service.setQueryParams.subscribe(() => {
            this.getQueryParams();
        });
        const warningShown = sessionStorage.getItem('warningShown');
        if (!warningShown) {
            this._snackbar.open('No se comparte la información con ningún servidor', 'Cerrar', {
                duration: 5000
            });
            sessionStorage.setItem('warningShown', 'true');
        }
    }

    getBrowserInfo(): void {
        this.textToPrint = '··· Browser info ···' + '\n';

        this.textToPrint = this.textToPrint + '\n' +
            'userAgent: ' + navigator.userAgent + '\n' +
            'vendor: ' + navigator.vendor + '\n' +
            'platform: ' + navigator.platform + '\n';
        var dummy = document.createElement("textarea");
        document.body.appendChild(dummy);
        dummy.value = this.textToPrint;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
    }

    getCoordinates(firstTime?: boolean): void {
        if (firstTime) {
            this.stopWatch(true);
        }
        let startTime = new Date();
        var options = {
            enableHighAccuracy: true,
            timeout: 60000,
            maximumAge: 0
        };

        const success = (pos: any) => {
            var crd = pos.coords;
            let endTime = new Date();
            const accuracy = crd.accuracy;
            const time = (endTime.getTime() - startTime.getTime());
            if (this.isCalculateDistance) {
                this.showSelect = false;
                this.textToPrint =
                    '· watchPosition · \n· Refresco Nº ' + (this.averageAccuracy.length + 1) + ' ·' + '\n\n' +
                    'Ubicación seleccionada: \n' + this.selectValue[0] + '\n' +
                    'Latitud de la ubicación: ' + this.selectValue[1] + '\n' +
                    'Longitud de la ubicación: ' + this.selectValue[2] + '\n\n' +
                    'Latitud actual: ' + crd.latitude + '\n' +
                    'Longitud actual: ' + crd.longitude + '\n' +
                    'Precisión: ±' + crd.accuracy + ' m\n\n' +
                    '(!) Distancia a la ubicación: \n' + this.calculateDistance(crd.latitude, crd.longitude) + ' km(s)' + '\n\n' +
                    'Velocidad: ' + crd.speed * 3.6 + ' km/h' + '\n\n' +
                    'Marca temporal: ' + new Date(pos.timestamp).toISOString() + '\n' +
                    'Fecha del clickeo: ' + date + '\n' +
                    'Tiempo entre dos peticiones: ' + time + ' ms' + '\n\n';
                startTime = new Date();
                this.averageAccuracy.push(parseFloat(accuracy));
                this.averageTime.push(time);
            }
            else {
                this.textToPrint =
                    '· watchPosition · \n· Refresco Nº ' + (this.averageAccuracy.length + 1) + ' ·' + '\n\n' +
                    'Latitud: ' + crd.latitude + '\n' +
                    'Longitud: ' + crd.longitude + '\n' +
                    'Precisión : ' + crd.accuracy + '\n' +
                    'Altitud: ' + crd.altitude + ' m' + '\n' +
                    'Orientación: ' + crd.heading + 'º' + '\n' +
                    'Velocidad: ' + crd.speed + ' m/s' + '\n' +
                    'Velocidad: ' + crd.speed * 3.6 + ' km/h' + '\n' +
                    'Marca temporal: ' + new Date(pos.timestamp).toISOString() + '\n' +
                    'Fecha del clickeo: ' + date + '\n' +
                    'Tiempo entre dos peticiones: ' + time + ' ms' + '\n\n';
                startTime = new Date();
                this.averageAccuracy.push(parseFloat(accuracy));
                this.averageTime.push(time);
            }
        };
        const error = (err: any) => {
            this.textToPrint = this.textToPrint + '\n' +
                '(!) Error ' + err.code + ': ' + err.message + '.\n\n';
            console.warn('ERROR ' + err.code + ' --> ' + err.message);
            if (err.code === 3) {
                this.textToPrint += 'Reintentando...' + '\n';
                this.getCoordinates();
            }
            if (err.code === 1) {
                this.textToPrint += 'Revisa los permisos de ubicación de tu dispositivo y vuelve a intentarlo.' + '\n';
            }

        };
        const date = new Date().toISOString();
        this.watchPosition = navigator.geolocation.watchPosition(success, error, options);
    }

    cleanLog(): void {
        this.textToPrint = '';
    }

    stopWatch(hideMessage?: boolean): void {
        navigator.geolocation.clearWatch(this.watchPosition);
        this.averageAccuracy = [];
        this.averageTime = [];
        if (!hideMessage) {
            this.textToPrint = 'Se ha detenido el método 3 correctamente';
        }
    }

    copyAverage(): void {
        let accuracy = 0;
        let time = 0;
        for (let i = 0; i < this.averageAccuracy.length; i++) {
            accuracy += this.averageAccuracy[i];
        }
        accuracy = accuracy / this.averageAccuracy.length;

        for (let i = 0; i < this.averageTime.length; i++) {
            time += this.averageTime[i];
        }
        time = time / this.averageTime.length;

        const value =
            'Cantidad de registros: ' + this.averageAccuracy.length + '\n' +
            'Media de precisión: ' + accuracy + '\n\n' +
            'Cantidad de registros: ' + this.averageTime.length + '\n' +
            'Media de tiempos: ' + time + '\n';
        var dummy = document.createElement("textarea");
        document.body.appendChild(dummy);
        dummy.value = value;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
    }

    calculateDistance(latitude: number, longitude: number): number {
        const latitudeChosen = this.selectValue[1];
        const longitudeChosen = this.selectValue[2];

        // Fórmula de https://www.movable-type.co.uk/scripts/latlong.html

        const R = 6371e3;
        const φ1 = latitude * Math.PI / 180; // φ, λ in radians
        const φ2 = latitudeChosen * Math.PI / 180;
        const Δφ = (latitudeChosen - latitude) * Math.PI / 180;
        const Δλ = (longitudeChosen - longitude) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // in metres

        return d / 1000 // in kilometres;
    }

    toRadians(value: number): number {
        return value * Math.PI / 180;
    }

    addValue(): void {
        const name = !this.customPlace.get('name')?.value ? 'Custom' : this.customPlace.get('name')?.value;
        this.selectValue = [name, this.customPlace.get('latitude')?.value, this.customPlace.get('longitude')?.value];
        this.isCalculateDistance = true;
        this.showForm = false;
        this.showSelect = true;
        this.getCoordinates(true);
    }

    getQueryParams(): void {
        const params = sessionStorage.getItem('params');
        if (params) {
            this.textToPrint = '· Received params ·' + '\n' + params;
            sessionStorage.removeItem('params');
        }

    }
}
