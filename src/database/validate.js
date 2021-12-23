export default (db) => {
    const checkUser = async (username) => {
        let valid = false;
        await db.ref(`${username}`).once("value", (snap) => {
            if (snap.val() == null) {
                valid = true;
            } else {
                valid = false;
            }
        });
        return { valid: valid };
    };
    const encrypt = (str) => {
        return str;
    };
    const createUser = async (username, email, password) => {
        if ((await checkUser(username)).valid) {
            db.ref(`${username}`).set({
                username: username,
                password: encrypt(password),
                email: email,
                friends: [],
            });
            return { valid: true, username: username };
        } else {
            return { valid: false, username: username };
        }
    };
    const validateUser = async (username, password) => {
        let valid = false;
        let details = {};
        let msg = "";
        if (!(await checkUser(username)).valid) {
            await db.ref(`${username}`).once("value", (snap) => {
                if (
                    snap.val()?.username == username &&
                    snap.val()?.password == password
                ) {
                    details = snap.val();
                    valid = true;
                } else {
                    msg = "Password is incorrect";
                    valid = false;
                }
            });
        } else {
            msg = "User Name is not exists";
        }

        return { valid: valid, msg: msg, details: details };
    };
    return { checkUser, createUser, validateUser };
};
