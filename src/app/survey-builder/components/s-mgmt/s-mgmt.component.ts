import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {ExportComponent} from '../export/export.component';
import {InfoService} from '../../services/info.service';

@Component({
  selector: 'app-s-mgmt',
  templateUrl: './s-mgmt.component.html',
  styleUrls: ['./s-mgmt.component.css'],
  providers: [ExportComponent]
})
export class SMgmtComponent implements OnInit {
  //#region properties
  surveyList: any[] = [];
  questionList: any[] = [];
  showAUBox = false;
  curTitle: any = null;
  curSurveyInfo: any = null;
  topForm: UntypedFormGroup;
  AUForm: UntypedFormGroup;
  allQuestionList: any[] = []; // 全部题目集
  //#endregion

  //#region contructors and lifecycle hooks
  constructor(private infoService: InfoService, private fb: UntypedFormBuilder, private exportComponent: ExportComponent) {
    this.topForm = this.fb.group({
      startDate: [null],
      endDate: [null],
      isExpired: [null],
      creator: [null]
    });

    this.AUForm = this.fb.group({
      title: [null, Validators.required],
      surveyDescription: [null, Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      creator: [null, Validators.required],
      isExpired: ['N'],
      isVisible: ['Y']
    });    
  }

  ngOnInit(): void {
    const timer = setInterval(() => {
      if (localStorage.getItem('token')) {
        clearInterval(timer);
        this.viewMyQuestions(); // Retrieve all questions of the user
        this.getOwnSurveys();   // Retrieve all surveys of the user
      }
    }, 500);
  }
  //#endregion


//#region CRUD

  //#region add a survey
  addSurvey() {
    this.curTitle = "Add";
    this.showAUBox = true;
  }
  //#endregion

  //#region update a survey
  updateSurvey(survey: any, e: any) {
    if(e) e.preventDefault();

    this.curSurveyInfo = survey;
    this.AUForm.patchValue({
      title: survey.title,
      surveyDescription: survey.surveyDescription,
      startDate: survey.startDate ? new Date(survey.startDate) : null,
      endDate: survey.endDate ? new Date(survey.endDate) : null,
      creator: survey.creator,
      isExpired: survey.isExpired,
      isVisible: survey.isVisible
    });
    if(survey.questions && survey.questions.length !== 0) {
      this.allQuestionList.map((item: any) => {
        if(survey.questions.filter((a: any) => a._id === item._id).length > 0)
          item.isSelected = true;
        else
          item.isSelected = false;
        return item;
      });
    }
    this.curTitle = "Update";
    this.showAUBox = true;
  }

  //#region toggle visibility of a survey
  toggleVisibility(survey: any, e: any) {
    e.preventDefault();
    this.AUForm.patchValue({isVisible: survey.isVisible === 'Y' ? 'N' : 'Y'});
  }
  //#endregion

  //#endregion

  //#region delete a survey
  deleteSurvey(survey: any, e: any) {
    if(e) e.preventDefault();
    this.infoService.deleteSurvey(survey._id).subscribe(res => {
      this.getOwnSurveys();
      this.topForm.reset();
      this.questionList = [];
    }, err => {
      console.log(err);
    });
  }
  //#endregion

  //#region get questions and surveys
  private viewMyQuestions() {
    this.allQuestionList = [];
    this.infoService.viewMyQuestions().subscribe({
      next: res => {
        if(res) this.allQuestionList = this.recombineQuestion(res.questions);
      },
      error: err => console.error(err)
    });
  }

  //Retrieve all surveys of the user
  private getOwnSurveys() {
    this.infoService.getOwnSurveys().subscribe({
      next: res => {
        this.surveyList = res.map((survey: any) => {
          survey.isExpired = survey.isExpired ? 'Y' : 'N';
          survey.isVisible = survey.isVisible ? 'Y' : 'N';
          survey.chosen = false;
          if(survey.questions)
            survey.questions = this.recombineQuestion(survey.questions);
          return survey;
        });
        this.chooseSurvey(this.surveyList[0]);    // default: choose the first survey
      },
      error: err => console.error(err)
    });
  }
//#endregion

  //#region export statistics
  export() {
    this.infoService.getStatistics().subscribe({
      next: res => {
        if(res){
          const header: any = {
            grossNumberOfYourSurveys: 'grossNumberOfYourSurveys',
            grossNumberOfResponses: 'grossNumberOfResponses',
            grossNumberOfQuestions: 'grossNumberOfQuestions',
            numberOfResponsesTotal: 'numberOfResponsesOfYourSurveys',
            averageScoresTotal: 'averageScoresOfYourSurveys',
          };
          const data: any = {};
          data.grossNumberOfYourSurveys = res.grossNumberOfYourSurveys;
          data.grossNumberOfResponses = res.grossNumberOfResponses;
          data.grossNumberOfQuestions = res.grossNumberOfQuestions;
          let aa: any[] = [];
          let bb: any[] = [];
          if(res.numberOfResponsesOfYourSurveys) {
            res.numberOfResponsesOfYourSurveys.map((survey: any) => {
              aa.push(survey.title + ';Questions:' + survey.numberOfQuestions + ';Responses:' + survey.numberOfResponses);
              return survey;
            });
          }
          if(res.averageScoresOfYourSurveys) {
            res.averageScoresOfYourSurveys.map((survey: any) => {
              bb.push(survey.title + ';averageScore:' + survey.averageScore);
              return survey;
            });
          }
          data.numberOfResponsesTotal = aa.join('.');
          data.averageScoresTotal = bb.join('.');
          console.log(data);
          const newdata = this.updateExcelData(header, Object.keys(header), [data]);

          // Modify the header and data of the excel file
          const excelData: any[][] = [];
          excelData.splice(0, excelData.length, ...newdata);
          this.exportComponent.downloadExcel(excelData, 'StatisticData-%s.xlsx');
        }
      },
      error: err => console.error(err)
    });
  }

  private updateExcelData(header: any, selected: any[], data: any[]) {
    const newdata = [
      selected.map((k: any) => header[k])
    ].concat(
      data.map(d => selected.map(k => d[k]))
    );
    newdata.map((d, i) => d.unshift(i > 0 ? i : 'No.'));
    return newdata;
  }
  //#endregion

  //#region utility methods
  chooseSurvey(item: any) {
    this.topForm.reset();
    this.questionList = [];

    this.surveyList.map(survey => {
      // console.log(survey);  //for debugging
      if (survey._id === item._id) {
        survey.chosen = true;
        this.questionList = survey.questions;
        this.topForm.patchValue({
          startDate: this.formatDateToYMD(survey.startDate),
          endDate: this.formatDateToYMD(survey.endDate),
          creator: survey.creator,
          isExpired: survey.isExpired
        });
      } else
        survey.chosen = false;
      return survey;
    });
  }

  private recombineQuestion(res: any) {
    const data = res.map((item: any) => {
      const choicesArr: any[] = [];
      let choiceAnswer = "";
      if (item.questionType === 'MCQ') {
        item.choices.map((choice: any) => {
          choicesArr.push(choice.choiceText);
          if (choice.correctAnswer) {
            choiceAnswer = choice.choiceText;
          }
          return choice;
        });
        item.choicesArr = choicesArr;
        item.choiceAnswer = choiceAnswer;
      } else {
        if (item.isCorrect) {
          item.isCorrect = "True";
        } else {
          item.isCorrect = "False";
        }
      }
      item.isSelected = false;
      return item;
    });
    return data;
  }

  private formatDateToYMD(date: any) {
    date = new Date(date);
    const year = date.getFullYear();
    let month = (date.getMonth() + 1).toString();
    let day = (date.getDate()).toString();
    if(month.length === 1) month = '0' + month;
    if(day.length === 1) day = '0' + day;
    return year + '-' + month + '-' + day;
  }
  //#endregion

  //#region handlers
  handleAddCancel() {
    this.showAUBox = false;
  }

  handleAddOk() {
    const value = this.AUForm.value;
    // Retrieve the selected questions
    let newSurveyQuestionIds: any[] = [];
    this.allQuestionList.map((item: any) => {
      if(item.isSelected) newSurveyQuestionIds.push(item._id);
      return item;
    });
    if(this.curTitle === 'Add') {
      const newdata = {
        title: value.title,
        description: value.surveyDescription,
        startDate: this.formatDateToYMD(value.startDate),
        endDate: this.formatDateToYMD(value.endDate),
        questionIds: newSurveyQuestionIds
      }
      this.infoService.createSurvey(newdata).subscribe({
        next: res => {
          // refresh the survey list
          this.getOwnSurveys();
          this.showAUBox = false;
        },
        error: err => console.error(err)
      })
    } else if(this.curTitle === 'Update') {
      const updatedata = {
        title: value.title,
        description: value.surveyDescription,
        startDate: this.formatDateToYMD(value.startDate),
        endDate: this.formatDateToYMD(value.endDate),
        questionIds: newSurveyQuestionIds
      }
      this.infoService.updateSurvey(this.curSurveyInfo._id, updatedata).subscribe({
        next: res => {
          // refresh the survey list
          this.getOwnSurveys();
          this.showAUBox = false;
        },
        error: err => console.error(err)
      })
    }
  }
  //#endregion
}