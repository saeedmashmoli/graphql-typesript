import { Request , Response  } from "express";

import { Redis } from "ioredis";
import { createUserLoader } from "./utilis/CreateLoader";
import { createUpdootLoader } from "./utilis/createUpdootLoader";


export type MyContext = {
    req: Request & { session: Express.Session};
    res: Response;
    redis: Redis;
    userLoader: ReturnType<typeof createUserLoader>;
    updootLoader: ReturnType<typeof createUpdootLoader>;
}