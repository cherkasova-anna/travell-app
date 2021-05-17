import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { of, Subject } from 'rxjs';
import { takeUntil, mergeMap } from 'rxjs/operators';
import { HintComponent } from '../hint/hint.component';
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
  public prevId: number[] = [];
  public isLoading = false;
  public isEnd = false;

  private unsubscribe$: Subject<void> = new Subject();
  constructor(
    private stateService: StateService,
    private answerService: AnswerService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.stateService
      .getFirstState()
      .pipe(
        takeUntil(this.unsubscribe$),
        mergeMap((res) => {
          this.question = res;
          this.isLoading = true;
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
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
          console.log(error);
        }
      );
  }

  select(id: number) {
    this.stateService
      .getState(id)
      .pipe(
        takeUntil(this.unsubscribe$),
        mergeMap((res) => {
          this.prevId.push(this.question.id);
          console.log(this.prevId);
          this.question = res;
          this.isLoading = true;
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
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
          console.log(error);
        }
      );
  }

  back() {
    this.stateService
      .getState(this.prevId.pop())
      .pipe(
        takeUntil(this.unsubscribe$),
        mergeMap((res) => {
          this.question = res;
          this.isLoading = true;
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
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
          console.log(error);
        }
      );
  }

  viewHint() {
    this.dialog.open(HintComponent, {
      data: {
        state: this.question.id,
      },
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
