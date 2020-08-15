import { Length, IsEmail   } from "class-validator";
import { Field, InputType } from "type-graphql";
import { IsEmailAlreadyExist } from '../validations/emailValidation';

@InputType()
export class RegisterInput {
  @Field()
  @Length(1, 255)
  firstName: string;

  @Field()
  @Length(1, 255)
  lastName: string;

  @Field()
  @Length(1, 255)
  username: string;

  @Field()
  birthday: Date;

  @Field()
  @IsEmail()
  @IsEmailAlreadyExist({message: "email already used"})
  email: string;

  @Field()
  password: string;
}
