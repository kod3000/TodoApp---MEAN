import { Inject, Injectable, isDevMode } from '@angular/core';
import { firstValueFrom, from, map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


/**
 * Todo Library
 *  - Frontend CRUD operations for the Todo application
 *
 *  - Developers Note:
 *  -- This library's functions are all async, which means that they will return a promise
 *  -- They are split into three sections:
 *  --- 1. The initial server call that is made to the API and is private to the class
 *  --- 2. The public function that is called by the component and is public to the class
 *  --- 3. An optional function that can be made into strict mode when needing to expand the functionality of the library
 *  ---- 3.1. The third function is also decorated with notes so to allow for easier understanding of the code
 *
 * (v1.0.0)
 */
@Injectable({
    providedIn: 'root'
})
export class TodoLibService {

    private libraryEnabled: boolean = true;
    private readonly apiBaseUrl: string = '';
    constructor(
      private http: HttpClient,
      @Inject('BASE_URL') baseUrl: string,
      ) {
        this.apiBaseUrl = baseUrl;

        // first thing check if the library is allowed
        if (!isDevMode()) {
            const checkLibStatus = async () => { this.libraryEnabled = await this.libEnabled(); };
            checkLibStatus();
        }
        if (isDevMode()) {
            console.log('[ Todo library Service is ' + (this.libraryEnabled ? 'enabled' : 'disabled') + ' ]');
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Todo Library Global Controller | Begins
    // -----------------------------------------------------------------------------------------------------


    // Ask the server if Todo library should be enabled | Begin
    private requestIfUserLibraryIsEnabled(): Observable<boolean> {
        return new Observable(observer => { true });  // Later down the line, this will be replaced with a call to the API
    }
    private async libEnabled(): Promise<boolean> {
        return await firstValueFrom(this.requestIfUserLibraryIsEnabled());
    }
    //
    //


    // -----------------------------------------------------------------------------------------------------
    // @ Todo Library Global Controller | Ends
    // -----------------------------------------------------------------------------------------------------


    //
    // Give a friendly hello to the public
    public sayHello(){
        if (this.libraryEnabled) {
            console.log('Hello from the Todo library');
        }
    }

    private generateRandomString(length: number): string {
      const randomBytes = new Uint8Array(length);
      window.crypto.getRandomValues(randomBytes);
      const hexString = Array.from(randomBytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      return hexString;
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Todo Library Data Information | Begins
    // -----------------------------------------------------------------------------------------------------

    // Get Todo List | Begin
    private callApiForGetToDoList(): Observable<any> {
        console.log(this.apiBaseUrl +'todo')
        return this.http.get(this.apiBaseUrl +'todo');
    }
    public async getToDoList(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const call = await firstValueFrom(this.callApiForGetToDoList()).catch(err => {
                if (isDevMode())console.log("[ Todo library Service ] - Get Todo List Error");
                if (isDevMode())console.log("\n\t Is the server running? \t(-_____-)\n\nDiagnostics: \n.\n.\n.\n");
                if(isDevMode())console.log(err);
                return reject(err); // we can probably do something better here
            });
            return resolve(call);
        }).catch(err => {
          return []; // if there is an error, return an empty array
        });
    }
    /**
     * Function will get the list of todos from the system
     */
    public async getToDoListStrict(): Promise<any> {
        return await this.getToDoList();
    }



    // Patch Update Todo | Begin
    private callApiForPatchUpdateTodo(id:string, data:any, subtask:boolean = false): Observable<any> {
      if(subtask){
        return this.http.patch(this.apiBaseUrl +'todo/subtasks/'+id, data);
      }else{
        return this.http.patch(this.apiBaseUrl +'todo/'+id, data);
      }
    }
    public async patchUpdateTodo(id:string, data:any, subtask:boolean = false): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const call = await firstValueFrom(this.callApiForPatchUpdateTodo(id, data, subtask)).catch(err => {
                if (isDevMode())console.log("[ Todo library Service ] - Update Todo Error");
                if(isDevMode())console.log(err);
                return reject(err);
            });
            return resolve(call);
        }).catch(err => {
          return []; // if there is an error, return an empty array
        });
    }
    /**
     * Function will update the todo in the system
     */
    public async patchUpdateTodoStrict(id:string, data:any, subtask:boolean = false): Promise<any> {
        return await this.patchUpdateTodo(id, data, subtask);
    }
    //
    //

    // Put Update Todo | Begin
    private callApiForUpdateTodo(id:string, data:any, subtask:boolean =false): Observable<any> {
      if(subtask){
        return this.http.put(this.apiBaseUrl +'todo/subtasks/update/'+id, data);
      }else{
        return this.http.put(this.apiBaseUrl +'todo/update/'+id, data);
      }
    }
    public async updateTodo(id:string, data:any, subtask:boolean =false): Promise<any> {
      return new Promise(async (resolve, reject) => {
        const call = await firstValueFrom(this.callApiForUpdateTodo(id, data, subtask)).catch(err => {
          if (isDevMode())console.log("[ Todo library Service ] - Put Update Todo Error");
          if(isDevMode())console.log(err);
          return reject(err);
        });
        return resolve(call);
      }).catch(err => {
        return []; // if there is an error, return an empty array
      });
    }
    /**
     * Function will put update a todo in the system
     */
    public async updateTodoStrict(id:string, data:any, subtask:boolean =false): Promise<any> {
      return await this.updateTodo(id, data, subtask);
    }
    //
    //


    // Create Todo | Begin
    private callApiForCreateTodo(data:any,id?:string): Observable<any> {
        if(id){
          // this is a subtask
          return this.http.post(this.apiBaseUrl +'todo/subtasks/add/'+id, data);
        }else{
          // this is a todo
          return this.http.post(this.apiBaseUrl +'todo/add', data);
        }
    }
    public async createTodo(data:any,id?:string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            // lets latch on the todoid and add it to the data
            data.todoid = this.generateRandomString(12);
            const call = await firstValueFrom(this.callApiForCreateTodo(data,id)).catch(err => {
                if (id == null && isDevMode())console.log("[ Todo library Service ] - Create Todo Error");
                if (id && isDevMode())console.log("[ Todo library Service ] - Create Subtask Error");

                if(isDevMode())console.log(err);
                return reject(err);
            });
            return resolve(call);
        }).catch(err => {
          return []; // if there is an error, return an empty array
        });
    }
    /**
     * Function will create a todo in the system
     */
    public async createTodoStrict(data:any,id?:string): Promise<any> {
        return await this.createTodo(data,id);
    }
    //
    //


    // Delete Todo | Begin
    private callApiForDeleteTodo(id:string,subtask:boolean=false): Observable<any> {
      if(subtask){
        return this.http.delete(this.apiBaseUrl +'todo/subtasks/delete/'+id);
      }else{
        return this.http.delete(this.apiBaseUrl +'todo/delete/'+id);
      }
    }
    public async deleteTodo(id:string,subtask:boolean=false): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const call = await firstValueFrom(this.callApiForDeleteTodo(id,subtask)).catch(err => {
                if (!subtask && isDevMode())console.log("[ Todo library Service ] - Delete Todo Error");
                if (subtask && isDevMode())console.log("[ Todo library Service ] - Delete Subtask Error");
                if(isDevMode())console.log(err);
                return reject(err);
            });
            return resolve(call);
        }).catch(err => {
          return []; // if there is an error, return an empty array
        });
    }
    /**
     * Function will delete a todo in the system
     */
    public async deleteTodoStrict(id:string,subtask:boolean=false): Promise<any> {
        return await this.deleteTodo(id,subtask);
    }
    //
    //



    // -----------------------------------------------------------------------------------------------------


}

