import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  isLoadingStates = true;
  isOpenForm = false;
  editId;
  isAddForm = false;

  constructor(
    private stateService: StateService,
    private answerService: AnswerService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.isLoadingStates = true;
    this.stateService
      .getAllStates()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        this.states = res;
        this.isLoadingStates = false;
        console.log(this.states);
      });
  }

  editState(state) {
    if (this.isOpenForm && state.id === this.editId) {
      this.isOpenForm = false;
      return;
    }
    if (this.isOpenForm && state.id !== this.editId) {
      this.editId = state.id;
      return;
    }
    if (!this.isOpenForm) {
      this.isOpenForm = true;
      this.editId = state.id;
    }
  }

  deleteState(state) {
    console.log(state);
    this.stateService
      .deleteState(state.id)
      .pipe(
        takeUntil(this.unsubscribe$),
        mergeMap((res) => {
          this.isLoadingStates = true;
          this.snackBar.open('Запись успешно удалена!', '', { duration: 3000 });
          return this.stateService.getAllStates();
        })
      )
      .subscribe((res) => {
        this.isLoadingStates = false;
        this.states = res;
      });
  }

  addState() {
    this.isAddForm = !this.isAddForm;
  }

  onSubmit(event) {
    if (event) {
      this.isAddForm = false;
      this.snackBar.open('Запись успешно добавлена!', '', { duration: 3000 });
    } else {
      this.snackBar.open('Запись успешно изменена!', '', { duration: 3000 });
      this.isOpenForm = false;
    }
    this.isLoadingStates = true;
    this.stateService
      .getAllStates()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        this.isLoadingStates = false;
        this.states = res;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
