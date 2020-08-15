import { Resolver, Mutation, Arg } from "type-graphql";
import * as bcrypt from "bcryptjs";

import { Customer } from "../../entity/Customer";
import { RegisterInput } from "./inputs/registerInput";
import { confirmationUrl } from "../../utils/confirmationUrl";
import { redis } from "../../redis";
import { sendEmail } from "../../utils/sendEmail";

@Resolver()
export class AuthResolver {
  @Mutation(() => Customer)
  async register(@Arg("data") data: RegisterInput): Promise<Customer> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const customer = await Customer.create({
      ...data,
      birthday: new Date(data.birthday),
      password: hashedPassword,
    }).save();
    await sendEmail(customer.email, await confirmationUrl(customer.id));
    return customer;
  }

  @Mutation(() => Customer, { nullable: true })
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<Customer | null> {
    const customer = await Customer.findOne({ where: { email } });
    if (!customer) return null;
    const valid = await bcrypt.compare(password, customer.password);
    if (!valid) return null;
    if (!customer.confirmed) return null;
    return customer;
  }

  @Mutation(() => Boolean)
  async confirmUser(@Arg("token") token: string): Promise<boolean> {
    const customerId = await redis.get(token);
    if (!customerId) return false;
    await Customer.update({ id: customerId }, { confirmed: true });
    await redis.del(token);
    return true;
  }
}
