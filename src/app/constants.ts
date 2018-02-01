let env = 'local';
let API_URL;
let ASSET_URL;
let MEDIA_URL;
let STORAGE_URL;

if (window.location.hostname.indexOf('rideapp.') > -1) {
    env = 'prod';
} else if (window.location.hostname.indexOf('rideapp-stage.') > -1) {
    env = 'stage';
}

if (env === 'prod') {
    API_URL = 'https://rideapp.vqode.com/public/api/';
    ASSET_URL = 'https://rideapp.vqode.com/app/assets/';
    MEDIA_URL = 'https://rideapp.vqode.com/public/media';
    STORAGE_URL = 'https://rideapp.vqode.com/storage/app/';
} else {
    API_URL = 'https://rideapp.vqode.com/public/api/';
    ASSET_URL = 'https://rideapp.vqode.com/app/assets/';
    MEDIA_URL = 'https://rideapp.vqode.com/public/media';
    STORAGE_URL = 'https://rideapp.vqode.com/storage/app/';
}

export class Constants {
    public static get API_URL(): string { return API_URL; };
    public static get ASSET_URL(): string { return ASSET_URL; };
    public static get MEDIA_URL(): string { return MEDIA_URL; };
    public static get STORAGE_URL(): string {return STORAGE_URL; };
 }
