import { Component, OnInit } from '@angular/core';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { AuthService } from './auth/auth.service';
import { LogginService } from './loggin.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  
  
  constructor(private authService: AuthService, private logginService: LogginService){
  }

  ngOnInit(){
    /**
     * We call this property with the purpose of checking if there's 
     * a current token activated, if that's the case we are going to autologin
     */
    this.authService.autoLogin();
    this.logginService.printLog("Hello from AppComponent ngOnInit");
  }
}
