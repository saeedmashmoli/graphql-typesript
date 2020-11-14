"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("dotenv-safe/config");
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const hello_1 = require("./resolvers/hello");
const message_1 = require("./resolvers/message");
const user_1 = require("./resolvers/user");
const ioredis_1 = __importDefault(require("ioredis"));
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const constants_1 = require("./constants");
const cors_1 = __importDefault(require("cors"));
const typeorm_1 = require("typeorm");
const User_1 = require("./entities/User");
const Message_1 = require("./entities/Message");
const Post_1 = require("./entities/Post");
const post_1 = require("./resolvers/post");
const Updoot_1 = require("./entities/Updoot");
const path_1 = __importDefault(require("path"));
const CreateLoader_1 = require("./utilis/CreateLoader");
const createUpdootLoader_1 = require("./utilis/createUpdootLoader");
const http_1 = __importDefault(require("http"));
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const conn = yield typeorm_1.createConnection({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        logging: true,
        migrations: [path_1.default.join(__dirname, "./migrations/*")],
        entities: [User_1.User, Message_1.Message, Post_1.Post, Updoot_1.Updoot]
    });
    conn.runMigrations();
    const app = express_1.default();
    const RedisStore = connect_redis_1.default(express_session_1.default);
    const redis = new ioredis_1.default(process.env.REDIS_URL);
    app.set("trust proxy", 1);
    app.use(cors_1.default({
        origin: [process.env.CORS_ORIGIN],
        credentials: true,
    }));
    app.use(express_session_1.default({
        name: constants_1.COOKIE_NAME,
        store: new RedisStore({
            client: redis,
            disableTouch: true
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            secure: constants_1.__prod__,
            httpOnly: true,
        },
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET,
        resave: false,
    }));
    const apolloServer = new apollo_server_express_1.ApolloServer({
        subscriptions: {
            path: "/subscriptions",
            onConnect() {
                console.log("connected to websocket");
            },
            onDisconnect: () => console.log('Disconnected to websocket'),
        },
        schema: yield type_graphql_1.buildSchema({
            resolvers: [hello_1.HelloResolver, message_1.MessageResolver, user_1.UserResolver, post_1.PostResolver],
            validate: false,
        }),
        context: ({ req, res }) => ({
            req,
            res,
            redis,
            userLoader: CreateLoader_1.createUserLoader(),
            updootLoader: createUpdootLoader_1.createUpdootLoader()
        })
    });
    apolloServer.applyMiddleware({ app, cors: false });
    const httpServer = http_1.default.createServer(app);
    apolloServer.installSubscriptionHandlers(httpServer);
    httpServer.listen(process.env.PORT, () => {
        console.log(`server is running on port ${process.env.PORT}`);
    });
});
main().catch(err => {
    console.log(err);
});
//# sourceMappingURL=index.js.map