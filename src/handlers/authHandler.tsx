import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { Loader } from "lucide-react";
import { useLocation } from "react-router-dom";
import { db } from "@/config/firebase.config";
import { User } from "@/types";

const AuthHandler = () => {
  const { isLoaded, isSignedIn } = useAuth(); // wait for auth to load
  const { isLoaded: userLoaded, user } = useUser(); // wait for user info
  const pathName = useLocation().pathname;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storeUserData = async () => {
      // ✅ Wait until auth and user are fully loaded
      if (!isLoaded || !userLoaded) return;

      if (!isSignedIn || !user?.id) return;

      setLoading(true);

      try {
        const userRef = doc(db, "users", user.id);

        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          const userData: User = {
            id: user.id,
            name: user.fullName || user.firstName || "Anonymous",
            email: user.primaryEmailAddress?.emailAddress || "N/A",
            imageUrl: user.imageUrl || "",
            createdAt: serverTimestamp(),
            updateAt: serverTimestamp(),
          };

          await setDoc(userRef, userData);
          console.log("✅ User stored in Firestore");
        }
      } catch (error: any) {
        console.error("❌ Error storing user data:", error.message || error);
      } finally {
        setLoading(false);
      }
    };

    storeUserData();
  }, [isLoaded, userLoaded, isSignedIn, user, pathName]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-6">
        <Loader className="w-5 h-5 animate-spin text-orange-500" />
      </div>
    );
  }

  return null;
};

export default AuthHandler;
