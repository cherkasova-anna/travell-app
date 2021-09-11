export class State {
  public id: number;
  public text: string;
  public isFirst: boolean;
  public isEnd: boolean;
  public explanation: string;

  constructor() {
    this.id = 0;
    this.text = '';
    this.isFirst = false;
    this.isEnd =false;
    this.explanation = '';
  }
}
