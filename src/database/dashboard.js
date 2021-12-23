// import db from "./index";
export default (db) => {
    const getFriends = async (username) => {
        let val = [];
        await db.ref(`/${username}/friends`).once("value", (snap) => {
            val = snap.val();
        });
        return val;
    };
    const addFriends = async (username, friend) => {
        let res = false;
        if (username == friend) return res;
        await db.ref(`/${username}/friends`).once("value", async (snap) => {
            let val = snap.val();
            if (val == null) {
                val = [friend];
                await db.ref(`/${username}/friends`).set(val);
                res = true;
            } else if (!val.includes(friend)) {
                val.push(friend);
                await db.ref(`/${username}/friends`).set(val);
                res = true;
            }
        });
        return res;
    };
    const message = async (username, friend, msg) => {
        let data = {
            msg: msg,
            friend: friend,
            time: new Date().getTime(),
        };
        db.ref(`/${username}/conservations/${friend}`).push().set(data);
        db.ref(`/${friend}/conservations/${username}`).push().set(data);
    };
    const search = async (key) => {
        let val;
        await db.ref().once("value", (snap) => {
            val = snap.val();
        });
        if (key in Object.keys(val)) {
            return true;
        } else {
            return false;
        }
    };
    return { getFriends, addFriends, message, search };
};
