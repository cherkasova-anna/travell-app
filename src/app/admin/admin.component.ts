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
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  providers: [StateService, AnswerService],
})
export class AdminComponent implements OnInit, OnDestroy {

  unsubscribe$: Subject<void> = new Subject<void>();
  states: State[] = [];
  columnsToDisplay = ['id', 'text']

  constructor(
    private stateService: StateService,
    private answerService: AnswerService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.stateService.getAllStates().subscribe((res) => {
      this.states = res;
      console.log(this.states)
    })
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
