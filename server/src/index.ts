import 'reflect-metadata';
import "dotenv-safe/config"
import express from 'express';
import { ApolloServer   } from 'apollo-server-express';
import { buildSchema  } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { MessageResolver } from './resolvers/message';
import { UserResolver } from './resolvers/user';
import Redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { COOKIE_NAME, __prod__ } from './constants';
import cors from 'cors';
import { createConnection } from 'typeorm'
import { User } from './entities/User';
import { Message } from './entities/Message';
import { Post } from './entities/Post';
import { PostResolver } from './resolvers/post';
import { Updoot } from './entities/Updoot';
import path from 'path';
import { createUserLoader } from './utilis/CreateLoader';
import { createUpdootLoader } from './utilis/createUpdootLoader';
import http from 'http'
import { MyContext } from './types';



const main = async () => {
    const conn =
      await createConnection({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        logging: true,
        // synchronize: true,
        migrations: [path.join(__dirname,"./migrations/*")],
        entities: [User , Message , Post , Updoot]
    });
    conn.runMigrations()
    const app = express();
    const RedisStore = connectRedis(session)
    const redis = new Redis(process.env.REDIS_URL)

    app.set("trust proxy", 1);
    app.use(cors({
        origin: [process.env.CORS_ORIGIN],
        credentials : true,
        
    }))
    app.use(
        session({
            name: COOKIE_NAME,
            store: new RedisStore({ 
                client: redis,
                disableTouch: true
            }),
            cookie: { 
                maxAge: 1000 * 60 * 60 * 24 * 30,  // one mounth
                secure: __prod__, // cookie work only in https
                httpOnly: true,
                // domain: __prod__ ? "" : undefined
                // sameSite: "lax", 
            },
            saveUninitialized: false,
            secret: process.env.SESSION_SECRET,
            resave: false,
        })
      )
 
    const apolloServer = new ApolloServer({
        
        subscriptions : {
            path:"/subscriptions",
            onConnect(){
                console.log("connected to websocket")
            },
            onDisconnect : () => console.log('Disconnected to websocket'),
        },
        schema : await buildSchema({
            
            resolvers: [HelloResolver , MessageResolver , UserResolver , PostResolver],
            validate: false,
        }),
        context : ({ req , res }) => ({ 
       
            req , 
            res , 
            redis , 
            userLoader : createUserLoader(),
            updootLoader : createUpdootLoader()
        })
    })
    apolloServer.applyMiddleware({ app , cors : false})
    const httpServer = http.createServer(app);
    apolloServer.installSubscriptionHandlers(httpServer);

    
    httpServer.listen(process.env.PORT,() => {
        console.log(`server is running on port ${process.env.PORT}`)
    })


}
main().catch(err => {
    console.log(err)
})
