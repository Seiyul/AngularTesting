import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'Testing';
    textToPrint = '';

    getCoordinates(): void {
        var options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        const success = (pos: any) => {
            var crd = pos.coords;
            console.log('pos -->', pos);

            console.log('Your current position is:');
            console.log('Latitude : ' + crd.latitude);
            console.log('Longitude: ' + crd.longitude);
            console.log('More or less ' + crd.accuracy + ' meters.');

            this.textToPrint = this.textToPrint +
                '·· getCurrentPosition ··' + '\n\n' +
                'latitude: ' + crd.latitude + '\n' +
                'longitude: ' + crd.longitude + '\n' +
                'accuracy: ' + crd.accuracy + '\n' +
                'altitude: ' + crd.altitude + '\n' +
                'altitudeAccuracy: ' + crd.altitudeAccuracy + '\n' +
                'heading: ' + crd.heading + '\n' +
                'speed: ' + crd.speed + '\n' +
                'timestamp: ' + new Date(pos.timestamp) + '\n\n';
        };

        function error(err: any) {
            console.warn('ERROR(' + err.code + '): ' + err.message);
        };
        navigator.geolocation.getCurrentPosition(success, error, options);
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
