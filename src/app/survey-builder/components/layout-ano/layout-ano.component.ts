import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-layout-simple',
  templateUrl: './layout-ano.component.html',
  styleUrls: ['./layout-ano.component.css'],
})
export class LayoutAnoComponent implements OnInit {
  loginUserType = "Unregistered User";
  ngOnInit(): void { }
}
