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
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordValidator = void 0;
exports.changePasswordValidator = (newPassword, confirmPassword) => __awaiter(void 0, void 0, void 0, function* () {
    if (newPassword.length < 3) {
        return {
            errors: [{
                    field: 'newPassword',
                    message: 'رمز عبور بایستی بیشتر از دو کاراکتر باشد'
                }]
        };
    }
    if (newPassword !== confirmPassword) {
        return {
            errors: [{
                    field: 'confirmPassword',
                    message: 'تکرار رمز عبور تطابق ندارد'
                }]
        };
    }
    return null;
});
//# sourceMappingURL=changePasswordValidator.js.map