import {animate, state, style, transition, trigger} from '@angular/animations';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SimpleSplashScreenService } from './services/splash-screen/splash-screen.service';
import { Component, Inject, OnInit } from '@angular/core';
import { TodoModalComponent } from "./components/modal/todo.component";
import { TodoLibService } from "./lib/lib-todo";
import { Todo, TodoParent } from "./models/todo";
import { heroUsers } from '@ng-icons/heroicons/outline';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('.7s cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    ],
})
export class AppComponent implements OnInit {

  expandedElement = true;
  todoList={
    columns: [ "name", "task", "actions" ],
    columnsExpand: [ "name", "task", "actions", "add", "expand" ],
    data: [] as Todo[]
  };

  // TODO : Add in the _component object property to this Component

  private _weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']


  get weekdays() {
    return this._weekdays;
  }

  constructor(
    private _dialog: MatDialog,
    private _sp: SimpleSplashScreenService,
    private _todos:TodoLibService,
  ) {

    this.init();
  }

  ngOnInit(): void {

  }
  async init(){
    this._sp.show();
    this.todoList.data = await this. _todos.getToDoListStrict() as Todo[];
    console.log(this.todoList.data);
    // lets sort the data by completed
    this.todoList.data.sort(this.tool_dynamicSort("completed"));
    // lets also sort the subtasks of every todo by completed
    this.todoList.data.forEach(todo=> {
      if(todo['subtasks']['data']){
        todo['subtasks']['data'].sort(this.tool_dynamicSort("name"));
        todo['subtasks']['data'].sort(this.tool_dynamicSort("completed"));
      }
    });
    this._sp.hide();
  }


  /*
  To perform a ordered sort, ie you want to sort by name and date..
  first you do the date and then name field
   examples :
   tool_dynamicSort("completed"))
   tool_dynamicSort("-completed")) // reverse the sort
   */
  private tool_dynamicSort(property){
    var sortOrder = 1;
    if(property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a,b) {
      /* next line works with strings and numbers,
       * and you may want to customize it to your needs
       */
      var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    }
  }

  async taskChanged(data:Todo){
    data.completed = !data.completed;
    // check type of data.id
    await this._todos.patchUpdateTodoStrict(
      (typeof data.id =='string'? data.id : data.todoid),
      data,
      (typeof data.id =='string')).then(result => {
      console.log(result);
      // remove the old one
      this.todoList.data = this.todoList.data.filter(item => item['todoid'] != result['todoid']);
      // add the new one
      this.todoList.data = [ ].concat(this.todoList.data).concat(result);
    });
  }

  private preventShuffleUpdate(event:string,data:any){

    // take inventory of the old one
    let foundem = 0;
    this.todoList.data.forEach((item, count) => {
      item['index'] = count;
      if(item['todoid'] == data['todoid']){
        foundem = count;
      }
    });
    let dontbotherMoving = (foundem == 0 || foundem == this.todoList.data.length - 1);

    if(event == 'delete'){

      // remove the old one
      this.todoList.data = this.todoList.data.filter(item => item['todoid'] != data['todoid']);
      if(dontbotherMoving){
        this.todoList.data = [ ].concat(data).concat(this.todoList.data);
        return;
      }
      this.todoList.data = [ ].concat().concat(this.todoList.data);
      // add the new one
      // set the new one back into the old one's place
      let newItem = this.todoList.data;
      this.todoList.data = [];
      newItem.forEach((item, count) => {
        if(count == foundem){
          data.delete = true;
          this.todoList.data.push(data);
        }else{
          this.todoList.data.push(item);
        }
      });
      return;
    }

    if(event == 'save' || event == 'update'){
      if(event == 'save')data.new = true;
      if(event == 'update')data.edit = true;
      console.log(data);
      // take inventory of the old one
      // remove the old one
      this.todoList.data = this.todoList.data.filter(item => item['todoid'] != data['todoid']);
      if(dontbotherMoving){
        if(foundem == 0){
          this.todoList.data = [ ].concat(data).concat(this.todoList.data);
        }else{
          this.todoList.data = [ ].concat(this.todoList.data).concat(data);
        }
        return;
      }
      this.todoList.data = [ ].concat().concat(this.todoList.data);
      // add the new one
      // set the new one back into the old one's place
      let newItem = this.todoList.data;
      this.todoList.data = [];
      newItem.forEach((item, count) => {
        if(count == foundem){
          this.todoList.data.push(data);
          this.todoList.data.push(item);
        }else{
          this.todoList.data.push(item);
        }
      });
      return;
    }

  }



  openTodo(str:string,data?:Todo){
    const dialogConfig = new MatDialogConfig<any>();
    switch (str) {
      case 'new':
        dialogConfig.data = {
          selection:"new",
          editData: data || {}
        };
        const createDialog = this._dialog.open(TodoModalComponent, dialogConfig);
        createDialog.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result.event}`);
          if(result.event == 'save'){
            result.data.new = true;
            this.todoList.data = [ ].concat(result.data).concat(this.todoList.data);
          }
        });
        break;
      case 'edit':
        console.log("edit");
        dialogConfig.data = {
          selection:"edit",
          editData: data || {}
        };
        const editDialog = this._dialog.open(TodoModalComponent, dialogConfig);
        editDialog.afterClosed().subscribe(async result => {
          console.log(`Dialog result: ${result.event}`);
          //
          if(result.event == 'updated'){
            await this.preventShuffleUpdate('update',result.data);
          }
        });
        break;
      case 'subtask':
        console.log("subtask-create");
        dialogConfig.data = {
          selection:"subtask-create",
          editData: data || {}
        };
        const subTaskDialog = this._dialog.open(TodoModalComponent, dialogConfig);
        subTaskDialog.afterClosed().subscribe(async result => {
          console.log(`Dialog result: ${result.event}`);

          if(result.event == 'save'){
            await this.preventShuffleUpdate('save',result.data);
          }
        });
        break;
      case 'subtask-edit':
        console.log("subtask-edit");
        dialogConfig.data = {
          selection:"subtask-edit",
          editData: data || {}
        };
        const subTaskEditDialog = this._dialog.open(TodoModalComponent, dialogConfig);
        subTaskEditDialog.afterClosed().subscribe(async result => {
          console.log(`Dialog result: ${result.event}`);

          if(result.event == 'updated'){
            await this.preventShuffleUpdate('update',result.data);
          }
        });
        break;
      default:
        console.log("No dialog exists for query")
    }

  }


  async delete(select:string, id:string, data?:any){
    // the parent element is what will always be data passed in for animation purposes
    if(data){
      await this.preventShuffleUpdate('delete',data);
    }

    if(select == 'todo'){
      let result = await this._todos.deleteTodoStrict(id);
      console.log(result);
      if(result){
        this.todoList.data = this.todoList.data.filter(item => item['todoid'] != id);
      }
    }else if(select == 'subtask'){
      let result = await this._todos.deleteTodoStrict(id,true);
      console.log(result);
      // here we want to remove replace the parent todo with the new one
      if(result){
        this.todoList.data = this.todoList.data.filter(item => item['todoid'] != result.todoid);
        this.todoList.data = [ ].concat(result).concat(this.todoList.data);
      }

      console.log(id)
    }else{
      console.error("Dont recognize your command.");
    }
  }
}
