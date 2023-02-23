export interface Todo{
  id: object | string;
  name: string;
  task: string;
  todoid: string;
  completed: boolean;
  time: string;
}
export interface TodoParent{
  id: object | string;
  todoid: string;
  name: string;
  completed: boolean;
  task: string;
  subtasks: SubTasks[];
}
export interface SubTasks{
  data: Todo[];
  columns: string[];
}
