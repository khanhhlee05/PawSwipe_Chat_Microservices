import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/"

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    onlineUsers: [],
    socket: null,

    isChekingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check")
            set({authUser:res.data})
            get().connectSocket()
        } catch (error) {
            console.log("Error in checkAuth", error)
            set({authUser: null})

        } finally {
            set({isChekingAuth: false})
        }
    },

    signup: async (data) => {
        try {
            set({isSigningUp: true})
            const res = await axiosInstance.post("/auth/signup", data)
            set({authUser: res.data})
            
            toast.success("Account created succesfully")
            get().connectSocket()
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({isSigningUp : false})
        }
    },

    logout: async () => {
        try {
            axiosInstance.post("/auth/logout")
            set({authUser: null})
            get().disconnectSocket()
            toast.success("Logged out successfully")
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },

    login: async (data) => {
        try {
            set({isLoggingIn:true})
            const res = await axiosInstance.post("/auth/login", data)
            set({authUser : res.data })
            toast.success("Logged in successfully")
            get().connectSocket()
        } catch (error) {
            console.log(error.message)
            toast.error(error.response.data.message)
        } finally {
            set({isLoggingIn:false})
        }
    },

    updateProfile: async (data) => {
        try {
            set({isUpdatingProfile: true})
            const res = await axiosInstance.put("/auth/update-profile", data)
            set({authUser:res.data})
            toast.success("Updated profile picture")
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        } finally {
            set({isUpdatingProfile: false})
        }
    },

    connectSocket: () => {
        const {authUser} = get()
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id
            }
        })

        socket.connect()
        set({socket:socket})

        socket.on("getOnlineUsers", (userIds) => {
            set({onlineUsers: userIds})
        } )
    },

    disconnectSocket: () => {
        if (get().socket?.connected) {
            get().socket.disconnect()
        }
    }

}));