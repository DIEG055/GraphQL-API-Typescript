import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

import { Customer } from "../../../entity/Customer";

@ValidatorConstraint({ async: true })
export class IsEmailAlreadyExistConstraint
  implements ValidatorConstraintInterface {
  validate(email: string) {
    return Customer.findOne({ where: { email } }).then((customer) => {
      if (customer) return false;
      return true;
    });
  }
}

export function IsEmailAlreadyExist(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailAlreadyExistConstraint,
    });
  };
}
