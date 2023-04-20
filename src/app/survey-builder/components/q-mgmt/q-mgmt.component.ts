import {Component, OnInit} from '@angular/core';
import {FormControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {InfoService} from '../../services/info.service';

@Component({
  selector: 'app-q-mgmt',
  templateUrl: './q-mgmt.component.html',
  styleUrls: ['./q-mgmt.component.css']
})
export class QMgmtComponent implements OnInit {
  //#region properties
  questionList: any;
  showAUBox = false;
  curTitle: any = null;
  curQuestionInfo: any;
  validateForm!: UntypedFormGroup;
  listOfControl: Array<{id: number; controlInstance: string}> = [];
  //#endregion

  //#region constructor and lifecycle hooks
  constructor (private fb: UntypedFormBuilder, private infoService: InfoService) {
    this.validateForm = this.fb.group({
      questionType: ["MCQ", [Validators.required]],
      questionText: [null, [Validators.required]],
      questionAnswer: [null, [Validators.required]]
    });
    this.addChoice(null);
  }

  ngOnInit(): void {
    const timer = setInterval(() => {
      if (localStorage.getItem('token')) {
        // console.log('token found'); // for debugging
        clearInterval(timer);
        this.viewMyQuestions();
      }
    }, 500);
  }
  //#endregion

//#region CRUD

  //#region Create a question
  addQuestion() {
    this.listOfControl = [];
    this.curTitle = 'Add';
    this.showAUBox = true;
  }

  addChoice($event: any) {
    console.log(111);
    if ($event) {
      $event.preventDefault();
    }
    const id = this.listOfControl.length > 0 ? this.listOfControl[this.listOfControl.length - 1].id + 1 : 0;
    const control = {
      id,
      controlInstance: `qChoice${id}`
    };
    const index = this.listOfControl.push(control);
    this.validateForm.addControl(
      this.listOfControl[index - 1].controlInstance,
      new UntypedFormControl(null, Validators.required)
    );
  }
  //#endregion

  //#region Update a question
  updateQuestion(question: any) {
    this.listOfControl = [];
    this.curTitle = 'Update';
    this.showAUBox = true;
    this.curQuestionInfo = question;
    /**
     * patchValue(): update multiple values of a form group at once
     */
    this.validateForm.patchValue({questionType: question.questionType});
    this.validateForm.patchValue({questionText: question.questionText});
    if(question.questionType === 'MCQ') {
      this.validateForm.patchValue({questionAnswer: question.choiceAnswer});
    } else if (question.questionType === 'TFQ') {
      this.validateForm.patchValue({questionAnswer: question.isCorrect});
    }
    if(question.choicesArr && question.choicesArr.length !== 0) {
      question.choicesArr.map((item: any, index: number) => {
        this.addChoice(null);
        const a = "qChoice" + index;
        this.validateForm.controls["qChoice" + index].patchValue(item);
        return item;
      });
    }
  }
  //#endregion

  //#region Delete a question
  removeChoice(i: {id: number; controlInstance: string}, e: MouseEvent) {
    e.preventDefault();
    if (this.listOfControl.length > 1) {
      const index = this.listOfControl.indexOf(i);
      this.listOfControl.splice(index, 1);
      this.validateForm.removeControl(i.controlInstance);
    }
  }
  
  deleteQuestion(item: any) {
    this.infoService.deleteQuestion(item._id).subscribe({
      next: res => this.viewMyQuestions(),
      error: err => console.error(err)
    });
  }
  //#endregion

  //#region Read all questions
  private viewMyQuestions() {
    this.questionList = [];
    this.infoService.viewMyQuestions().subscribe({
      next: res => {
        if(res) {
          this.questionList = res.questions.map((item: any) => {
            const choicesArr: any[] = [];
            let choiceAnswer = "";
            if(item.questionType === 'MCQ') {
              item.choices.map((choice: any) => {
                choicesArr.push(choice.choiceText);
                if(choice.correctAnswer) choiceAnswer = choice.choiceText;
                return choice;
              });
              item.choicesArr = choicesArr;
              item.choiceAnswer = choiceAnswer;
            } else {
              if(item.isCorrect) item.isCorrect = "True";
              else item.isCorrect = "False";
            }
            return item;
          });
        }
      },
      error: err => console.log(err)
    });
  }
  //#endregion
  
  //#region Handle form submission
  handleAddOk() {
    const questionType = this.validateForm.value.questionType;
    let choicesArr: any[] = [];

    this.listOfControl.map((control: any) => {
      if (this.validateForm.value[control.controlInstance] == this.validateForm.value.questionAnswer) {
        choicesArr.push({
          choiceText: this.validateForm.value[control.controlInstance],
          correctAnswer: true
        });
      } else {
        choicesArr.push({
          choiceText: this.validateForm.value[control.controlInstance],
          correctAnswer: false
        });
      }
      return control;
    });
    
    // Add
    if(this.curTitle === 'Add') {
      let newdata = {};
      if (questionType == 'MCQ') {
        newdata = {
          questionType: questionType,
          questionText: this.validateForm.value.questionText,
          choices: choicesArr,
          createdBy: JSON.parse(localStorage.getItem('user') || "{}")._id,
          isCorrect: false
        }
      } else if (questionType == 'TFQ') {
        newdata = {
          questionType: questionType,
          questionText: this.validateForm.value.questionText,
          choices: null,
          createdBy: JSON.parse(localStorage.getItem('user') || "{}")._id,
          isCorrect: (this.validateForm.value.questionAnswer === 'True') ? true : false
        }
      }
      // console.log(newdata);  // for debugging
      /**
       * Refresh the list of questions after adding a new question
       */
      this.infoService.createQuestion(newdata).subscribe({
        next: res => {
          this.viewMyQuestions();
          this.showAUBox = false;
        },
        error: err => console.error(err)
      });
    } 
    // Update
    else{
      let updatedata = {};
      if (questionType == 'MCQ') {
        updatedata = {
          questionType: questionType,
          questionText: this.validateForm.value.questionText,
          choices: choicesArr,
          createdBy: JSON.parse(localStorage.getItem('user') || "{}")._id,
          isCorrect: false
        }
      } else if (questionType == 'TFQ') {
        updatedata = {
          questionType: questionType,
          questionText: this.validateForm.value.questionText,
          choices: null,
          createdBy: JSON.parse(localStorage.getItem('user') || "{}")._id,
          isCorrect: (this.validateForm.value.questionAnswer === 'True') ? true : false
        }
      }
      // console.log(updatedata);  // for debugging
      /**
       * Refresh the list of questions after updating a question
       */
      this.infoService.updateQuestion(this.curQuestionInfo._id, updatedata).subscribe({
        next: res => {
          this.viewMyQuestions();
          this.showAUBox = false;
        },
        error: err => console.error(err)
      });
    }
  }

  handleAddCancel() {
    this.showAUBox = false;
  }
  //#endregion

//#endregion
}