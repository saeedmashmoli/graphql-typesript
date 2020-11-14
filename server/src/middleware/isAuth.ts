import { MyContext } from "src/types";
import { MiddlewareFn } from "type-graphql";

export const isAuth : MiddlewareFn<MyContext> = ({context} , next ) => {

    if(!context.req.session.userId){
        throw Error('ابتدا بایستی وارد سایت شوید')
    }
    return next()
}