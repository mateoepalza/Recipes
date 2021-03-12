import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscriber, Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy{
  
  private userSub : Subscription;
  /**
   * 
   */
  isAuthenticated: boolean = false;

  constructor(private dataStorageService: DataStorageService, private authService: AuthService){
  }

  ngOnInit(){
    /**
     * This will subscribe to the subject that will inform us if the user is authenticated
     */
    this.userSub = this.authService.user.subscribe( user =>{
      /**
       * Here we rely on the fact that this use is either null if we are not logged in or 
       * exists if we are logged in
       */
      // this.isAuthenticated = !!user - is the same as the following
      this.isAuthenticated = !user ? false: true;
    });
  }
  
  ngOnDestroy(){
    /**
     * Unsubscribe to prevent memory leak
     */
    this.userSub.unsubscribe();
  }


  onSaveData(){
    this.dataStorageService.storeRecipes();
  }
  
  onFetchData(){
    /**
     * In here i subscribe because we are returning an observable, but the actual operations
     * is done in the service using the "tap()" operator
     */
    this.dataStorageService.fetchRecipes().subscribe();
  }
  
  onLogout(){
    /**
     * Use the service to logout from the session
     */
    this.authService.logout();
  }
}
