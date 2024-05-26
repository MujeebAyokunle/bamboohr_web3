# Bamboohr_web3
Web3 assignment from bamboohr

### BASE_URL
[https://bamboohr-0a2aba2f352b.herokuapp.com/api/](https://bamboohr-0a2aba2f352b.herokuapp.com/api/)

## Endpoints and Sockets

#### Authentication Endpoints
```javascript
{
  endpoint: {
    path: "/register", //Create Account
    method: "POST",
    payload: {
      address: "", //wallet address
      password: "" //password
    }
  },
  endpoint: {
    path: "/login", //Login
    method: "POST",
    payload: {
      address: "", //wallet address
      password: "" //password
    }
  },
}
```

#### Socket events
```javascript
{
  Authorization: "Bearer auth_token", //auth_token is returned from authentication APIs
  Events: {
    event: "allevents", //All events
    event: "from_to_events", //Only events where an address is either the sender or receiver
    event: "from_events", //Only events where an address is the sender
    event: "to_events", //Only events where an address is the receiver     
    event: "events_0_100", //events within the ranges 0 - 100
    event: "events_100_500", //events within the ranges 100 - 500
    event: "events_500_2000", //events within the ranges 500 - 2000
    event: "events_2000_5000", //events within the ranges 2000 - 5000
    event: "events_gr_5000", //events within the ranges > 5000
  },
}
```
#### Socket connection using socket-io-client
```javascript
socketRef.current = io(`https://bamboohr-0a2aba2f352b.herokuapp.com`, {
            extraHeaders: {
                Authorization: `Bearer ${token}`
            }
        }).on('connect', () => {
          console.log("connected")
        }).on('disconnect', () => {
          console.log("disconnected")
        })
```

## Run
#### Install node modules
npm install
#### Local
npm run dev
#### Build
npm run build

#### Start
npm run start
