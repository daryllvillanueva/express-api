import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com"; //public api

//Replace the values below with your own before running this file.
const yourUsername = "";
const yourPassword = "";
const yourAPIKey = "";
const yourBearerToken = "";

app.get("/", (req, res) => { //home directory
  res.render("index.ejs", { content: "API Response." });
});

app.get("/noAuth", async (req, res) => {
  //NOTE: the data will be random since the endpoint of the public API's endpoint is /random
  //try catch block 
  try {
    const result = await axios.get(API_URL + "/random"); //use axios to get the api url, the result variable will be the data
    res.render("index.ejs", { content: JSON.stringify(result.data) }); 
    //once get the data, we pass it to the index.ejs 
    //with the response and render then use json stringify to become a single string instead of javascript object
  } catch (error) {
    res.status(404).send(error.message);
  }
});

app.get("/basicAuth", async (req, res) => {
  try {
    const result = await axios.get(API_URL + "/all?page=2", { //get the endpoint which will get the data just like in the noAuth
      auth: { //this is the authentication and it will do all of the Base64 encoding
        username: yourUsername,
        password: yourPassword,
      },
    });
    res.render("index.ejs", { content: JSON.stringify(result.data) }); //once the auth is done, convert it to string and send over to the front-end using the content:
  } catch (error) {
    res.status(404).send(error.message);
  }
});

app.get("/apiKey", async (req, res) => {
  try {
    const result = await axios.get(API_URL + "/filter", { //same as the noAuth and basicAuth but this time the url has query parameters
      params: {
        score: 5, //provide the value of score that we want to filter on
        apiKey: yourAPIKey, //this is important to access that score
      },
    });
    res.render("index.ejs", { content: JSON.stringify(result.data) });
  } catch (error) {
    res.status(404).send(error.message);
  }
});

const config = {
  headers: { Authorization: `Bearer ${yourBearerToken}` }, //headers is the parameter and Authorization as the key and value as Bearer then the token
};

app.get("/bearerToken", async (req, res) => {
  try {
    const result = await axios.get(API_URL + "/secrets/2", config); //get request
    res.render("index.ejs", { content: JSON.stringify(result.data) }); //get back the data and send it over to the front-end
  } catch (error) {
    res.status(404).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
