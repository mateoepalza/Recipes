import { Injectable } from "@angular/core";

/**
 * This service is with the purpose of checking how the services work when we provide them in 
 * different places
 */
/**@Injectable({
    providedIn: 'root'
})*/
export class LogginService{
    lastLog: string;

    printLog(message: string){
        console.log(message);
        console.log(this.lastLog);
        this.lastLog = message;
    }
}