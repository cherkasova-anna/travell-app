export class Answer {
  public id: number;
  public text: string;
  public idFrom: number;
  public idTo: number;

  constructor(){
    this.id = 0;
    this.text = '';
    this.idFrom = null;
    this.idTo = null;
  }
}
