export class User{
    
    constructor(
        public email:string, 
        public id: string, 
        private _token: string, 
        private _tokenExpirationDate: Date){}
    
    /**
     * Getter -> allows us to access the getter as a property in the following way:
     * -> user.token
     * -> to be a getter also means that the value can not be modified
     */
    get token(){
        /**
         * We check
         * -> we check if the expiration date exists and the current date is greater than 
         *    the _tokenExpirationDate, so we can know that the token expired
         */
        if(!this._tokenExpirationDate || new Date() > this._tokenExpirationDate){
            return null;
        }
        return this._token;
    }
}