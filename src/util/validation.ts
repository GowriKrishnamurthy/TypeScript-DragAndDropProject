namespace App
{
    export interface IValidatable 
    {
        value: string | number;
        required?: boolean;
        minLength?: number;
        maxLength?: number;
        min?: number;
        max?: number;
    }

    export function validate(validatableInput: IValidatable) {
        let isValid = true;

        if (validatableInput.required) {
            isValid =
                isValid && (validatableInput.value.toString().length !== 0)
        }

        // min length makes sense only for string input
        if (validatableInput.minLength != null && typeof validatableInput.value === 'string') {
            isValid =
                isValid && (validatableInput.value.length >= validatableInput.minLength)
        }

        // max length makes sense only for string input
        if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
            isValid =
                isValid && (validatableInput.value.length <= validatableInput.maxLength)
        }

        // min  makes sense only for number input
        if (validatableInput.min != null && typeof validatableInput.value === 'number') {
            isValid =
                isValid && (validatableInput.value >= validatableInput.min)
        }

        // max  makes sense only for number input
        if (validatableInput.max != null && typeof validatableInput.value === 'number') {
            isValid =
                isValid && (validatableInput.value <= validatableInput.max)
        }
        return isValid;
    }
}