import { Field, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn , BaseEntity, OneToMany } from "typeorm";
import { Message } from "./Message";
import { Post } from "./Post";
import { Updoot } from "./Updoot";

@ObjectType()
@Entity()
export class User extends BaseEntity {

    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column({unique : true})
    mobile!: string;

    @Field()
    @Column({ nullable : true})
    name: string;

    @Field() 
    @Column({ nullable : true })
    email!: string;

    @Field()
    @Column()
    password!: string;

    @Field()
    @Column({type : 'boolean' , default : false})
    active!: string;

    @OneToMany(() => Message, (message) => message.sender)
    messages: Message[];

    @OneToMany(() => Post, (post) => post.creator)
    posts: Post[];

    @OneToMany(() => Updoot, (updoot) => updoot.user)
    updoots: Updoot[];

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;

}