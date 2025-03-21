import { Component, Input, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthServiceService } from '../service/auth-service.service';
import { SharedService } from '../shared/shared.service';
import { DependantComponent } from './dependant/dependant.component';
import { Dependant } from '../Model/dependant';
import { MatTableDataSource } from '@angular/material/table';
import { Utils } from '../util/utils';
import { Beneficiary, BeneficiaryColumns } from '../Model/benificiary';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { BeneficiaryComponent } from './beneficiary/beneficiary.component';
import { Member } from '../Model/member';
import { Constants } from '../util/constants';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  @Input() registerYear: number = Utils.currentYear
  formGroup!: FormGroup;
  schemeType: string = Constants.SCHEME_INDIVIDUAL;
  member!: Member;
  data!: any;
  yearList!: any[]
  Roles: any = [Constants.ROLE_USER];
  Civil_statuss: any = ['Married', 'Unmarried'];
  Sex: any = ['Male', 'Female'];
  showPreviousDependants: boolean = false
  dependantData = new MatTableDataSource<Dependant>();
  displayedColumns: string[] = [
    'id',
    'name',
    'nic',
    'dob',
    'relationship',
    'action',
  ];

  beneficiaryData = new MatTableDataSource<Beneficiary>();
  beneficiaryColumns: string[] = BeneficiaryColumns.map((col) => col.key);

  constructor(
    private fb: FormBuilder,
    private share: SharedService,
    private router: Router,
    private authService: AuthServiceService,
    private dialog: MatDialog
  ) {
    this.member = this.share.getUser();
  }

  ngOnInit(): void {
    if (!this.member) {
      this.router.navigate(['/signin']);
    }
    console.log("this.share.getUser ",this.member)
    if (this.member.registrationOpen) {
      this.registerYear = this.member.registrationOpen
      const regNew = this.member.memberRegistrations.find(r => { return r.year == this.registerYear })
      if (regNew) {
        this.router.navigate(['/signin'])
      }

      const regFamily = this.member.memberRegistrations.find(r => { return r.schemeType == Constants.SCHEME_FAMILY })
      if (regFamily) this.showPreviousDependants = true
      this.yearList = this.member.memberRegistrations.map(r => { return r.year })
/*
      if (this.member.beneficiaries)
        this.member.beneficiaries.forEach((b) => {
          this.beneficiaryData.data = [b, ...this.beneficiaryData.data];
        });

      if (this.member.memberRegistrations && this.member.memberRegistrations.find((r) => {
        return (
          r.year == Utils.currentYear - 1 &&
          r.schemeType == Constants.SCHEME_FAMILY
        );
      })
      ) {
        this.schemeType = Constants.SCHEME_FAMILY;
        if (this.member.dependants)
          this.member.dependants.forEach((d) => {
            this.dependantData.data = [d, ...this.dependantData.data];
          });
      }*/
    }

    this.formGroup = this.fb.group({
      empNo: new FormControl(this.member.empNo, [Validators.required]),
      name: new FormControl(this.member.name, [Validators.required]),
      address: new FormControl(this.member.address, [Validators.required]),
      email: new FormControl(this.member.email),
      contactNo: new FormControl(this.member.contactNo),
      civilStatus: new FormControl(this.member.civilStatus, [
        Validators.required,
      ]),
      nic: new FormControl(this.member.nic, [Validators.required]),
      sex: new FormControl(this.member.sex, [Validators.required]),
      dob: new FormControl(this.member.dob, [Validators.required]),
      designation: new FormControl(this.member.designation, [
        Validators.required,
      ]),
      department: new FormControl(this.member.department, [
        Validators.required,
      ]),
      password: new FormControl(),
      scheme: new FormControl(this.member.scheme, [Validators.required]),
      registrationOpen: new FormControl(),
      roles: this.fb.array([
        this.fb.group({
          role: new FormControl(),
        }),
      ]),

      memberRegistrations: this.fb.array([
        this.fb.group({
          id: new FormControl(),
          year: new FormControl(),
          registerDate: new FormControl(),
          acceptedDate: new FormControl(),
          schemeType: new FormControl(),
        }),
      ]),
      dependants: this.fb.array([]),
      beneficiaries: this.fb.array([]),
      mDate: new FormControl(this.member.mDate),
      status: new FormControl(this.member.status),
      photoUrl: new FormControl(this.member.photoUrl),
      deleted: new FormControl(false),
    });

  }
  Openpopup(forWhat: number, name: string, title: any, component: any) {
    console.log("open ", this.beneficiaryData.data)
    var _popup = this.dialog.open(component, {
      //width: '40%',
      enterAnimationDuration: '1000ms',
      exitAnimationDuration: '1000ms',
      data: {
        dataSet:
          forWhat == 1
            ? this.dependantData.data.filter((d) => { return d.name === name })
            : this.beneficiaryData.data.filter((d) => { return d.name === name }),
        title: title,
        name: name,
        empNo: this.member.empNo,
      },
    });

    _popup.afterClosed().subscribe((item: FormGroup) => {
      console.log("close ", item.value)
      if (item === undefined) return;
      if (forWhat == 1) {
        if (item.value.name != '') {
          console.log("forWhat ", forWhat)
          this.dependantData.data.forEach((a) => {
            if (name != '' && a.id === item.value.id) {
              console.log("a ", a)
              a.name = item.value.name
              a.nic = item.value.nic
              a.relationship = item.value.relationship
              a.dob = item.value.dob
              a.registerDate = new Date()
              a.registrationYear = this.registerYear
            }
          });
          console.log("Edited ", this.dependantData.data)
        }
        if (name == '') this.newDependant(item);
      }
      else {
        let sum1: number = Number(item.value.percent);
        this.beneficiaryData.data.forEach((a) => {
          if (name != '' && a.id === item.value.id) {
            console.log("a ", a)
            a.name = item.value.name
            a.nic = item.value.nic
            a.relationship = item.value.relationship
            a.percent = item.value.percent
            a.registerDate = new Date()
            a.registrationYear = this.registerYear
          } else
            sum1 += Number(a.percent)
        });
        if (sum1 > 100) {
          Swal.fire({
            title: `Total percent in ${sum1}% not acceptable`,
            icon: 'error',
            showCancelButton: false,
            confirmButtonText: 'Remove',
          });
          return
        }
        if (name == '') {
          this.newBeneficiary(item);
        }
      }
    });
    console.log("ben ", this.beneficiaryData.data)
    console.log("dep ", this.dependantData.data)
  }
  popupDependant() {
    this.Openpopup(1, '', 'Add Dependants details', DependantComponent);
  }
  addBenificiary() {
    this.Openpopup(2, '', 'Add Beneficiary details', BeneficiaryComponent);
  }
  editBenificiary(name: any) {
    this.Openpopup(2, name, 'Edit Beneficiary details', BeneficiaryComponent);
  }
  async getPreviousDependants() {
    const { value: index } = await Swal.fire({
      title: "Available Years",
      input: "select",
      inputOptions: this.yearList,
      inputPlaceholder: "Select a Year",
      showCancelButton: true,
    });
    if (index) {
      const deps = await this.authService.getMemberDependants(this.member.empNo, this.yearList[index])
      this.dependantData.data = deps
    }
  }
  async getPreviousBenificiaries() {
    const { value: index } = await Swal.fire({
      title: "Available Years",
      input: "select",
      inputOptions: this.yearList,
      inputPlaceholder: "Select a Year",
      showCancelButton: true,
    });
    if (index) {
      const bens = await this.authService.getMemberBeneficiaries(this.member.empNo, this.yearList[index])
      this.beneficiaryData.data = bens
    }
  }
  private newDependant(data: FormGroup): FormGroup {
    console.log("New dep call")
    const newRow: Dependant = {
      id: data.value.id,
      name: data.value.name,
      nic: data.value.nic,
      dob: data.value.dob,
      relationship: data.value.relationship,
      registerDate: new Date(),
      registrationYear: this.registerYear,
      age: undefined,
      deleted: false
    };
    this.dependantData.data = [newRow, ...this.dependantData.data];
    return data;
  }

  editDependant(name: string) {
    this.Openpopup(1, name, 'Edit Dependants details', DependantComponent);
  }

  removeDependant(name: string) {
    this.dependantData.data = this.dependantData.data.filter(
      (u: Dependant) => { return u.name !== name; });
    /*console.log('before removing Dependant ', this.dependantData.data);
    Swal.fire({
      title: `Confirm to delete ${name} ?`,
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        
        Swal.fire('Deleted!', 'Dependant has been deleted.', 'success');
      }
    });*/

  }

  private setDepFormArray(x: any) {
    return this.fb.group({
      id: this.fb.control(x.id),
      name: this.fb.control(x.name),
      nic: this.fb.control(x.nic),
      dob: this.fb.control(x.dob),
      relationship: this.fb.control(x.relationship),
      registerDate: this.fb.control(new Date()),
      registerYear: this.fb.control(this.registerYear),
    });
  }

  private newBeneficiary(data: FormGroup): FormGroup {
    console.log("New dep call")
    const newRow: Beneficiary = {
      id: data.value.id,
      name: data.value.name,
      nic: data.value.nic,
      registerDate: new Date(),
      registrationYear: this.registerYear,
      relationship: data.value.relationship,
      percent: data.value.percent,
      deleted: false
    };
    this.beneficiaryData.data = [newRow, ...this.beneficiaryData.data];
    return data;
  }


  removeBenificiary(name: string) {
    this.beneficiaryData.data = this.beneficiaryData.data.filter(
      (u: Beneficiary) => { return u.name != name; });
  }

  private setBenFormArray(x: any) {
    return this.fb.group({
      id: this.fb.control(x.id),
      name: this.fb.control(x.name),
      nic: this.fb.control(x.nic),
      registerDate: this.fb.control(new Date()),
      registerYear: this.fb.control(this.registerYear),
      percent: new FormControl(x.percent),
      relationship: this.fb.control(x.relationship),
    });
  }

  showThis(title: any, subtitle: any) {
    Swal.fire({
      icon: 'info',
      title: 'Data Set',
      text: JSON.stringify(title),
      footer: `<a href="">${JSON.stringify(subtitle)}</a>`,
    });
  }
  registerProcess1() {
    this.fb.array([])
    const userCtrlBen = this.formGroup.get('beneficiaries') as FormArray;
    this.beneficiaryData.data.forEach((user) => {
      userCtrlBen.push(this.setBenFormArray(user));
    });

    this.formGroup.patchValue({
      beneficiaries: this.beneficiaryData.data.forEach((user) => {
        return this.setBenFormArray(user)
      }),
      dependants: this.dependantData.data.forEach((user) => {
        return this.setDepFormArray(user)
      }),
      roles: [{ role: Constants.ROLE_USER }],
      memberRegistrations: [
        {
          id: null,
          year: this.registerYear,
          registerDate: new Date(),
          schemeType: this.schemeType,
          
        },
      ],
      mDate: Utils.today,
      registrationOpen: 0,
      status: Constants.REGISTRATION_PENDING,
      password: Constants.DEFAULT_PASSWORD,
      scheme: this.schemeType,
    });
    console.log('tobe insert registerProcess ', this.formGroup.value);
  }
  registerProcess() {
    let sum: number = 0;
    this.beneficiaryData.data.forEach((a) => (sum += Number(a.percent)));

    let msg = `Confirm to submit Data ?`;
    let btn = 'Yes, Submit!';
    if (sum > 100) {
      Swal.fire({
        title: `Beneficiary percentage is ${sum}% not acceptable`,
        icon: 'error',
        showCancelButton: false,
        confirmButtonText: 'Retry !',
      });
      return;
    } else if (sum < 100) {
      msg = `Beneficiary percentage is ${sum}%`;
      btn = `Submit anyway`;
    }


    const steps = ['1', '2', '3'];
    const Queue = Swal.mixin({
      progressSteps: steps,
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      // optional classes to avoid backdrop blinking between steps
      showClass: { backdrop: 'swal2-noanimation' },
      hideClass: { backdrop: 'swal2-noanimation' },
    });

    (async () => {
      let result = await Queue.fire({
        title: msg,
        icon: 'warning',
        currentProgressStep: 0,
        confirmButtonText: btn,
        showLoaderOnConfirm: true,
        allowOutsideClick: () => false,
        preConfirm: async () => {
          let res: any;
          try {
            const userCtrl = this.formGroup.get('dependants') as FormArray;
            this.dependantData.data.forEach((user) => {
              userCtrl.push(this.setDepFormArray(user));
            });
            const userCtrlBen = this.formGroup.get('beneficiaries') as FormArray;
            this.beneficiaryData.data.forEach((user) => {
              userCtrlBen.push(this.setBenFormArray(user));
            });
            this.formGroup.patchValue({
              roles: [{ role: Constants.ROLE_USER }],
              memberRegistrations: [
                {
                  id: null,
                  year: this.registerYear,
                  registerDate: new Date(),
                  schemeType: this.schemeType,
                },
              ],
              mDate: Utils.today,
              registrationOpen: 0,
              status: Constants.REGISTRATION_PENDING,
              password: Constants.DEFAULT_PASSWORD,
              scheme: this.schemeType,
            });
            console.log('tobe insert registerProcess ', this.formGroup.value);
            res = await this.authService.registerNew(this.formGroup.value)
            console.log('saved registerProcess ', res);
          } catch (error) {
            Swal.showValidationMessage(`Request failed: ${error}`);
          }
          return res;
        },
      });

      if (result.isConfirmed) {
        await Queue.fire({
          title: 'Download Registration Application',
          text: `Employee: ${result.value.name}`,
          currentProgressStep: 1,
          confirmButtonText: 'Download',
          showLoaderOnConfirm: true,
          allowOutsideClick: () => false,
          preConfirm: async () => {
            const ret = await this.downloadMembershipApplication(this.registerYear, result.value.empNo);
            /*try {
              // download fails
              let response: any = await this.authService.downloadNew(1,
                this.registerYear,
                result.value.empNo
              );
              let dataType = response.type;
              let binaryData = [];
              binaryData.push(response);
              let downloadLink = document.createElement('a');
              downloadLink.href = window.URL.createObjectURL(
                new Blob(binaryData, { type: dataType })
              );
              downloadLink.setAttribute('download', 'Application.pdf');
              document.body.appendChild(downloadLink);
              downloadLink.click();
            } catch (error) {
              Swal.showValidationMessage(` ${error} `);
            }*/
            return ret;
          },
        });
        /*if (result1.isConfirmed) {
          // return success user
        }*/
        await Queue.fire({
          title: 'Finish',
          icon: 'success',
          showCancelButton: false,
          currentProgressStep: 2,
          confirmButtonText: 'OK',
        }).then((resultLast) => {
          //redirect page
          console.log("result.value check updated member details ", result.value)
          const reg = result.value?.memberRegistrations.find((r: any) => {
            return r.year == Utils.currentYear && r.acceptedDate != null;
          });
          console.log("reg wrong in re reg", reg)
          if (reg !== undefined) {
            //TODO pass registration open is 0
            this.member.registrationOpen = 0
            this.share.setUser(this.member)
            this.router.navigate(['/home']);
          } else {
            Swal.fire(
              'Membership acceptace is required',
              `Contact Department Head`,
              'warning'
            ).then(() => {
              this.router.navigate(['/signin']);
            });
          }
        });

        this.formGroup.reset();
      }



    })();
  }

  async downloadMembershipApplication(year: number, empNo: string) {
    const response = await this.authService.downloadNew(1, year, empNo)
    let dataType = response.type;
    let binaryData = [];
    binaryData.push(response);
    //let fname = response.get("file name").ToString();
    //console.log(fname);
    let downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(
      new Blob(binaryData, { type: dataType })
    );
    downloadLink.setAttribute('download', 'Application.pdf');
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }
}


/*registerProcess() {
  let sum: number = 0;
  this.beneficiaryData.data.forEach((a) => (sum += Number(a.percent)));

  let msg = `Confirm to submit Data ?`;
  let btn = 'Yes, Submit!';
  if (sum > 100) {
    Swal.fire({
      title: `Beneficiary percentage is ${sum}% not acceptable`,
      icon: 'error',
      showCancelButton: false,
      confirmButtonText: 'Retry !',
    });
    return;
  } else if (sum < 100) {
    msg = `Beneficiary percentage is ${sum}%`;
    btn = `Submit anyway`;
  }

  Swal.fire({
    title: msg,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: btn,
    showLoaderOnConfirm: true,
    preConfirm: async () => {
      this.setDep();
      this.setBen();
      this.formGroup.patchValue({
        roles: [{ role: Constants.ROLE_USER }],
        memberRegistrations: [
          {
            id: null,
            year: this.registerYear,
            schemeType: this.schemeType,
          },
        ],
        mDate: Utils.today,
        registrationOpen: 0,
        status: Constants.REGISTRATION_PENDING,
        password: Constants.DEFAULT_PASSWORD,
        scheme: this.schemeType,
      });
      console.log('tobe insert ', this.formGroup.value);
      return this.authService
        .registerold(this.formGroup.value)
        .subscribe((reg) => {
          console.log('saved', reg);
          return this.authService
            .getMemberold(this.formGroup.value.empNo)
            .subscribe((m) => {
              this.share.setUser(m);
              Swal.fire({
                title: `Download pdf`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Save',
                allowOutsideClick: () => false,
              }).then((result) => {
                if (result.isConfirmed) {
                  this.downloadMembershipApplication(
                    this.registerYear,
                    m.empNo
                  );
                }

                const reg = m.memberRegistrations.find((r) => {
                  return (
                    r.year == Utils.currentYear && r.acceptedDate != null
                  );
                });
                if (reg !== undefined) {
                  this.router.navigate(['/home']);
                } else {
                  Swal.fire(
                    'Membership acceptace is required',
                    `Contact Department Head`,
                    'warning'
                  ).then(() => {
                    this.router.navigate(['/signin']);
                  });
                }
              });
              this.formGroup.reset();
              return m;
            });
        });
    },
    allowOutsideClick: () => !Swal.isLoading(),
  }).then((result) => {
    if (result.isConfirmed) {
    }
  });
}
*/




/*registerProcess() {
  let sum: number = 0;
  this.beneficiaryData.data.forEach((a) => (sum += Number(a.percent)));

  let msg = `Confirm to submit Data ?`;
  let btn = 'Yes, Submit!';
  if (sum > 100) {
    Swal.fire({
      title: `Beneficiary percentage is ${sum}% not acceptable`,
      icon: 'error',
      showCancelButton: false,
      confirmButtonText: 'Retry !',
    });
    return;
  } else if (sum < 100) {
    msg = `Beneficiary percentage is ${sum}%`;
    btn = `Submit anyway`;
  } else if (sum == 100) {
    msg = `Confirm for Registration`;
    btn = `Confirm`;
  }

  const swalResult = await Swal.fire({
    title: msg,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: btn,
    showLoaderOnConfirm: true,
    preConfirm: async () => {
      this.setDep();
      this.setBen();
      this.formGroup.patchValue({
        roles: [{ role: Constants.ROLE_USER }],
        memberRegistrations: [
          {
            id: null,
            year: Utils.currentYear,
            schemeType: this.schemeType,
          },
        ],
        mDate: Utils.today,
        registrationOpen: 0,
        status: Constants.REGISTRATION_PENDING,
        password: Constants.DEFAULT_PASSWORD,
        scheme: this.schemeType,
      });
      Swal.showValidationMessage('Processing');
      console.log('tobe insert ', this.formGroup.value);
      let res = await this.authService.register(this.formGroup.value);

      let res1 = await this.authService.getMember(this.formGroup.value.empNo);

      res1.subscribe((m) => {
        this.share.setUser(m);
        Swal.fire({
          title: `Download pdf`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Save',
          allowOutsideClick: () => false,
        }).then((result) => {
          if (result.isConfirmed) {
            this.downloadMembershipApplication(Utils.currentYear, m.empNo);
          }

          const reg = m.memberRegistrations.find((r) => {
            return r.year == Utils.currentYear && r.acceptedDate != null;
          });
          if (reg !== undefined) {
            this.router.navigate(['/home']);
          } else {
            Swal.fire(
              'Membership acceptace is required',
              `Contact Department Head`,
              'warning'
            ).then(() => {
              this.router.navigate(['/signin']);
            });
          }
        });
        this.formGroup.reset();
      });
      return res;
    },
    allowOutsideClick: () => !Swal.isLoading(),
  }).then((result) => {
    if (result.isConfirmed) {
    }
  });
}*/
