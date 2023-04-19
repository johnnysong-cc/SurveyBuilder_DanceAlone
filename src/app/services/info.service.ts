import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InfoService {
  private questionUrl = "http://localhost:3000/questions";
  private surveyUrl = "http://localhost:3000/surveys";
  private userUrl = "http://localhost:3000/users";
  private jwt: string | null = "";

  constructor (private http: HttpClient) {}

  //#region Question Management

  /**
   * Get all questions of the current user
   */
  public viewMyQuestions(): Observable<any> {
    this.jwt = localStorage.getItem("token") || "";
    const url = `${this.questionUrl}/my-questions`;
    return this.http.get(url, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.jwt
      })
    });
  }

  /**
   * Create a new question
   */
  public createQuestion(body: any): Observable<any> {
    this.jwt = localStorage.getItem("token") || "";
    const url = `${this.questionUrl}/create`;
    return this.http.post(url, body, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.jwt
      })
    });
  }

  /**
   * Update a question
   */
  public updateQuestion(questionId: any, body: any): Observable<any> {
    this.jwt = localStorage.getItem("token") || "";
    const url = `${this.questionUrl}/${questionId}`;
    return this.http.put(url, body, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.jwt
      })
    });
  }

  /**
   * Delete a question
   */
  public deleteQuestion(questionId: any): Observable<any> {
    this.jwt = localStorage.getItem("token") || "";
    const url = `${this.questionUrl}/${questionId}`;
    return this.http.delete(url, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.jwt
      })
    });
  }

  //#endregion

  //#region Survey Management

  /**
   * Get all visible and non-expired surveys
   */
  public getAllVisibleSurvey(): Observable<any> {
    const url = `${this.surveyUrl}/all`;
    return this.http.get(url);
  }

  /**
   * Get all surveys of the current user
   */
  public getOwnSurveys(): Observable<any> {
    const url = `${this.surveyUrl}/allowned`;
    return this.http.get(url, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.jwt
      })
    });
  }

  /**
   * Get all responses of the current user
   */
  public getOwnResponses(): Observable<any> {
    const url = `${this.surveyUrl}/allownedresponses`;
    return this.http.get(url, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.jwt
      })
    });
  }

  /**
   * Create a new survey
   */
  public createSurvey(body: any): Observable<any> {
    const url = `${this.surveyUrl}/create`;
    return this.http.post(url, body, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.jwt
      })
    });
  }

  /**
   * Answer a survey
   */
  public answerSurvey(surveyId: any, body: any): Observable<any> {
    const url = `${this.surveyUrl}/${surveyId}/push`;
    return this.http.post(url, body, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.jwt,
      })
    });
  }

  /**
   * Update a survey
   */
  public updateSurvey(surveyId: any, body: any): Observable<any> {
    const url = `${this.surveyUrl}/${surveyId}`;
    return this.http.put(url, body, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.jwt,
      })
    });
  }

  /**
   * Delete a survey
   */
  public deleteSurvey(surveyId: any): Observable<any> {
    const url = `${this.surveyUrl}/${surveyId}`;
    return this.http.delete(url, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.jwt,
      })
    });
  }

  /**
   * Get statistics
   */
  public getStatistics(): Observable<any> {
    const url = `${this.surveyUrl}/statistics`;
    return this.http.get(url, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.jwt,
      })
    });
  }

  //#endregion
}