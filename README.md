# **Howudoin: A Social Messaging Application**

Howudoin is a comprehensive social messaging platform designed to enable real-time communication, friend management, and group interactions. This project implements a feature-rich messaging system, allowing users to interact with friends, join groups, and exchange messages efficiently. The application is built with a robust backend powered by Spring Boot and MongoDB, and a dynamic frontend using React Native.

---

## **Features**

### **Backend Features**
1. **User Management**:
   - User registration and login with JWT-based authentication for secure API interactions.
   - Storage of user data in a MongoDB database, including friend lists and friend requests.

2. **Friendship System**:
   - Ability to send and accept friend requests.
   - Secure and efficient handling of friend relationships between users.

3. **Group Management**:
   - Creation of groups with a unique name and addition of multiple members.
   - Retrieval of group details, including the group name, creation time, and members.

4. **Messaging**:
   - One-to-one real-time messaging between users.
   - Group messaging to facilitate discussions among multiple users.
   - Fetching and displaying conversation history for both individual chats and group messages.

5. **Security**:
   - JWT (JSON Web Token) authentication to ensure secure API communication.
   - CORS configuration to support frontend-backend interaction.

6. **RESTful API Endpoints**:
   - User management: `/auth/register`, `/auth/login`.
   - Friend management: `/friends/add`, `/friends/accept`.
   - Group management: `/groups/create`, `/groups/{groupId}/add-member`, `/groups/{groupId}/messages`.
   - Messaging: `/messages/send`, `/messages/messages`.

---

### **Frontend Features**
1. **Dynamic and Intuitive User Interface**:
   - A responsive React Native interface that provides a seamless experience across devices.
   - Navigation powered by `expo-router` for a clean and modular structure.

2. **Friendship Features**:
   - Search for users and send friend requests through a dedicated interface.
   - View pending friend requests and accept them.

3. **Group Features**:
   - Create groups and add members from your friends list.
   - View group details, including the group name, creation date, and member list.
   - Enter a group chat and send/receive messages.

4. **Messaging**:
   - Real-time chat interface for one-to-one and group conversations.
   - Fetch and display chat history efficiently, with the newest messages at the bottom.

5. **Error Handling and Feedback**:
   - Graceful error handling with user-friendly messages.
   - Visual feedback for loading and request status.

---

## **Technologies Used**

### **Backend**
- **Spring Boot**:
  - Used to build a robust and scalable RESTful API for the application.
  - Provides seamless integration with MongoDB, security with Spring Security, and support for JSON serialization.
- **MongoDB**:
  - A NoSQL database for storing user, friend, group, and
