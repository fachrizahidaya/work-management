import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("app.db");

export const init = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS user (
          id INTEGER PRIMARY KEY NOT NULL,
          data TEXT,
          token TEXT
      );`,
        [],
        () => resolve(),
        (_, err) => {
          console.log("Error creating users table:", err);
          reject(err);
        }
      );
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS agreement (
          id INTEGER PRIMARY KEY NOT NULL,
          eula TEXT
      );`,
        [],
        () => resolve(),
        (_, err) => {
          console.log("Error creating agreements table:", err);
          reject(err);
        }
      );
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS firebase (
          id INTEGER PRIMARY KEY NOT NULL,
          token TEXT
      );`,
        [],
        () => resolve(),
        (_, err) => {
          console.log("Error creating firebases table:", err);
          reject(err);
        },
        resolve,
        reject
      );
    });
  });
};

export const insertUser = (data, token) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO user (data, token) VALUES (?, ?);",
        [data, token],
        () => resolve(),
        (_, err) => reject(err)
      );
    });
  });
};

export const insertFirebase = (firebaseToken) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO firebase (token) VALUES (?);",
        [firebaseToken],
        () => resolve(),
        (_, err) => reject(err)
      );
    });
  });
};

export const insertAgreement = (agree) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO agreement (eula) VALUES (?);",
        [agree],
        (_, result) => resolve(result),
        (_, err) => reject(err)
      );
    });
  });
};

export const fetchUser = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM user;",
        [],
        (_, result) => resolve(result.rows._array),
        (_, err) => reject(err)
      );
    });
  });
};

export const fetchAgreement = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM agreement;",
        [],
        (_, result) => resolve(result.rows._array),
        (_, err) => reject(err)
      );
    });
  });
};

export const fetchFirebase = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM firebase;",
        [],
        (_, result) => resolve(result.rows._array),
        (_, err) => reject(err)
      );
    });
  });
};

export const deleteUser = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM user;",
        [],
        (_, result) => resolve(result),
        (_, err) => reject(err)
      );
    });
  });
};

export const deleteFirebase = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM firebase;",
        [],
        (_, result) => resolve(result),
        (_, err) => reject(err)
      );
    });
  });
};
