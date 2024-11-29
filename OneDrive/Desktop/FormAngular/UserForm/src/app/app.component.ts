

import { Component, Inject, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  form: FormGroup = new FormGroup({});
  model = {};
  registeredUsers: any[] = [];
  editIndex: number | null = null;
  i!: number;
  country: any | undefined;

  states: any = {
    India: ['Delhi', 'Mumbai', 'Kolkata'],
    USA: ['California', 'Texas', 'New York'],
    Canada: ['Ontario', 'Quebec', 'Alberta'],
  };

   fields: FormlyFieldConfig[] = [
    {
      key: 'fullName',
      type: 'input',
      templateOptions: {
        label: 'Full Name',
        placeholder: 'Enter full name',
        required: true,
        minLength: 3,
        maxLength: 64,
      },
      validation: {
        messages: {
          required: 'Full Name is required.',
          minlength: 'Full Name must be at least 3 characters long.',
          maxlength: 'Full Name cannot exceed 64 characters.',
        },
      },
    },
    {
      key: 'email',
      type: 'input',
      templateOptions: {
        label: 'Email Address',
        placeholder: 'Enter email address',
        required: true,
        pattern: '^[a-z0-9](\.?[a-z0-9]){5,}@g(oogle)?mail\.com$',
        type: 'email',
      },
      validation: {
        messages: {
          required: 'Email Address is required.',
          pattern: 'Email must be a valid, e.g. example@example.com',
          email: 'Please enter a valid email address.',
        },
      },
    },
    {
      key: 'dob',
      type: 'input',
      templateOptions: {
        label: 'Date of Birth',
        required: true,
        type: 'date',
      },
      validation: {
        messages: {
          required: 'Date of Birth is required.',
        },
      },
    },
    {
      key: 'phoneNumbers',
      type: 'input',
      templateOptions: {
        label: 'Phone Number',
        placeholder: 'Enter phone number',
        required: true,
        pattern: '\\d{10}',
        maxLength: 10,
        minLength: 10,
      },
      validation: {
        messages: {
          required: 'Phone Number is required.',
          pattern: 'Phone Number must be a valid 10-digit number.',
          maxlength: 'Phone Number must be exactly 10 digits.',
          minlength: 'Phone Number must be exactly 10 digits.',
        },
      },
    },
    {
      key: 'address',
      type: 'textarea',
      templateOptions: {
        label: 'Address',
        placeholder: 'Enter address',
        required: true,
      },
      validation: {
        messages: {
          required: 'Address is required.',
          minlength: 'Address must be at least 10 characters long.',
          maxlength: 'Address cannot exceed 256 characters.',
        },
      },
    },
    {
      key: 'country',
      type: 'select',
      templateOptions: {
        label: 'Country',
        options: [
          { value: 'India', label: 'India' },
          { value: 'USA', label: 'USA' },
          { value: 'Canada', label: 'Canada' },
        ],
        required: true,
      },
      validation: {
        messages: {
          required: 'Country is required.',
        }
      },
      hooks: {
        onInit: (field) => {
          field.formControl?.valueChanges.subscribe((value: string) => {
            this.updateStateOptions(value);
          });
        },
      },
    },
    {
      key: 'state',
      type: 'select',
      templateOptions: {
        label: 'State',
        options: [],
        required: true,
      },
      validation: {
        messages: {
          required: 'State is required.',
        },
      },
    },
    {
      key: 'zip',
      type: 'input',
      templateOptions: {
        label: 'Zip',
        placeholder: 'Enter ZIP code',
        required: true,
        pattern: '\\d{6}',
        maxLength: 6,
        minLength: 6,
      },
      validation: {
        messages: {
          required: 'ZIP Code is required.',
          pattern: 'ZIP Code must be a valid 6-digit number.',
          maxlength: 'ZIP Code must be exactly 6 digits.',
          minlength: 'ZIP Code must be exactly 6 digits.',
        },
      },
    },
  ];



  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    if (isPlatformBrowser(this.platformId)) {
      this.registeredUsers = JSON.parse(localStorage.getItem('users') || '[]');
    }
  }

  get isSaveDisabled(): boolean {
    return this.form.invalid;
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      if (this.editIndex !== null) {
        this.registeredUsers[this.editIndex] = { ...this.model };
        alert('User updated successfully!');
      } else {
        this.registeredUsers.unshift({ ...this.model });
        alert('User saved successfully!');
      }
      this.saveToLocalStorage();
      this.resetForm();
    }
  }

  updateStateOptions(country: string) {
    const states = this.states[country] || [];
    const stateField = this.fields.find((f) => f.key === 'state');
    if (stateField) {
      stateField.templateOptions!.options = states.map((state: any) => ({
        value: state,
        label: state,
      }));
    }
  }
  
  editUser(index: number) {
    this.editIndex = index;
    const user = this.registeredUsers[index];
    this.model = { ...user };
    this.form.patchValue(this.model);
    console.log(this.model);
  }

  deleteUser(index: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.registeredUsers.splice(index, 1);
      this.saveToLocalStorage();
    }
  }

  resetForm() {
    this.form.reset();
    this.model = { phoneNumbers: [''] };
    this.editIndex = null;
  }

  saveToLocalStorage() {
    localStorage.setItem('users', JSON.stringify(this.registeredUsers));
  }


}
