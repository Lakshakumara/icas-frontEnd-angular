import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';

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
    console.log(this.formGroup.value)
  }
  currentDateAndTime: any
  formGroup: FormGroup;
  constructor(private fb: FormBuilder, private http: HttpClient, private datePipe: DatePipe) {
    this.currentDateAndTime = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
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
        console.log("loaded ", e)
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
    console.log("given value ", dateText)
    return this.excelDateToJSDate(dateText)
  }
  excelDateToJSDate(excelDate: number): Date {
    if (excelDate == undefined) return new Date()
    const excelEpoch = new Date(1900, 0, 2); // January 1, 1900
    return new Date(excelEpoch.getTime() + (excelDate - 2) * 86400000);
  }

  processExcelData(data: any[][]) {
    //console.log("data ", data)
    var formValues: any
    var dep: any
    var i: number = 1
    data.forEach(data => {
      console.log("data[0] ", data[0])

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
        }
      } else {
        console.log("data[6], data[9] ", data[6], data[9])
        if (data[6] === undefined) return
        dep.push(this.setDepFormArrayx(data))
      }

      if (data[0]) {

        if (formValues != null) {
          console.log(data[0], formValues.name, "==>", dep)
          const updatedFormValues = {
            ...formValues,
            dependants: dep,
          };
          console.log("updatedFormValues ", updatedFormValues)
          this.formGroup.setValue(updatedFormValues)
        }
      }
    })
  }
  getNicorXX(data: any): string {
    if (data === undefined) {
      return "XX"
    } else
      return data
  }
  private setDepFormArray(data: any[]) {
    return {
      id: null,
      name: data[6],
      nic: data[8],
      dob: this.excelDateToJSDate(data[9]).toISOString().substring(0, 10),
      relationship: data[7],
      registerDate: this.currentDateAndTime,
      registerYear: 2024,
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
      registerYear: this.fb.control(2024),
    });
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