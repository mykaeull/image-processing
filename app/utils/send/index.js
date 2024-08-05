'use client'

async function send(message, canloadImage = true, data = undefined) {
    console.log(message);
    const obj = {
        message,
        data,
    };

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify(obj),
    };

    fetch("http://localhost:4000/", options);
}

export default send;