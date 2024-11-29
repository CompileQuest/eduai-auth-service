import axios from "axios"
async function PublishUserEvent(payload) {
    console.log("Sending event to User Service");
    console.log("sending this ", payload);
    try { 
        const response = await axios.post("http://localhost:8001/app-events", {
            payload,
        });
        console.log("Response received:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error sending customer event:", error.message);
        throw error;
    }

};



export {
    PublishUserEvent, 
}
