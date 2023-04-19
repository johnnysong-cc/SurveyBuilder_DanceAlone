import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-layout-simple',
  templateUrl: './layout-simple.component.html',
  styleUrls: ['./layout-simple.component.css'],
})
export class LayoutAnoComponent implements OnInit {
  loginUserType = "Unregistered User";
  ngOnInit(): void { }
}
