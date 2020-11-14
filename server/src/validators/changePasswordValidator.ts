
export const changePasswordValidator = async ( newPassword : string , confirmPassword : string ) => {
    if(newPassword.length < 3) {
        return {
            errors : [{
                field: 'newPassword',
                message : 'رمز عبور بایستی بیشتر از دو کاراکتر باشد'
            }]
        }
    }
    if(newPassword !== confirmPassword){
        return {
            errors : [{
                field: 'confirmPassword',
                message : 'تکرار رمز عبور تطابق ندارد'
            }]
        }
    }
    return null
}