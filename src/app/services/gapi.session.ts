import { UserRepository } from './user.repository';
import { Injectable, EventEmitter } from "@angular/core";
const CLIENT_ID = "81290954041-ihr2flbidtn52j7oqv2diis35uqked8q.apps.googleusercontent.com";
const API_KEY = "AIzaSyBsgZEAZ1EFibc-fgqgaINyWiEE67A0B-A";
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
var SCOPES = 'https://www.googleapis.com/auth/drive';

@Injectable()
export class GapiSession {
    googleAuth: gapi.auth2.GoogleAuth;

    constructor(
        private userRepo: UserRepository

    ) {
    }

    initClient() {
        return new Promise((resolve,reject)=>{
            gapi.load('client:auth2', () => {
                return gapi.client.init({
                    apiKey: API_KEY,
                    clientId: CLIENT_ID,
                    discoveryDocs: DISCOVERY_DOCS,
                    scope: SCOPES,
                }).then(() => {                   
                    this.googleAuth = gapi.auth2.getAuthInstance();
                    resolve();
                }).catch((err)=>{
                    reject(err);
                });
            });
        });
        
    }
    get isSignedIn(): boolean {
        return this.googleAuth.isSignedIn.get();
    }

    signIn() {
        return this.googleAuth.signIn({
            prompt: 'consent'
        }).then((googleUser: gapi.auth2.GoogleUser) => {
            this.userRepo.add(googleUser.getBasicProfile());
        });
    }

    signOut(): void {
        this.googleAuth.signOut();
    }
}