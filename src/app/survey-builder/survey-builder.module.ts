import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { LayoutUserComponent } from './components/layout-user/layout-user.component';
import { LayoutAnoComponent } from './components/layout-ano/layout-ano.component';
import { QMgmtComponent } from './components/q-mgmt/q-mgmt.component';
import { SMgmtComponent } from './components/s-mgmt/s-mgmt.component';
import { SAnswerComponent } from './components/s-answer/s-answer.component';
import { ExportComponent } from './components/export/export.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

@NgModule({
  declarations: [
    LayoutUserComponent,
    LayoutAnoComponent,
    QMgmtComponent,
    SMgmtComponent,
    SAnswerComponent,
    ExportComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzLayoutModule,
    NzButtonModule,
    NzRadioModule,
    NzModalModule,
    NzFormModule,
    NzSelectModule,
    NzIconModule,
    NzListModule,
    NzSwitchModule,
    NzDatePickerModule,
    NzCheckboxModule
  ],
  exports: [
    LayoutUserComponent,
    LayoutAnoComponent,
  ]
})
export class SurveyBuilderModule { }
