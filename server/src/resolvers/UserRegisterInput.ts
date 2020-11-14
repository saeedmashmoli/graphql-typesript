import { Field, InputType } from 'type-graphql';


@InputType()
export class UserRegisterInput {
    @Field()
    name?: string;
    @Field()
    mobile!: string;
    @Field()
    email?: string;
}
