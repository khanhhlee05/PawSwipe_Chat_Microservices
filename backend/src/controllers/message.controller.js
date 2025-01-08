import User from "../models/user.model.js"
import Message from "../models/message.model.js"
import cloudinary from "../lib/cloudinary.js"
import { getReceiverSocketId, io } from "../lib/socket.js"
import OpenAI from "openai"
export const getUsersForSidebar = async (req, res) => {
    try {

        const role = req.user.role
        let users = []
        let shelters = []
        if (role == "user"){
            const loggedInUserId = req.user._id
            shelters = await User.find({_id: {$ne: loggedInUserId}, role: "shelter"})
        } else {
            const loggedInUserId = req.user._id
            const messages = await Message.find({receiverId: loggedInUserId})
            const senderIds = messages.map(message => message.senderId)
            const uniqueSenderIds = [...new Set(senderIds)]
            users = await User.find({_id: {$in: uniqueSenderIds}, role: "user"})
        }
        const sidebarUsers = [...shelters, ...users]
        return res.status(200).json(sidebarUsers)
    } catch (error) {
        console.log("Error in getUsersForSidebar: ", error)
        return res.status(500).json({message: "Internal server error"})

    }
 }

 export const getMessages = async (req, res) => {
    try {
        const {id:userToChatId} = req.params
        const senderId = req.user._id

        const messages = await Message.find({
            $or: [{senderId: senderId, receiverId: userToChatId},
                {senderId: userToChatId, receiverId: senderId}]
        })

        return res.status(200).json(messages)
    } catch (error){
        console.log("Error in getMessages controller: ", error)
        return res.status(500).json({message: "Internal server error"})
    }
 }

 export const sendMessage = async (req, res) => {
    try {
        const {text, image} = req.body
        const {id:receiverId} = req.params
        const senderId = req.user._id

        let imageUrl
        if (image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url
        }

        const newMessage = new Message({
            senderId, 
            receiverId,
            text, 
            image: imageUrl
        })

        await newMessage.save()

        //TODO: real time functionalities with socket io
        const receiverSocketId = getReceiverSocketId(receiverId)
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }


        return res.status(201).json(newMessage)
    } catch (error) {
        console.log("Error in sendMessage", error)
        return res.status(500).json({message: "Internal server error"})
    }
}

const systemPrompt = `You are a PawSwipe AI assistant. 
You are a helpful assistant that can answer questions and help with task,
especially related to Pet Adoption policies and procedures and Pet care, pet related
task.

By default: just reply with one sentence max, unless the user ask for longer response`

export const sendAiMessage = async (req, res) => {
    try {
        const {text} = req.body
        const senderId = req.user._id

        const openai = new OpenAI({
            baseURL: "https://api.cerebras.ai/v1",
            apiKey: process.env.CEREBRAS_API
        })

        const completion = await openai.chat.completions.create({
            messages: [{role: 'system', content: systemPrompt}, ...data], 
            model: "llama3.1-70b"
          })

          return res.status(200).json(completion)
        
        
    } catch (error) {
        console.log("Error in sendAiMessage", error)
        return res.status(500).json({message: "Internal server error"})
    }
}               
