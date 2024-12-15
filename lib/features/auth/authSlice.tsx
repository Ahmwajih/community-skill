import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { AppDispatch } from "@/lib/store";
import { auth as firebaseAuth } from "@/lib/firebase";
import { useRouter } from "next/router";

const url = process.env.NEXT_PUBLIC_BASE_URL;

interface UserInfo {
  id: string;
  name: string;
  email: string;
  password?: string;
  country?: string;
  role?: string;
  skills?: string[];
  skill_exchanges?: string[];
  reviews?: string[];
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
  isAdmin?: boolean;
  provider?: "email" | "google" | "github";
}

interface PasswordChangeInfo {
  currentPassword: string;
  newPassword: string;
}

interface UserProfileInfo {
  id: string;
}

interface AuthState {
  currentUser: UserInfo | null;
  token: string | null;
  email: string | null;
  role: string | null;
  provider: "email" | "google" | "github" | null;
  id: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  currentUser: typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem("currentUser") || "null") : null,
  token: typeof window !== "undefined" ? sessionStorage.getItem("token") : null,
  email: typeof window !== "undefined" ? sessionStorage.getItem("email") : null,
  role: typeof window !== "undefined" ? sessionStorage.getItem("role") : null,
  provider: null,
  id: typeof window !== "undefined" ? sessionStorage.getItem("id") : null,
  isAuthenticated: typeof window !== "undefined" ? !!sessionStorage.getItem("token") : false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authAll: (state, action: PayloadAction<AuthState>) => {
      state.currentUser = action.payload.currentUser;
      state.token = action.payload.token;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.provider = action.payload.provider;
      state.isAuthenticated = true;
    },
    setUser: (state, action: PayloadAction<UserInfo>) => {
      state.currentUser = action.payload;
    },
    clearUser: (state) => {
      state.currentUser = null;
    },
    logout: (state) => {
      state.currentUser = null;
      state.token = null;
      state.email = null;
      state.role = null;
      state.provider = null;
      state.isAuthenticated = false;
    },
  },
});

export const { authAll, logout, setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;

export const login = (userInfo: UserInfo, router: ReturnType<typeof useRouter>) => async (dispatch: AppDispatch) => {
  try {
    const res = await fetch(`${url}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userInfo),
    });

    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || "Login failed");

    const payload = {
      currentUser: {
        id: data.data.id,
        name: data.data.name,
        email: data.data.email,
        role: data.data.role,
        photo: data.data.photo,
        country : data.data.country,
        skills: data.data.skills,
        provider : data.data.provider,
        MemberSince: data.data.createdAt,
        isActive: data.data.isActive,
        isAdmin: data.data.isAdmin,
        update : data.data.updatedAt,
        languages: data.data.languages,
      },
      token: data.token,
      email: data.data.email,
      role: data.data.role,
      provider: "email",
      isAuthenticated: true,
    };

    dispatch(authAll(payload));

    if (typeof window !== "undefined") {
      sessionStorage.setItem("currentUser", JSON.stringify(payload.currentUser));
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("email", data.data.email);
      sessionStorage.setItem("role", data.data.role);
    }

    router.push("/main");
    toast.success("Logged in successfully!");
  } catch (error: any) {
    console.error("Login error:", error);
    toast.error(error.message || "Login failed. Please try again.");
  }
};

export const register = (userInfo: UserInfo, router: ReturnType<typeof useRouter>) => async (dispatch: AppDispatch) => {
  try {
    const res = await fetch(`${url}/api/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...userInfo, provider: userInfo.provider || "email" }), // Ensure provider is set
    });

    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || "Registration failed");

    const payload = {
      currentUser: {
        id: data.data.id,
        name: data.data.name,
        email: data.data.email,
        role: data.data.role,
      },
      token: data.token,
      email: data.data.email,
      role: data.data.role,
      provider: "email",
      isAuthenticated: true,
    };

    dispatch(authAll(payload));

    // Save session info
    if (typeof window !== "undefined") {
      sessionStorage.setItem("currentUser", JSON.stringify(payload.currentUser));
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("email", data.data.email);
      sessionStorage.setItem("role", data.data.role);
    }

    router.push("/main");
    toast.success("Registered successfully!");
  } catch (error: any) {
    console.error("Registration error:", error);
    toast.error(error.message || "Registration failed. Please try again.");
  }
};

export const logoutUser = (router: ReturnType<typeof useRouter>) => async (dispatch: AppDispatch) => {
  try {
    const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : "";

    if (!token) {
      throw new Error("No token found. Already logged out.");
    }

    // Sign out from Firebase
    await firebaseAuth.signOut();

    const res = await fetch(`${url}/api/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      dispatch(logout());
      sessionStorage.clear();
      router.push("/signin");
      toast.success("Logged out successfully!");
    } else {
      throw new Error("Failed to log out.");
    }
  } catch (error) {
    console.error("Logout error:", error);
    toast.error(error.message || "An error occurred. Please try again.");
  }
};

export const changePassword = (id: string, passwordChangeInfo: PasswordChangeInfo) => async (dispatch: AppDispatch) => {
  try {
    const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : "";

    if (!token) {
      throw new Error("No token found");
    }

    const res = await fetch(`${url}/api/users/change-password/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(passwordChangeInfo),
    });

    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || "Password change failed");

    toast.success("Password changed successfully!");
  } catch (error: any) {
    console.error("Password change error:", error);
    toast.error(error.message || "Failed to change password. Please try again.");
  }
};
export const fetchUserProfile = (userInfo: UserProfileInfo) => async (dispatch: AppDispatch) => {
  try {
    const res = await fetch(`${url}/api/users/${userInfo.id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${typeof window !== "undefined" ? sessionStorage.getItem("token") : ""}`,
      },
    });

    const data = await res.json();

    if (!data.success) throw new Error("User profile fetch failed");

    const payload = {
      currentUser: {
        id: data.data.id,
        name: data.data.name,
        email: data.data.email,
        role: data.data.role,
      },
      email: data.data.email,
      role: data.data.role,
      provider: "email",
      isAuthenticated: true,
    };

    dispatch(authAll(payload));
    if (typeof window !== "undefined") {
      sessionStorage.setItem("currentUser", JSON.stringify(payload.currentUser));
      sessionStorage.setItem("email", data.data.email);
      sessionStorage.setItem("role", data.data.role);
    }
  } catch (error: any) {
    console.error("Error fetching user profile:", error);
    toast.error("An error occurred while fetching the profile. Please try again.");
  }
};