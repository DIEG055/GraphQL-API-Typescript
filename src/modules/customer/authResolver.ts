import { Resolver, Mutation, Arg } from "type-graphql";
import * as bcrypt from "bcryptjs";

import { Customer } from "../../entity/Customer";
import { RegisterInput } from "./inputs/registerInput";

@Resolver()
export class RegisterResolver {
  @Mutation(() => Customer)
  async register(@Arg("data") data: RegisterInput): Promise<Customer> {
    const hashedPassword = await bcrypt.hash(data.password,10);
    const customer = await Customer.create({
      ...data,
      birthday: new Date(data.birthday),
      password: hashedPassword,
    }).save();
    return customer;
  }
}
