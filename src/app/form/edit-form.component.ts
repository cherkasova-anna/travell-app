import {
  Component,
  Input,
  OnInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Answer } from '../shared/models/answer.model';
import { State } from '../shared/models/state.model';
import { AnswerService } from '../shared/services/answer.service';
import { StateService } from '../shared/services/state.service';

@Component({
  selector: 'edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.scss'],
})
export class EditFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  state: State;
  @Input()
  isAdd: boolean;
  answers = [];
  isEnd = false;
  editForm: FormGroup;
  @Output()
  onSubmitForm: EventEmitter<boolean> = new EventEmitter();

  unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private answerService: AnswerService,
    private stateService: StateService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['state'] && changes['state'].currentValue) {
      this.isEnd = this.state.isEnd;
      this.answerService
        .getAnswerList(this.state.id)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((res) => {
          this.answers = res;
          let answers = this.answers.map(
            (value) =>
              new FormGroup({
                answer: new FormControl(value.text),
                to: new FormControl(value.idTo),
              })
          );
          console.log(answers);
          this.editForm = new FormGroup({
            type: new FormControl(this.state?.isEnd),
            text: new FormControl(this.state?.text),
            answers: new FormArray(answers),
            explanation: new FormControl(this.state?.explanation),
          });
        });
    }
    if (changes && changes['isAdd'] && changes['isAdd'].currentValue) {
      this.state = new State();
      this.isEnd = this.state.isEnd;
      this.editForm = new FormGroup({
        type: new FormControl(this.state?.isEnd),
        text: new FormControl(this.state?.text),
        answers: new FormArray([]),
        explanation: new FormControl(this.state?.explanation),
      });
    }
  }

  ngOnInit() {}

  onChangeType(event) {
    this.isEnd = event.value;
  }

  addAnswer() {
    (<FormArray>this.editForm.controls['answers']).push(
      new FormGroup({
        answer: new FormControl(''),
        to: new FormControl(''),
      })
    );
    this.answers.push(new Answer());
  }

  onSubmit() {
    let answers = [];
    this.editForm.value.answers.forEach((element) => {
      answers.push({
        text: element.answer,
        idFrom: this.state && this.state.id ? this.state.id : 0,
        idTo: element.to,
      });
    });
    answers = this.isEnd ? [] : answers;
    let state = {
      id: this.state && this.state.id ? this.state.id : 0,
      text: this.editForm.value.text,
      isFirst: false,
      isEnd: this.editForm.value.type,
      explanation: this.editForm.value.explanation,
      answers: answers,
    };
    state.answers.forEach((element) => {
      element.idFrom = +element.idFrom;
      element.idTO = +element.idTo;
    });
    if (this.isAdd) {
      this.stateService
        .addState(state)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((res) => {
          console.log(res);
          this.onSubmitForm.emit(true);
        });
    } else {
      this.stateService
        .updateState(state)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((res) => {
          console.log(res);
          this.onSubmitForm.emit(false);
        });
    }
  }

  deleteAnswer(index) {
    this.answers.splice(index, 1);
    (<FormArray>this.editForm.controls['answers']).value.splice(index, 1);
    console.log(this.answers);
    console.log(this.editForm)
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
