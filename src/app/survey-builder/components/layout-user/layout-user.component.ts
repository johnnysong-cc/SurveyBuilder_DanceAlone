import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {InfoService} from '../../services/info.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout-user.component.html',
  styleUrls: ['./layout-user.component.css'],
})
export class LayoutUserComponent implements OnInit {
  curBox = [true, false, false];
  loginUser = localStorage.getItem("username");
  loginUserType = "Registered User";

  constructor (private route: ActivatedRoute, private router: Router, private infoService: InfoService) {
  }

  ngOnInit(): void {
    const token = localStorage.getItem("token");
    if (!token) {
      this.router.navigate(['/login']);
    }
  }

  chooseIcon(num: number) {
    this.curBox = [false, false, false];
    this.curBox[num] = true;
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
