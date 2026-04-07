import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { format } from 'date-fns';
import { isEqual, pick } from 'lodash';

export class FormComponent {
  form: FormGroup = new FormGroup({});
  isFormValueChange: boolean = false;
  originalData: any;

  control(controlName: string) {
    return this.form.get(controlName) as FormControl;
  }

  value(controlName: string) {
    return this.control(controlName)?.value;
  }

  isInvalid(controlName: string): boolean {
    return (
      this.control(controlName)?.invalid &&
      (this.control(controlName)?.touched || this.control(controlName)?.dirty)
    );
  }

  // this function only use for nzValidationStatus - return string "error" when field has invalid state
  isInvalidField(controlName: string): string {
    return this.control(controlName)?.invalid &&
      (this.control(controlName)?.touched || this.control(controlName)?.dirty)
      ? 'error'
      : '';
  }

  isInvalidArrayField(
    controlName: string,
    formArrayControlName: string,
    index: number
  ): string {
    const array = this.form.get(formArrayControlName) as FormArray;
    const control = array.at(index).get(controlName);
    return control?.invalid && (control?.touched || control?.dirty)
      ? 'error'
      : '';
  }

  isValid(controlName: string) {
    return this.control(controlName)?.valid;
  }

  setAsTouched(control: FormGroup | FormArray = this.form) {
    Object.values(control.controls).forEach(ctrl => {
      ctrl.markAsTouched();
      if ((ctrl as FormArray).controls) this.setAsTouched(ctrl as FormArray);
    });
  }

  checkForm() {
    this.setAsTouched();
    return this.form.valid;
  }

  getControlErrorMessage(
    controlName: string,
    displayName?: string,
    formControl?: AbstractControl | null
  ) {
    const ctrl = !!formControl ? formControl : this.control(controlName);
    if (ctrl?.hasError('required')) {
      return `${displayName || controlName} is required`;
    } else if (ctrl?.hasError('email')) {
      return `${displayName || controlName} is invalid`;
    } else if (ctrl?.hasError('minlength') && ctrl.errors) {
      const minLengthError = ctrl?.errors['minlength'] as {
        requiredLength: number;
      };
      return `${displayName || controlName} should be at least ${minLengthError.requiredLength} characters`;
    } else if (ctrl?.hasError('maxlength') && ctrl.errors) {
      const maxLengthError = ctrl?.errors['maxlength'] as {
        requiredLength: number;
        actualLength: number;
      };
      return `${displayName || controlName} can not exceed ${maxLengthError.requiredLength} characters`;
    } else if (ctrl?.hasError('pattern')) {
      return `Please enter valid ${displayName || controlName}`;
    } else if (ctrl?.hasError('min') && ctrl.errors) {
      return `Minimum value should be ${ctrl.errors['min'].min}`;
    } else if (ctrl?.hasError('max') && ctrl.errors) {
      return `Minimum value should be ${ctrl.errors['max'].max}`;
    } else if (ctrl?.hasError('misMatch')) {
      return `Field must match`;
    } else {
      return `${displayName || controlName} is invalid`;
    }
  }

  getFormArrayControlsErrorMessage(
    formArrayControlName: string,
    index: number,
    controlName: string,
    displayName?: string
  ) {
    const array = this.form.get(formArrayControlName) as FormArray;
    const control = array.at(index).get(controlName);
    return this.getControlErrorMessage(controlName, displayName, control);
  }

  isFormChanged(): boolean {
    const currentValues = this.form.getRawValue();
    const formKeys = Object.keys(currentValues);

    // Pick only fields from original that are present in the form
    const originalSubset = pick(this.originalData, formKeys);

    const normalizedCurrent = this.normalizeForComparison(currentValues);
    const normalizedOriginal = this.normalizeForComparison(originalSubset);

    return !isEqual(normalizedCurrent, normalizedOriginal);
  }

  // 🔄 Normalize all values for safe comparison
  normalizeForComparison(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(this.normalizeForComparison);
    } else if (obj instanceof File) {
      // Normalize files to their key properties
      return {
        name: obj.name,
        size: obj.size,
        type: obj.type,
        lastModified: obj.lastModified,
      };
    } else if (obj instanceof Date) {
      return obj.toISOString();
    } else if (typeof obj === 'object' && obj !== null) {
      const normalized: any = {};
      for (const key of Object.keys(obj)) {
        normalized[key] = this.normalizeForComparison(obj[key]);
      }
      return normalized;
    } else {
      return obj;
    }
  }

  // 🕵️‍♂️ Detect ISO date strings (like '2025-05-08')
  isISODateString(value: any): boolean {
    return (
      typeof value === 'string' &&
      /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[\+\-]\d{2}:\d{2})?)?$/.test(
        value
      )
    );
  }

  areFilesEqual(fileA: File | null | undefined, fileB: File | null | undefined): boolean {
    if (!fileA && !fileB) return true; // both null or undefined
    if (!fileA || !fileB) return false; // one is null, the other is not
  
    return (
      fileA.name === fileB.name &&
      fileA.size === fileB.size &&
      fileA.type === fileB.type &&
      fileA.lastModified === fileB.lastModified
    );
  }
}
