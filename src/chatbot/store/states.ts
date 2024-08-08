// Define the structure for each chat message
export interface ChatMessage {
    messageId: number; // Unique identifier for each message
    content: string;   // The actual message content
    timestamp: string; // Timestamp indicating when the message was sent
}

// Define the overall ChatState structure
export interface ChatState {
    messages: ChatMessage[]; // Array to hold all chat messages
    isLoading: boolean;      // Flag to indicate loading state
}

// Initial state for the chat module
const state: ChatState = {
    messages: [],    // Initialize with an empty array of messages
    isLoading: false, // Set loading to false initially
};

export default state;