// src/services/authService.js
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/config";

class AuthService {
  // Register new user
  async register(userData) {
    try {
      // Validate required fields
      if (!userData.email || !userData.password || !userData.fullname || !userData.username) {
        return {
          success: false,
          error: 'Email, password, fullname, and username are required.'
        };
      }

      // 1. Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );

      const user = userCredential.user;

      // 2. Update display name
      await updateProfile(user, {
        displayName: userData.fullname
      });

      // 3. Save additional user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullname: userData.fullname,
        username: userData.username,
        email: userData.email,
        createdAt: new Date().toISOString(),
        role: "customer",
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.fullname)}&background=0d9488&color=fff`
      });

      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          displayName: userData.fullname,
          username: userData.username
        }
      };
    } catch (error) {
      console.error("Register error:", error);
      return {
        success: false,
        error: this.handleAuthError(error)
      };
    }
  }

  // Login user
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};

      // Save to localStorage
      const userInfo = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        username: userData.username || '',
        avatar: userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&background=0d9488&color=fff`,
        role: userData.role || 'customer'
      };

      localStorage.setItem('user', JSON.stringify(userInfo));
      localStorage.setItem('token', await user.getIdToken());

      return {
        success: true,
        user: userInfo
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: this.handleAuthError(error)
      };
    }
  }

  // Logout user
  async logout() {
    try {
      await signOut(auth);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return {
        success: false,
        error: "Logout failed"
      };
    }
  }

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  }

  // Check if user is logged in
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  // Handle Firebase Auth errors
  handleAuthError(error) {
    const errorMessages = {
      'auth/email-already-in-use': 'Email sudah terdaftar. Silakan gunakan email lain.',
      'auth/invalid-email': 'Format email tidak valid.',
      'auth/operation-not-allowed': 'Operasi tidak diizinkan.',
      'auth/weak-password': 'Password terlalu lemah. Minimal 6 karakter.',
      'auth/user-disabled': 'Akun ini telah dinonaktifkan.',
      'auth/user-not-found': 'Email tidak terdaftar.',
      'auth/wrong-password': 'Password salah.',
      'auth/invalid-credential': 'Email atau password salah.',
      'auth/too-many-requests': 'Terlalu banyak percobaan login. Coba lagi nanti.',
      'auth/network-request-failed': 'Koneksi internet bermasalah.'
    };

    return errorMessages[error.code] || `Terjadi kesalahan: ${error.message}`;
  }
}

export default new AuthService();