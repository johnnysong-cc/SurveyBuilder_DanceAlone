import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import {InfoService} from '../../services/info.service';

@Component({
  selector: 'app-s-answer',
  templateUrl: './s-answer.component.html',
  styleUrls: ['./s-answer.component.css']
})
export class SAnswerComponent implements OnInit, OnChanges {
  //#region Properties
  @Input()
  flag: any;
  surveyList: any[] = [];
  curSurvey: any = null;
  topForm: UntypedFormGroup;
  questionList: any[] = []; // quesions of a survey
  //#endregion

  //#region constructor and lifecycle hooks
  constructor (private fb: UntypedFormBuilder, private infoService: InfoService) {
    this.topForm = this.fb.group({
      startDate: [null],
      endDate: [null],
      isExpired: [null],
      creator: [null]
    });
  }

  ngOnInit (): void {}

  // retrieve surveys on changes
  ngOnChanges(changes: SimpleChanges): void {
    if(changes && changes['flag'] && this.flag){
      // Registered user
      if(this.flag==='1'){
        const timer = setInterval(() => {
          if(localStorage.getItem('token')){
            clearInterval(timer);
            this.getOwnSurveys();
          }}
          ,500);
      }
      // Anonymous user
      else if(this.flag === '2'){
        this.getAllVisibleSurvey();
      }
    }
  }
  //#endregion

//#region CRUD

  //#region Retrieve surveys owned by the current user
  private getOwnSurveys(): void{
    this.infoService.getOwnSurveys().subscribe({
      next: (res: any) => {
        this.surveyList = res.map((survey:any)=>{
          survey.isExpired = survey.isExpired ? "Y" : "N";
          survey.isVisible = survey.isVisible ? "Y" : "N";
          survey.chosen = false;
          if(survey.questions)
            survey.questions = this.recombineQuestion(survey.questions);
          if(survey.responses && survey.responses.length !== 0)
            survey.hasFinished = true;
          else
            survey.hasFinished = false;
          return survey;
        });
        this.chooseSurvey(this.surveyList[0]); // select the first survey by default
      },
      error: (err: any) => console.error(err),
    });
  }
  //#endregion

  //#region Retrieve all visible surveys
  private getAllVisibleSurvey(): void{
    this.infoService.getAllVisibleSurvey().subscribe({
      next: (res: any) => {
        this.surveyList = res.map((survey:any)=>{
          survey.isExpired = survey.isExpired ? "Y" : "N";
          survey.isVisible = survey.isVisible ? "Y" : "N";
          survey.chosen = false;
          if(survey.questions)
            survey.questions = this.recombineQuestion(survey.questions);
          if(survey.responses && survey.responses.length !== 0)
            survey.hasFinished = true;
          else
            survey.hasFinished = false;
          return survey;
        });
        this.chooseSurvey(this.surveyList[0]); // select the first survey by default
      },
      error: (err: any) => console.error(err),
    });
  }
  //#endregion
  
//#endregion

  //#region utility methods

  /**
   * Choose a survey
   */
  chooseSurvey(survey: any): void{
    /**
     * reset(): Resets the FormGroup by marking all descendants pristine and untouched
     *   sets the value of all descendants to defaults, or null if no defaults provided
     */
    this.topForm.reset(); 
    this.questionList = [];
    this.surveyList.map((s:any)=>{
      if(s._id === survey._id){
        this.curSurvey = s;
        s.chosen = true;
        this.questionList = s.questions;
        this.topForm.patchValue({
          startDate: s.startDate,
          endDate: s.endDate,
          creator: s.creator,
          isExpired: s.isExpired
        });
      }else
        s.chosen = false;
      return s;
    });
  }

  /**
   * Recombine questions
   */
  private recombineQuestion(result:any){
    const data = result.map((q:any)=>{
      const choicesArr:any[] = [];
      let choiceAnswer = "";
      if(q.questionType ==='MCQ'){
        q.choices.map((c:any)=>{
          choicesArr.push(c.choiceText);
          if(c.isAnswer) choiceAnswer = c.choiceText;
          return c;
        });
        q.choicesArr = choicesArr;
        q.choiceAnswer = null;
      }else if(q.questionType==='TFQ'){
        q.isCorrect = null;
      }
      q.isSelected = false;
      return q;
    });
    return data;
  }

  /**
   * Submit the survey
   */
  submitSurvey(): void{
    if(this.curSurvey) {
      const useranswers: any[] = [];
      this.curSurvey.questions.map((question: any) => {
        if (question.questionType === 'MCQ') {
          question.choicesArr.map((choice: any, index: number) => {
            if (question.choiceAnswer === choice) {
              useranswers.push(index);
            }
            return choice;
          });
        } else {
          console.log(question);
          if(question.isCorrect === 'True')
            useranswers.push(1);
          else
            useranswers.push(0);
        }
        return question;
      });
      console.log(useranswers);

      this.infoService.answerSurvey(this.curSurvey._id, useranswers).subscribe({
        next: (res: any) => this.getOwnSurveys(),
        error: (err: any) => console.error(err),
      });
    }
  }
  //#endregion
}