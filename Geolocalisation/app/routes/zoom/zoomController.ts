module Controllers {
    export class zoomController {
        greeting: string;
        constructor() {
            this.greeting = 'hello from controller';
        }
    }
    var app = angular.module('app');
    app.controller('zoomController', [()=>new zoomController()]);
} 