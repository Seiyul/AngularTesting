import { OnInit } from '@angular/core';
import { Component } from '@angular/core';

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

    sampleCoordinates = [['Acueducto de Segovia', 40.94791, -4.11788], ['Catedral de León', 42.59918, -5.56678], ['Kilómetro cero', 40.41664, -3.70381]];

    ngOnInit(): void {
        // Notification.requestPermission();
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
                    'Ubicación seleccionada: ' + this.selectValue[0] + '\n' +
                    'Latitud de la ubicación: ' + this.selectValue[1] + '\n' +
                    'Longitud de la ubicación: ' + this.selectValue[2] + '\n\n' +
                    'Latitud actual: ' + crd.latitude + '\n' +
                    'Longitud actual: ' + crd.longitude + '\n' +
                    'Precisión: ±' + crd.accuracy + ' m\n\n' +
                    '(!) Distancia a la ubicación: ' + this.calculateDistance(crd.latitude, crd.longitude) + ' km(s)' + '\n\n' +
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
        console.log('latitude: ' + latitude);
        console.log('latitudeChosen: ' + latitudeChosen);

        const longitudeChosen = this.selectValue[2];
        console.log('longitude: ' + longitude);
        console.log('longitudeChosen: ' + longitudeChosen);

        const earthRadius = 6371;

        const x1 = latitude - latitudeChosen;
        const distanceLatitude = this.toRadians(x1);

        const x2 = longitude - longitudeChosen;
        const distanceLongitude = this.toRadians(x2);

        const a = Math.sin(distanceLatitude / 2) * Math.sin(distanceLatitude / 2) +
            Math.cos(this.toRadians(latitude)) * Math.cos(this.toRadians(latitudeChosen)) *
            Math.pow(Math.sin(this.toRadians(distanceLongitude)), 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = earthRadius * c;

        return d;
    }

    toRadians(value: number): number {
        return value * Math.PI / 180;
    }
}
