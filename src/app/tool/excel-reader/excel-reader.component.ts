import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';
import { Constants } from 'src/app/util/constants';
import { AuthServiceService } from 'src/app/service/auth-service.service';

@Component({
  selector: 'app-excel-reader',
  providers: [
    DatePipe,
  ],
  templateUrl: './excel-reader.component.html',
  styleUrls: ['./excel-reader.component.css']
})
export class ExcelReaderComponent {
  
  onSubmit() {
    //console.log(this.formGroup.value)
  }
  updatedFormValues: any
  currentDateAndTime: any
  formGroup: FormGroup;
  constructor(private fb: FormBuilder, private http: HttpClient, private datePipe: DatePipe, private authService: AuthServiceService,) {
    this.currentDateAndTime = new Date()//this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    this.formGroup = this.fb.group({
      empNo: ['', Validators.required],
      name: ['', Validators.required],
      address: ['', Validators.required],
      email: [''],
      contactNo: [''],
      civilStatus: ['', Validators.required],
      nic: ['', Validators.required],
      sex: ['', Validators.required],
      dob: ['', Validators.required],
      designation: ['', Validators.required],
      department: ['', Validators.required],
      password: [''],
      scheme: ['', Validators.required],
      registrationOpen: [false],
      roles: this.fb.array([this.fb.group({ role: [''] })]),
      memberRegistrations: this.fb.array([this.fb.group({
        id: [''],
        year: [''],
        registerDate: [''],
        acceptedDate: [''],
        schemeType: ['']
      })]),
      dependants: this.fb.array([]),
      beneficiaries: this.fb.array([]),
      mDate: [''],
      status: [''],
      photoUrl: [''],
      deleted: [false]
    });
  }
  async readFile() {
    const { value: file } = await Swal.fire({
      title: "Select image",
      input: "file",
      inputAttributes: {
        "accept": "image/*",
        "aria-label": "Upload your profile picture"
      }
    });
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // console.log("loaded ", e)
      };
      reader.readAsDataURL(file);
    }
  }

  get roles() {
    return this.formGroup.get('roles') as FormArray;
  }

  get memberRegistrations() {
    return this.formGroup.get('memberRegistrations') as FormArray;
  }
  fileread() {
    //this.processExcelData(this.exceldata)
    }
  onFileChange(evt: any) {
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      //console.log("wsname ", wsname)
      //console.log("ws ", ws)
      const data = <any[][]>XLSX.utils.sheet_to_json(ws, { header: 1 });
      this.processExcelData(data);
    };
    reader.readAsBinaryString(target.files[0]);
  }

  dotToDash(dateText: any): Date {
    //console.log("given value ", dateText)
    return this.excelDateToJSDate(dateText)
  }
  excelDateToJSDate(excelDate: number): Date {
    if (excelDate == undefined) return new Date()
    const excelEpoch = new Date(1900, 0, 2); // January 1, 1900
    return new Date(excelEpoch.getTime() + (excelDate - 2) * 86400000);
  }

  processExcelData(data: any[][]) {
    var formValues: any
    var dep: any = []

    for (let i = 1; i < 2705; i++) {//2703
      //console.log("main i ",i)
      const row = data[i]
      if(row.length == 0) continue
      if (row[0] != undefined) {
        dep = []
        formValues = {
          empNo: row[2],
          name: row[3],
          address: '',
          email: '',
          contactNo: '',
          nic: this.getNicorXX(row[8]),
          sex: this.getGender(row[8]),
          dob: this.dotToDash(row[9]).toISOString().substring(0, 10),
          designation: row[5],
          department: row[4],
          password: 'user'+row[2],
          scheme: row[1],
          registrationOpen: 0,
          roles: [{role:'user'}],
          memberRegistrations: [{
            id: null,
            year: 2025,
            registerDate: this.currentDateAndTime,
            acceptedDate: this.currentDateAndTime,
            schemeType: row[1],
            acceptedBy:1,
          }],
          dependants: [],
          beneficiaries: [],
          mDate: this.currentDateAndTime,
          status: Constants.REGISTRATION_HEAD_APPROVED,
          photoUrl: '',
          deleted: false
        }

      }
      let nextRow: any
      let j=i+1
      do {
        nextRow = data[j]
        //console.log("nextRow j ",j, nextRow)
        if(nextRow[6] == undefined ){
          const civil = this.getCivilStatus(dep)
          this.updatedFormValues = {
            ...formValues,
            civilStatus: civil,
            dependants: dep,
          };
          console.log("updatedFormValues j ",j, this.updatedFormValues)
          //this.formGroup.setValue(updatedFormValues)
          //console.log("save data ", this.formGroup.value)

          this.authService.registerNew(this.updatedFormValues)
          //end of database upload
          break
        }else{
          dep.push(this.setDepFormArrayx(nextRow))
          j++;
        }
        
        //console.log("j++ ",j)
      } while (nextRow[6] != undefined);
      i=j-1
    }
  }
  

  processExcelDataold(data: any[][]) {
    var formValues: any
    var dep: any = []
    var i: number = 1
    data.forEach(data => {
      //console.log("formValues", formValues)
      if (data[0] === 'Se N.') return

      if (data[0] != undefined) {
        dep = []
        formValues = {
          empNo: data[2],
          name: data[3],
          address: '',
          email: '',
          contactNo: '',
          civilStatus: "Married",
          nic: this.getNicorXX(data[8]),
          sex: 'Male',
          dob: this.dotToDash(data[9]).toISOString().substring(0, 10),
          designation: data[5],
          department: data[4],
          password: data[2],
          scheme: data[1],
          registrationOpen: 0,
          roles: [{ role: 'user' }],
          memberRegistrations: [{
            id: null,
            year: 2025,
            registerDate: this.currentDateAndTime,
            acceptedDate: null,
            schemeType: data[1]
          }],
          dependants: [],
          beneficiaries: [],
          mDate: this.currentDateAndTime,
          status: 'pending',
          photoUrl: '',
          deleted: false
        }
      } else {
        if (data[6] === undefined) return
        dep.push(this.setDepFormArrayx(data))
        //console.log("dep Inner ", dep)
      }
      if (data[0] != undefined) {
        console.log("dep ==>", dep, formValues)
        if (formValues != undefined) {
          
          this.updatedFormValues = {
            ...formValues,
            dependants: dep,
          };
          //this.formGroup.setValue(updatedFormValues)
          console.log("save data ", this.formGroup.value)

        }
      }

      //console.log("formValues end ", formValues)
    }
    )
  }
  getCivilStatus(dep: any):string  {
    const hasHusbandOrWife = dep.some((dep: { relationship: string; }) => dep.relationship === "Husband" || dep.relationship === "Wife");
    if (hasHusbandOrWife) {
      return "Married"
    } else {
      return "Unmarried"
    }
  }
  getNicorXX(data: any): string {
    if (data === undefined) {
      return "XX"
    } else {
      return data
    }

  }

  getGender(nic: string) {
    if (typeof nic === "number") {
      nic = "".concat(nic)
    } else if (nic == undefined) {
      return "Not Set"
    }
    switch (nic.length) {
      case 9:
      case 10:
        nic = "19" + nic;
        break;
      case 12:
        break;
      default:

        return "Not Set"
    }

    let data: number;
    try {
      data = parseInt(nic.substring(0, 7), 10);
    } catch (ex) {
      return "Not Set"
    }
    let rest = data % 1000;

    if ((rest > 366 && rest < 500) || (rest > 866)) return "Not Set"

    if (rest > 500) {
      return "Female"
    }else{
      return "Male"
    }
  }

  isNIC(nic: string): Date | null {
    if (typeof nic === "number") {
      nic = "".concat(nic)
    } else if (nic == undefined) {
      return null
    }
    let male = true;
    switch (nic.length) {
      case 9:
      case 10:
        nic = "19" + nic;
        break;
      case 12:
        break;
      default:

        return null;
    }

    let data: number;
    try {
      data = parseInt(nic.substring(0, 7), 10);
    } catch (ex) {
      return null;
    }
    const year = Math.floor(data / 1000);
    let rest = data % 1000;

    if ((rest > 366 && rest < 500) || (rest > 866)) return null;

    if (rest > 500) {
      male = false;
      rest = rest - 500;
    }

    const date = new Date(year, 0); // January 1st of the given year
    date.setDate(rest);

    //console.log(nic, rest, male, date)

    // Adjust for leap years
    if (new Date(year, 1, 29).getMonth() != 1 && rest > 59) {
      date.setDate(date.getDate() - 1);
    }

    return date;
  }

  private setDepFormArray(data: any[]) {
    return {
      id: null,
      name: data[6],
      nic: data[8],
      dob: this.excelDateToJSDate(data[9]).toISOString().substring(0, 10),
      relationship: data[7],
      registerDate: this.currentDateAndTime,
      registerYear: 2025,
    };
  }

  private setDepFormArrayx(data: any[]) {
    return this.fb.group({
      id: this.fb.control(null),
      name: this.fb.control(data[6]),
      nic: this.fb.control(data[8]),
      dob: this.fb.control(this.excelDateToJSDate(data[9]).toISOString().substring(0, 10)),
      relationship: this.fb.control(data[7]),
      registerDate: this.fb.control(this.currentDateAndTime),
      registerYear: this.fb.control(2025),
    }).value;
  }

  private setBenFormArray(data: any[], i: number) {
    return this.fb.group({
      id: this.fb.control(null),
      name: this.fb.control(data[1]),
      nic: this.fb.control(data[1]),
      registerDate: this.fb.control(this.currentDateAndTime),
      registerYear: this.fb.control(2024),
      percent: new FormControl(''),
      relationship: this.fb.control(''),
    });
  }
}
/*formValues = {
  empNo: data[i][2],
  name: data[i][3],
  address: '',
  email: '',
  contactNo: '',
  civilStatus: "Married",
  nic: data[i][8],
  sex: 'Male',
  dob: this.excelDateToJSDate(data[i][9]).toISOString().substring(0, 10),
  designation: data[i][5],
  department: data[i][4],
  password: data[i][2],
  scheme: data[i][1],
  registrationOpen: 0,
  roles: [{ role: 'user' }],
  memberRegistrations: [{
    id: null,
    year: 2024,
    registerDate: this.currentDateAndTime,
    acceptedDate: null,
    schemeType: data[i][1]
  }],
  dependants: [],
  beneficiaries: [],
  mDate: this.currentDateAndTime,
  status: 'pending',
  photoUrl: '',
  deleted: false
}*/