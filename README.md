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
  - A NoSQL database for storing user, friend, group, and message data in collections.
- **JWT (JSON Web Tokens)**:
  - Implemented for authentication to ensure secure communication between the frontend and backend.
- **Java**:
  - The primary programming language for backend development.

### **Frontend**
- **React Native**:
  - A cross-platform framework for building a mobile application with a consistent UI across devices.
- **Expo**:
  - Streamlined development with tools and libraries for fast prototyping and deployment.
- **React Context API**:
  - Used for managing authentication and user state across the application.
- **React Hooks**:
  - Simplifies state and side-effect management, such as `useState` and `useEffect`.
- **Fetch API**:
  - For seamless interaction with backend APIs.

---

## **How the Application Works**

### **1. User Authentication**
- Users can register and log in using the authentication endpoints. JWT tokens are issued upon successful login and are used for subsequent API calls.

### **2. Friend Management**
- Users can search for other users and send friend requests. The backend ensures validation and manages the status of these requests.
- A dedicated screen displays all pending friend requests, which users can accept.

### **3. Group Management**
- Users can create new groups by providing a group name and adding friends as members.
- Group details are displayed, including the group name, creation date (stored as a string for simplicity), and a list of members.
- Users can add more members to a group after its creation.

### **4. Messaging**
- **One-to-One Chat**:
  - Users can send and receive messages in real time. Chat history is displayed, sorted from oldest to newest.
- **Group Chat**:
  - Users can send messages to all members of a group. The backend ensures that only group members can interact with the group.
  - Chat history is fetched and displayed in chronological order.

---

## **Installation**

### **Backend**
1. Clone the repository.
2. Configure MongoDB and ensure it is running locally or remotely.
3. Run the Spring Boot application using:
   ```bash
   mvn spring-boot:run
