import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Router, RouterModule} from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, RouterModule]
})
export class LoginComponent {
  authError = "";
  form = {username: '', password: ''};
  url = "http://localhost:3000/users/login";

  constructor (private http: HttpClient, private router: Router) {}

  login = () => {
    // console.log(this.form); // for debugging
    this.http.post(this.url, this.form).subscribe({
      next: (res: any) => {
        // console.log(res);  // for debugging
        /**
         * `localStorage`: a global object provided in the browser environment to
         *   allow web app to store key/value pairs locally in the user's browser.
         *   automatically available to the appl and don't need to be imported or initialized
         * `localStorage.setItem()`: store data with no expiration date
         * - Arg1: the key of the data
         * - Arg2: the value of the data
         */
        localStorage.setItem("token", res.token); // store the token in the browser's local storage
        this.router.navigate(['/home']);  // navigate to the home page
      },
      error: (err) => {
        // console.error(err);  // for debugging
        this.authError = err.error.message;
      }
    });
  }
}
