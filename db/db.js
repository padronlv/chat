const spicedPg = require('spiced-pg');
var db;

if(process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    db = spicedPg('postgres:Victor:postgres@localhost:5432/chat');
}

module.exports.insertUser = function (name, email, password) {
    const q = `
        INSERT INTO users (name, email, hashed_password)
            VALUES ($1, $2, $3)
            RETURNING *
    `;
    const params = [ name || null , email || null, password || null];
    return db.query(q, params)
        .then(results => {
            console.log(results.rows);
            return results.rows[0];
        })
        .catch(err => {
            // console.log("this is workinggggggggggggggggg");
            return Promise.reject(err);
        });
};





module.exports.editProfile = function (userId, age, city, url) {
    const q = `
    INSERT INTO profiles (user_id, age, city, url)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (user_id)
    DO UPDATE SET age = $2, city = $3, url = $4
    RETURNING *
    `;
    const params = [userId || null , parseInt(age) || null, city || null, url || null];
    console.log(userId, parseInt(age), city, url);
    return db.query(q, params)
        .then(results => {
            return results.rows[0];
        })
        .catch(err => {
            console.log("this is workinggggggggggggggggg");
            return Promise.reject(err);
        });
};




module.exports.getYourUserByEmail = function (email) {
    const q = `
        SELECT * FROM users WHERE email = $1
    `;
    const params = [email];
    return db.query(q, params)
        .then(results => {
            return results.rows[0];
        });
};

module.exports.getYourUserInfo = function (userId) {
    const q = `
    SELECT *
    FROM users
    WHERE users.id = $1
    `;
    const params = [userId];
    return db.query(q, params)
        .then(results => {
            return results.rows[0];
        });
};

module.exports.addImage = function (userId, url) {
    const q = `
    UPDATE users
    SET profile_pic = $2
    WHERE id = $1
    RETURNING *
    `;
    const params = [ userId || null , url || null];
    return db.query(q, params)
        .then(results => {
            return results.rows[0];
        })
        .catch(err => {
            // console.log("this is workinggggggggggggggggg");
            return Promise.reject(err);
        });
};

module.exports.getUsersByIds = function(arrayOfIds) {
    const query = `SELECT * FROM users WHERE id = ANY($1)`;
    return db.query(query, [arrayOfIds])
        .then(results => {
            console.log(results.rows);
            return results.rows;
        });
};

module.exports.getChatMessages = function () {
    return db.query(`
    SELECT users.name, public_messages.id, public_messages.user_id, public_messages.message, public_messages.created_at
    FROM public_messages
    JOIN users
    ON users.id = public_messages.user_id
    ORDER BY public_messages.id DESC LIMIT 10;`)
        .then(results => {
            // console.log(results.rows);
            return(results.rows);
        }).catch(err => {
            console.log(err);
        });
};

module.exports.addChatMessage = function (userId, message) {
    const q = `
        INSERT INTO public_messages (user_id, message)
            VALUES ($1, $2)
            RETURNING *
    `;
    const params = [ userId || null, message || null];
    return db.query(q, params)
        .then(results => {
            return results.rows[0];
        })
        .catch(err => {
            // console.log("this is workinggggggggggggggggg");
            return Promise.reject(err);
        });
};

module.exports.getPrivateMessages = function (userId) {
    const q = `
    SELECT * FROM private_messages
    WHERE sender_id = $1 OR receiver_id = $1
    ORDER BY id DESC
    `;
    const params = [userId];
    return db.query(q, params)
        .then(results => {
            // console.log(results.rows);
            return(results.rows);
        }).catch(err => {
            console.log(err);
        });
};

module.exports.addPrivateMessage = function (senderId, receiverId, message) {
    const q = `
        INSERT INTO private_messages (sender_id, receiver_id, message)
            VALUES ($1, $2, $3)
            RETURNING *
    `;
    const params = [ senderId || null , receiverId || null, message || null];
    return db.query(q, params)
        .then(results => {
            return results.rows[0];
        })
        .catch(err => {
            // console.log("this is workinggggggggggggggggg");
            return Promise.reject(err);
        });
};
