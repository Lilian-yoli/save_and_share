const querystring = require("query-string")


const redirectURI = "oauth/google"

function getGoogleAuthURL() {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
      redirect_uri: `http://localhost:8877/${redirectURI}`,
      client_id: "My Client ID",
      access_type: "offline",
      response_type: "code",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ].join(" "),
    };
  
    return `${rootUrl}?${querystring.stringify(options)}`;
  }

const getLoginUrl = async (req, res) => {
    console.log({getLoginUrl: "success!"})
    return res.send(getGoogleAuthURL())
}


function getTokens({
    code,
    clientId,
    clientSecret,
    redirectUri,
  }) {
    /*
     * Uses the code to get tokens
     * that can be used to fetch the user's profile
     */
    const url = "https://oauth2.googleapis.com/token";
    const values = {
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    };
  
    return axios
      .post(url, querystring.stringify(values), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((res) => res.data)
      .catch((error) => {
        console.error(`Failed to fetch auth tokens`);
        throw new Error(error.message);
      });
  }


const getGAccessToken = async (code) => {
    const { token_id, access_token } =
    await getTokens({
        code,
        clientId: "My Client ID",
        clientSecret: "My client Secret",
        redirectUri: `http://localhost:8877/${redirectURI}`,
      });
    console.log({token_id: token_id,
                 access_token: access_token})
    
    return access_token            
}

// getGAccessToken("4/0AfgeXvsVYUaNn0RzU22e0yZTtnMhTTk-R_d_a1ZZfZnDmtnI6VNoO8mXie0PVKAFhaCSMg")