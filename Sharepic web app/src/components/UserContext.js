import React, { useEffect } from "react";
import { auth, firestore } from "./firebase";

export const UserContext = React.createContext(null);

function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = React.useState(null);
  const [isInitialising, setIsInitialising] = React.useState(true);

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      setCurrentUser(authUser);
      setIsInitialising(false);
      if (authUser) {
        firestore
          .collection("users")
          .doc(authUser.uid)
          .onSnapshot((doc) => {
            // console.log("snapshot ran")
            if (doc.data().uid) {
              setCurrentUser(doc.data());
            } else {
              var _user = {
                email: doc.data().email,
                displayName: doc.data().username,
                picUrl: doc.data().picUrl,
                uid: doc.id,
              };
              setCurrentUser(_user);
            }
          });
      }
    });
  }, [setCurrentUser]);

  const divStyle = {
    width: "100%",
    height: "100vh",
    position: "fixed",
    top: "0",
    background: "#ececec",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  };
  if (isInitialising) {
    return (
      <div style={divStyle}>
        <img
          width="300px"
          style={{ objectFit: "contain" }}
          src="./images/logo.png"
          alt="logo"
        />
        Loading...
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ currentUser }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
