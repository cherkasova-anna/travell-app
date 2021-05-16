import { Component, OnDestroy, OnInit } from '@angular/core';
import { of, Subject } from 'rxjs';
import { takeUntil, mergeMap } from 'rxjs/operators';
import { Answer } from '../shared/models/answer.model';
import { State } from '../shared/models/state.model';
import { AnswerService } from '../shared/services/answer.service';
import { StateService } from '../shared/services/state.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  providers: [StateService, AnswerService],
})
export class LayoutComponent implements OnInit, OnDestroy {
  public question: State;
  public answers: Answer[] = [];

  private unsubscribe$: Subject<void> = new Subject();
  constructor(
    private stateService: StateService,
    private answerService: AnswerService
  ) {}

  ngOnInit(): void {
    this.stateService
      .getFirstState()
      .pipe(
        takeUntil(this.unsubscribe$),
        mergeMap((res) => {
          this.question = res;
          if (this.question) {
            return this.answerService.getAnswerList(this.question.id);
          } else {
            return of([]);
          }
        })
      )
      .subscribe(
        (res) => {
          this.answers = res;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  select(answer: Answer) {
    this.stateService
      .getState(answer.idTo)
      .pipe(
        takeUntil(this.unsubscribe$),
        mergeMap((res) => {
          this.question = res;
          if (this.question) {
            return this.answerService.getAnswerList(this.question.id);
          } else {
            return of([]);
          }
        })
      )
      .subscribe(
        (res) => {
          this.answers = res;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
