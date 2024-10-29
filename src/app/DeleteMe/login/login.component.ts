import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/service/auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  formGroup!: FormGroup;
  constructor(
    private authService: AuthServiceService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.initForm();
  }
  initForm() {
    this.formGroup = new FormGroup({
      empNo: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }
  loginProcess() {
    if (this.formGroup.valid) {
      this.authService.login(this.formGroup.value).subscribe((result) => {
        if (result.success == 'true') {
          console.log(result);
          this.router.navigate(['/home']);
          localStorage.setItem('token', result.token);
        } else alert(result.massage);
      });
    }
  }

  // export class LoginComponent implements OnInit{
  //   formGroup!: FormGroup;
  //   constructor(private authService:AuthServiceService ){}
  //   ngOnInit(){
  //     this.initForm();
  //   }
  //   initForm() {
  //       this.formGroup = new FormGroup({
  //         empNo: new FormControl('', [Validators.required]),
  //         password: new FormControl('',[Validators.required])
  //       })
  //   }
  //   loginProcess(){
  //     if(this.formGroup.valid){
  //       this.authService.login(this.formGroup.value).subscribe(result =>{
  //         if(result.success){
  //           console.log(result);
  //           alert(result.message);
  //         }else
  //           alert(result.message);
  //       })
  //     }
  //  }
}
