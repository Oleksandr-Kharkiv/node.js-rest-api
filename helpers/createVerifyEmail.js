const { BASE_URL } = process.env;

const createVerifyEmail = ({email, verificationToken}) =>{
    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<p><a href="${BASE_URL}/users/verify/${verificationToken}" target="_blank">Click verify email</a></p>`
    }
    return verifyEmail;
}

export default createVerifyEmail;