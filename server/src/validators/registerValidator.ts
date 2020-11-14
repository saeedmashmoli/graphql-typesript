import { UserRegisterInput } from "src/resolvers/UserRegisterInput"

export const registerValidator = (options: UserRegisterInput , password : string) => {
    if(!options.email?.includes('@')){
        return [
            {
                field: 'email',
                message : 'ایمیل وارد شده معتبر نیست'
            }
        ];
    }
    if(options.mobile.length !== 11){
        return [
            {
                field: 'mobile',
                message : 'موبایل وارد شده اشتباه است'
            }
        ];
    }
    if(password.length < 3 ){
        return [
            {
                field: 'password',
                message : 'رمز عبور بایستی بیشتر از دو کاراکتر باشد'
            }
        ];
    }
    
    return null
}