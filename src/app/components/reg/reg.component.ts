import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {RouterModule} from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-reg',
  templateUrl: './reg.component.html',
  styleUrls: ['./reg.component.css'],
  imports: [FormsModule, RouterModule]
})
export class RegComponent {
  constructor (private http: HttpClient) {}
  authError = "";
  form = {username: "", email: "", password: ""}
  url = "http://localhost:3000/users/register";

  signup = () => {
    /**
     * `this.http.post()`: send a POST request to the specified URL
     *  - Arg1: the URL to which the request is sent
     *  - Arg2: the body of the HTTP request to be sent as the request body, optional but 
     *    usually required for POST or PUT requests
     */
    this.http.post(this.url, this.form).subscribe({
      next: (res: any) => {
        console.log(res);
        this.authError = res.message;
        window.location.href = "http://localhost:4200/login";
      },
      error: (err) => {
        console.log(err);
        this.authError = err.error.message;
      }
    })
  }
}