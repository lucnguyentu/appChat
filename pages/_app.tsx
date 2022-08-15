import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/firebase";
import { useEffect } from "react";
import Loading from "../components/Loading";
import Login from "./login";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

function MyApp({ Component, pageProps }: AppProps) {
    const [loggedInUser, loading, _error] = useAuthState(auth);

    useEffect(() => {
        const setUserInDb = async () => {
            try {
                // write again a document in firebase
                await setDoc(
                // this is a document that we want to write to collection users in db
                // and the last param is a key to identify user(at here, we use uid to make key)
                doc(db, "users", loggedInUser?.uid as string),

                // data need write to this collection
                {
                    email: loggedInUser?.email,
                    lastSeen: serverTimestamp(),
                    photoURL: loggedInUser?.photoURL,
                },

                // if we login > 2 times with same email, it wil not create data same as above, just timestamp was changed
                {
                    merge: true,
                }
                );
            } catch (error) {
                console.log("Error setting user in db: ", error);
            }
        };

        if (loggedInUser) {
            setUserInDb();
        }
    }, [loggedInUser]);

    if (loading) return <Loading />;

    if (!loggedInUser) return <Login />;

    return <Component {...pageProps} />;
}

export default MyApp;
