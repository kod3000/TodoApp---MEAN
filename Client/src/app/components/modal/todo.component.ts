import { ChangeDetectionStrategy, Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { kodAnimations } from 'src/app/services/animations';
import { TodoLibService } from '../../lib/lib-todo';


@Component({
  selector: 'modal-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  animations   : kodAnimations
})

export class TodoModalComponent implements OnInit {

  todoFormGroup: UntypedFormGroup;

  showAlert : boolean = false;


  public _mydata: any;
  public dataReady: boolean = false;
  public buttonSubmit = false;

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _dialogRef: MatDialogRef<TodoModalComponent>,
    private _todo:TodoLibService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {

    this._mydata = this.data;
    console.log(this._mydata);
    this.dataReady = true;

    if(this._mydata.selection != 'subtask-create'){
    this.todoFormGroup = this._formBuilder.group({
      name: [ this._mydata.editData.name || ''],
      task: [ this._mydata.editData.task || ''],
    });
    }else{
    this.todoFormGroup = this._formBuilder.group({
      name: [ ''],
      task: [ ''],
    });
  }
  }

  closeModal(status?:object) {
    if(status){
      this._dialogRef.close(status);
    }else{
      this._dialogRef.close();
    }
  }

  handleError(error:string) {
    let errorLimit = 255;
    if(error.length > errorLimit)error = error.substring(0,errorLimit) + '...';
    this.showAlert = true;
  }

  async submit(){

    if(this.todoFormGroup.invalid){
      this.handleError('Please fill out all fields');
      return;
    }
    this.buttonSubmit = true;

    if(this._mydata.selection == 'new'){
      await this._todo.createTodoStrict(this.todoFormGroup.value).then(result => {
        this.closeModal({event:'save',data:result});
      }).catch(err => {
        this.handleError(err.error);
      })
    }else if(this._mydata.selection == 'edit'){
      // make sure to update the values of the form group
      this._mydata.editData.name = this.todoFormGroup.value.name;
      this._mydata.editData.task = this.todoFormGroup.value.task;
      await this._todo.updateTodoStrict(this._mydata.editData.todoid, this._mydata.editData).then((result)=>{
        this.closeModal({event:'updated',data:result});
      }).catch((error)=>{
        this.handleError(error.error);
      })
    }else if(this._mydata.selection == 'subtask-create'){
      console.log("subtask-create");
      let subtask = {
        name: this.todoFormGroup.value.name,
        task: this.todoFormGroup.value.task,
        todoid: this._mydata.editData.todoid
      }
      await this._todo.createTodoStrict(subtask,this._mydata.editData.todoid).then((result)=>{
        this.closeModal({event:'save',data:result});
      }).catch((error)=>{
        this.handleError(error.error);
      })
    }else if(this._mydata.selection == 'subtask-edit'){
      console.log("subtask-edit");
      let subtask = {
        name: this.todoFormGroup.value.name,
        task: this.todoFormGroup.value.task,
        todoid: this._mydata.editData.todoid
      }
      await this._todo.updateTodoStrict(this._mydata.editData.id,subtask,true).then((result)=>{
        console.log(result);
        this.closeModal({event:'updated',data:result});
      }).catch((error)=>{
        this.handleError(error.error);
      })
    }
    this.buttonSubmit = false;

  }
}
