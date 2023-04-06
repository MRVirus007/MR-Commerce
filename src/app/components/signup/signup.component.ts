import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  signupError: string = "";
  constructor(private authService: AuthService) {
    this.signupForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  async signup() {
    const { email, username, password } = this.signupForm.value;
    try {
      this.signupError = "Error: " + await this.authService.signUp(email, password, username);
    } catch (err: any) {
      this.signupError = err.message;
    }
  }
}