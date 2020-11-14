"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerValidator = void 0;
exports.registerValidator = (options, password) => {
    var _a;
    if (!((_a = options.email) === null || _a === void 0 ? void 0 : _a.includes('@'))) {
        return [
            {
                field: 'email',
                message: 'ایمیل وارد شده معتبر نیست'
            }
        ];
    }
    if (options.mobile.length !== 11) {
        return [
            {
                field: 'mobile',
                message: 'موبایل وارد شده اشتباه است'
            }
        ];
    }
    if (password.length < 3) {
        return [
            {
                field: 'password',
                message: 'رمز عبور بایستی بیشتر از دو کاراکتر باشد'
            }
        ];
    }
    return null;
};
//# sourceMappingURL=registerValidator.js.map