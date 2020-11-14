"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageResolver = exports.Notification = void 0;
const Message_1 = require("../entities/Message");
const type_graphql_1 = require("type-graphql");
const isAuth_1 = require("../middleware/isAuth");
const User_1 = require("../entities/User");
const graphql_subscriptions_1 = require("graphql-subscriptions");
let Notification = class Notification {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], Notification.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(() => User_1.User),
    __metadata("design:type", User_1.User)
], Notification.prototype, "sender", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], Notification.prototype, "text", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Notification.prototype, "createdAt", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Notification.prototype, "updatedAt", void 0);
Notification = __decorate([
    type_graphql_1.ObjectType()
], Notification);
exports.Notification = Notification;
let MessageResolver = class MessageResolver {
    sender(message, { userLoader }) { return userLoader.load(message.senderId); }
    messages() {
        return Message_1.Message.find({ order: { "createdAt": "ASC" } });
    }
    newMessage(message) {
        return Object.assign(Object.assign({}, message), { sender: User_1.User.findOne(message.senderId) });
    }
    message(id) {
        return Message_1.Message.findOne(id);
    }
    createMessage(text, { req }, pubSub) {
        return __awaiter(this, void 0, void 0, function* () {
            const senderId = req.session.userId;
            const message = yield Message_1.Message.create({ text, senderId }).save();
            yield pubSub.publish("NOTIFICATIONS", message);
            return message;
        });
    }
    updateMessage(id, text, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = yield Message_1.Message.findOne({ id, senderId: req.session.userId });
            if (!message)
                return undefined;
            if (typeof text !== 'undefined') {
                Message_1.Message.update({ id }, { text });
            }
            return message;
        });
    }
    deleteMessage(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Message_1.Message.delete(id);
            return true;
        });
    }
};
__decorate([
    type_graphql_1.FieldResolver(() => User_1.User),
    __param(0, type_graphql_1.Root()),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Message_1.Message, Object]),
    __metadata("design:returntype", void 0)
], MessageResolver.prototype, "sender", null);
__decorate([
    type_graphql_1.Query(() => [Message_1.Message]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MessageResolver.prototype, "messages", null);
__decorate([
    type_graphql_1.Subscription({ topics: "NOTIFICATIONS" }),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Message_1.Message]),
    __metadata("design:returntype", Message_1.Message)
], MessageResolver.prototype, "newMessage", null);
__decorate([
    type_graphql_1.Query(() => Message_1.Message, { nullable: true }),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MessageResolver.prototype, "message", null);
__decorate([
    type_graphql_1.Mutation(() => Message_1.Message),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Arg('text')),
    __param(1, type_graphql_1.Ctx()),
    __param(2, type_graphql_1.PubSub()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, graphql_subscriptions_1.PubSubEngine]),
    __metadata("design:returntype", Promise)
], MessageResolver.prototype, "createMessage", null);
__decorate([
    type_graphql_1.Mutation(() => Message_1.Message, { nullable: true }),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.Int)),
    __param(1, type_graphql_1.Arg('text', () => String, { nullable: true })),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], MessageResolver.prototype, "updateMessage", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MessageResolver.prototype, "deleteMessage", null);
MessageResolver = __decorate([
    type_graphql_1.Resolver(Message_1.Message)
], MessageResolver);
exports.MessageResolver = MessageResolver;
//# sourceMappingURL=message.js.map