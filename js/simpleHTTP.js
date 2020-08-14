/**
 * SimpleHTTP library
 * Library for making simple HTTP requests
 * 
 * @version 0.1.0
 * @author Simon Ilincev
 * @license MIT
 * 
 */

class SimpleHTTP {
    async get(url) {
        const response = await fetch(url);
        const responseData = await response.json()

        return responseData;
    }
    async post(url, data) {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const responseData = await response.json()
        return responseData;
    }
    async put(url, data) {
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const responseData = await response.json()
        return responseData;
    }
    async delete(url) {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const responseData = "Resource successfully deleted!";
        return responseData;
    }
}