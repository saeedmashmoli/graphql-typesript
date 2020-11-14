import { User } from '../entities/User';
import { MyContext } from 'src/types';
import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import argon2 from 'argon2';
import { COOKIE_NAME, EXPIRED_CHANGE_PASSWORD_TOKEN, FORGET_PASSWORD_PREFIX } from '../constants';
import { UserRegisterInput } from './UserRegisterInput';
import { registerValidator } from '../validators/registerValidator';
import { sendEmail } from '../utilis/sendEmail';
import {v4} from 'uuid';
import { changePasswordValidator } from '../validators/changePasswordValidator';


@ObjectType()
class FieldError {
    @Field()
    field: string;
    @Field()
    message: string;
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError] , {nullable : true})
    errors?: FieldError[];

    @Field(() => User , {nullable : true})
    user?: User;
}

const ProjectUrl = "http://localhost:3000";

@Resolver()
export class UserResolver {
    @Mutation(() => UserResponse)
    async changePassword(
        @Arg('token') token : string, 
        @Arg('newPassword') newPassword : string,
        @Arg('confirmPassword') confirmPassword : string,
        @Ctx() { redis , req } : MyContext
    ) : Promise<UserResponse> {
        const result = await changePasswordValidator(newPassword , confirmPassword)
        if(result) return result
        const redisKey = FORGET_PASSWORD_PREFIX + token
        const userId = await redis.get(redisKey)
        if(!userId){
            return {
                errors : [{
                    field: 'token',
                    message : 'درخواست مورد نظر فاقد اعتبار است'
                }]
            }
        }
        const userIdNum = parseInt(userId);
        const user = await User.findOne(userIdNum);
        if(!user){
            return {
                errors : [{
                    field: 'token',
                    message : 'درخواست مورد نظر فاقد اعتبار است'
                }]
            }
        }
        await User.update({id : userIdNum} , {
            password : await argon2.hash(newPassword)
        })
        redis.del(redisKey)
        req.session.userId = user.id;
        return { user }

    }


    @Mutation(() => Boolean)
    async forgetPassword(
        @Arg('email') email : string,
        @Ctx() { redis } : MyContext
    ){
        const user = await User.findOne({ where : {email}});
        if(!user){
            return false
        }
        const token = v4();
 
        redis.set(FORGET_PASSWORD_PREFIX + token, user.id , 'ex' , EXPIRED_CHANGE_PASSWORD_TOKEN);
        await sendEmail(
            email,
            `<a href=${ProjectUrl}/change-password/${token}>تغییر رمز عبور</a>`
        )

        return true
    }

    @Query( () => User , { nullable : true})
    me(@Ctx() { req } : MyContext){

        const id = req.session.userId
        if(!id){
            return null
        }
        return User.findOne(id);
    }

    @Mutation( () => UserResponse)
    async register(
        @Arg('options') options: UserRegisterInput,
        @Arg('password') password: string, 
        @Ctx() { req } : MyContext
    ) : Promise<UserResponse>{ 
        const errors = await registerValidator(options, password)
        if(errors) return {errors}
        const userExsists = await User.findOne({ mobile : options.mobile });
        if(userExsists){
            return { 
                errors : [{
                    field: 'mobile',
                    message : 'موبایل وارد شده قبلا ثبت نام کرده است'
                }],
            }
        }

        password = await argon2.hash(password);
        const user = await User.create({...options,password}).save()

        
        // store user in redis & cookie by qid
        req.session.userId = user.id;
        return {user};

    }
    @Mutation( () => UserResponse)
    async login(
        @Arg('username') username:string,
        @Arg('password') password: string, 
        @Ctx() { req } : MyContext
    ) : Promise<UserResponse>{ 
        const user = await User.findOne({ where : {mobile : username }});
        if(!user) {
            return { 
                errors : [{
                    field: 'username',
                    message : 'موبایل وارد شده در سامانه ثبت نام نکرده است'
                }],
            }
        }
        const valid = await argon2.verify(user.password,password);
        if(!valid){
            return { 
                errors : [{
                    field: 'password',
                    message : 'رمز عبور اشتباه است'
                }],
            }
        }

        req.session.userId = user.id;
        return {user};

    }
    @Mutation(() => Boolean)
    async logout(@Ctx() {req , res}: MyContext ){
        return new Promise((resolve) => {
            req.session.destroy((err) => {
                res.clearCookie(COOKIE_NAME);
                if(err){
                    resolve(false);
                    return;
                }
                resolve(true)
            })
        })
    }

}