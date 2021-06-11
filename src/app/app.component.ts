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

    ngOnInit(): void {
        // Notification.requestPermission();
    }

    getCoordinates(): void {
        var options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        const success = (pos: any) => {
            var crd = pos.coords;


            this.textToPrint = this.textToPrint +
                '·· getCurrentPosition ··' + '\n\n' +
                'latitude: ' + crd.latitude + '\n' +
                'longitude: ' + crd.longitude + '\n' +
                'accuracy: ' + crd.accuracy + '\n' +
                'altitude: ' + crd.altitude + '\n' +
                'altitudeAccuracy: ' + crd.altitudeAccuracy + '\n' +
                'heading: ' + crd.heading + '\n' +
                'speed: ' + crd.speed + '\n' +
                'timestamp: ' + new Date(pos.timestamp).toISOString() + '\n' +
                'clickDate: ' + date + '\n\n';
        };

        const error = (err: any) => {
            this.textToPrint = this.textToPrint + '\n' +
                '(!) Error ' + err.code + ': ' + err.message + '.\n';
            console.warn('ERROR -->' + err);
        };
        const date = new Date().toISOString();
        navigator.geolocation.getCurrentPosition(success, error, options);
    }

    // Utilización del watchPosition en lugar del getCurrentPosition
    getCoordinates2(): void {
        var options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        const success = (pos: any) => {
            var crd = pos.coords;
            this.textToPrint = this.textToPrint +
                '·· watchPosition ··' + '\n\n' +
                'latitude: ' + crd.latitude + '\n' +
                'longitude: ' + crd.longitude + '\n' +
                'accuracy: ' + crd.accuracy + '\n' +
                'altitude: ' + crd.altitude + '\n' +
                'altitudeAccuracy: ' + crd.altitudeAccuracy + '\n' +
                'heading: ' + crd.heading + '\n' +
                'speed: ' + crd.speed + '\n' +
                'timestamp: ' + new Date(pos.timestamp).toISOString() + '\n' +
                'clickDate: ' + date + '\n\n';

        };
        const error = (err: any) => {
            this.textToPrint = this.textToPrint + '\n' +
                '(!) Error ' + err.code + ': ' + err.message + '.\n';
            console.warn('ERROR -->' + err);
        };
        const date = new Date().toISOString();
        navigator.geolocation.watchPosition(success, error, options);
    }

    getFiveCoordinates(): void {
        this.textToPrint = '··· Prueba continua (10 repeticiones - 5 segundos) ···' + '\n\n';
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                this.getCoordinates();
            }, 5000 * i);
        }
    }

    copyToClipboard(): void {
        var dummy = document.createElement("textarea");
        document.body.appendChild(dummy);
        dummy.value = this.textToPrint;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
    }

    getBrowserInfo(): void {
        this.textToPrint = '··· Browser info ···' + '\n';
        console.log('navigator -->', navigator);

        this.textToPrint = this.textToPrint + '\n' +
            'userAgent: ' + navigator.userAgent + '\n' +
            'vendor: ' + navigator.vendor + '\n' +
            'platform: ' + navigator.platform + '\n';
    }

    cleanLog(): void {
        this.textToPrint = '';
    }
}
