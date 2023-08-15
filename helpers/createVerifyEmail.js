const { BASE_URL } = process.env;

const createVerifyEmail = ({ email, verificationToken }) => {
  const verifyEmail = {
    to: email,
    subject: "Confirm your email",
    html: `<h6>Thanks for joining us!</h6>
        <p>You will soon be able to use our contact book! 
        <br>There is only one step left, confirm your email
        👉<a href="${BASE_URL}/users/verify/${verificationToken}" target="_blank"> ${email} </a>👈
        <br>If you haven't registered, we suggest you ignore this letter 
        <br>and change your password to enter ${email}</з>`,
  };
  return verifyEmail;
};

export default createVerifyEmail;
