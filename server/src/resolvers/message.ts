import { Message } from '../entities/Message';
import { MyContext } from 'src/types';
import { Arg, Ctx, Field, FieldResolver, Int,PubSub , Mutation, ObjectType,  Query, Resolver, Root, UseMiddleware, Subscription  } from 'type-graphql';
import { isAuth } from '../middleware/isAuth';
import { User } from '../entities/User';
import { PubSubEngine } from "graphql-subscriptions";





@ObjectType()
export class Notification {
  @Field()
  id: number;

  @Field(() => User)
  sender: User

  @Field({ nullable: true })
  text?: string;

  @Field()
  createdAt?: string;

  @Field()
  updatedAt?: string;
}

export interface NotificationPayload {
  id: number;
  text: string;
  senderId: number;
}



@Resolver(Message)
export class MessageResolver {
    
    @FieldResolver(() => User)
    sender( 
      @Root() message : Message,
      @Ctx() { userLoader } :MyContext
    ){return userLoader.load(message.senderId)}


    @Query( () => [Message])
    messages() : Promise<Message[]>{
        return Message.find({order : {"createdAt" : "ASC"}});
    }


    @Subscription({topics : "NOTIFICATIONS"})
    newMessage(
        @Root() message: Message,
    ): Message {
        return { ...message , sender : User.findOne(message.senderId) };
    }


    @Query(() => Message , {nullable : true } )
    message( @Arg('id', () => Int!) id: number) : Promise<Message | undefined>{
        return Message.findOne(id);
    }
    @Mutation(() => Message)
    @UseMiddleware(isAuth)
    async createMessage(
            @Arg('text') text: string,
            @Ctx() { req  } : MyContext,
            @PubSub() pubSub: PubSubEngine,
    ) : Promise<Message>{
        const senderId = req.session.userId;
        const message = await Message.create({ text , senderId }).save()
        await pubSub.publish("NOTIFICATIONS", message);
        return message;
    }
    @Mutation(() => Message  , {nullable : true})
    @UseMiddleware(isAuth)
    async updateMessage(
        @Arg('id', () => Int!) id: number,
        @Arg('text' , () => String , {nullable : true}) text: string,
        @Ctx() { req } : MyContext
    ) : Promise<Message | undefined>{
        const message = await Message.findOne({id , senderId : req.session.userId})
        if(!message) return undefined
        if(typeof text !== 'undefined' ) {
            Message.update({id} , {text})
        }
        return message;
    }
    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deleteMessage(@Arg('id', () => Int!) id: number) : Promise<Boolean>{
        await Message.delete(id)
        return true;
    }
}