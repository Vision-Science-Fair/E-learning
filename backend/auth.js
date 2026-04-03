// Firebase Auth Service
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    GoogleAuthProvider, 
    signInWithPopup, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    query, 
    where, 
    getDocs, 
    orderBy, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyChyuKZ5K58itz0Nwi80IyA5avXpOkrgA0",
  authDomain: "learnnest-8d178.firebaseapp.com",
  projectId: "learnnest-8d178",
  storageBucket: "learnnest-8d178.firebasestorage.app",
  messagingSenderId: "430095556563",
  appId: "1:430095556563:web:e7db68f5e948c8a62f1926",
  measurementId: "G-SXL1MX976H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Sign Up
export const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

// Sign In
export const signin = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

// Google Sign In
export const googleSignIn = () => {
    return signInWithPopup(auth, googleProvider);
};

// Sign Out
export const logout = () => {
    return signOut(auth);
};

// Listen to Auth State
export const onAuthUpdate = (callback) => {
    onAuthStateChanged(auth, callback);
};

// Route Guard - Redirect if not logged in
export const protectRoute = () => {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            window.location.href = 'signin.html';
        }
    });
};

// Firestore Functions
// Firestore Functions
export const saveQuizResult = async (userId, userEmail, resultData) => {
    try {
        const docRef = await addDoc(collection(db, "quiz_results"), {
            userId: userId,
            userEmail: userEmail,
            score: resultData.score,
            total: resultData.total,
            subject: resultData.subject,
            grade: resultData.grade,
            errors: resultData.errors || [],
            timestamp: serverTimestamp()
        });
        console.log("Quiz result saved with ID: ", docRef.id);
    } catch (error) {
        console.error("Error saving quiz result: ", error);
    }
};

// Simplified version for Parent to see child results by linking an email
export const getResultsByEmail = async (email) => {
    try {
        const q = query(
            collection(db, "quiz_results"), 
            where("userEmail", "==", email.toLowerCase())
        );
        const querySnapshot = await getDocs(q);
        let results = [];
        querySnapshot.forEach((doc) => {
            results.push({ id: doc.id, ...doc.data() });
        });
        results.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
        return results;
    } catch (error) {
        console.error("Error fetching results by email: ", error);
        return [];
    }
};

export const setUserRole = async (userId, role, parentId = null) => {
    try {
        await addDoc(collection(db, "user_profiles"), {
            userId: userId,
            role: role,
            parentId: parentId,
            timestamp: serverTimestamp()
        });
    } catch (error) {
        console.error("Error setting user role: ", error);
    }
};

export const linkChild = async (parentUid, childEmail) => {
    try {
        // Find student by email in auth (Note: simple version uses Firestore lookups)
        // In a real app, you'd use a Cloud Function. For now, we link via email in a 'links' collection.
        await addDoc(collection(db, "parent_child_links"), {
            parentId: parentUid,
            childEmail: childEmail.toLowerCase(),
            status: "active",
            timestamp: serverTimestamp()
        });
        return { success: true };
    } catch (error) {
        console.error("Error linking child: ", error);
        return { success: false, error: error.message };
    }
};

export const getChildrenResults = async (parentUid) => {
    // 1. Get linked emails
    const qLinks = query(collection(db, "parent_child_links"), where("parentId", "==", parentUid));
    const linkSnap = await getDocs(qLinks);
    const emails = linkSnap.docs.map(doc => doc.data().childEmail);

    if (emails.length === 0) return [];

    // 2. This is a simplified version. In production, we'd store child's UID.
    // For this prototype, we'll fetch results for these children.
    // (Requires a small adjustment to saveQuizResult to include email, or better, link by UID)
    return emails; 
};

export const getUserStats = async (userId) => {
    try {
        const q = query(
            collection(db, "quiz_results"), 
            where("userId", "==", userId)
        );
        const querySnapshot = await getDocs(q);
        let results = [];
        querySnapshot.forEach((doc) => {
            results.push({ id: doc.id, ...doc.data() });
        });
        
        results.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
        return results;
    } catch (error) {
        console.error("Error fetching stats: ", error);
        return [];
    }
};

export { auth, db };
