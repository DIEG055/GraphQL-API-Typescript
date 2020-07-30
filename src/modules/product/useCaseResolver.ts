import { Product } from "../../entity/Product";
import { Double } from 'typeorm';
import {
  Resolver,
  Mutation,
  Arg,
  Query,
  InputType,
  Field,
} from "type-graphql";

@InputType()
class ProductInput {
  @Field()
  name!: string;

  @Field(() => Double)
  price!: number;

  @Field()
  description!: string;
}

@InputType()
class ProductUpdateInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => Double, { nullable: true })
  price?: number;

  @Field(() => String, { nullable: true })
  description?: string;
}

@Resolver()
export class ProductResolver {
  @Mutation(() => Product)
  async createProduct(
    @Arg("variables", () => ProductInput) variables: ProductInput
  ) {
    const newProduct = Product.create(variables);
    return await newProduct.save();
  }

  @Mutation(() => Boolean)
  async deleteProduct(@Arg("id", () => String) id: string) {
    await Product.delete(id);
    return true;
  }

  @Mutation(() => Product)
  async updateProduct(
    @Arg("id", () => String) id: string,
    @Arg("fields", () => ProductUpdateInput) fields: ProductUpdateInput
  ) {
    const updatedProduct = await Product.update({ id }, fields);
    return updatedProduct;
  }

  @Query(() => [Product])
  products() {
    return Product.find();
  }
  @Query(() => Product)
  productById(@Arg("id", () => String) id: string) {
    return Product.findOne(id);
  }
}
