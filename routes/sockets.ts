import "../env";
import { Socket } from "socket.io";
import { authorizeUser } from "../services/helpers";
import { Server as socketIoServer } from "socket.io";
import { ethers } from "ethers";
import { env } from "node:process";
import PQueue from "p-queue";

const providersenv: string[] =
  env.ALCHEMYWSLURL || env.INFURAWSLURL
    ? [env.ALCHEMYWSLURL || "", env.INFURAWSLURL || ""]
    : [];
console.log("wslurl", providersenv);
const providers = providersenv.map(
  (url: string) => new ethers.WebSocketProvider(url)
);

// Index to keep track of the current provider being used
let currentProviderIndex = 0;

// Function to switch to the next available provider
function switchProvider() {
  currentProviderIndex = (currentProviderIndex + 1) % providers.length;
  return providers[currentProviderIndex];
}

// Connect to the initial provider
let provider = providers[currentProviderIndex];

export class SocketsEvents {
  static SocketRoute = (app: any) => {
    let user_data: any = {};
    const io = new socketIoServer(app, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["Authorization"],
        credentials: true,
      },
    });

    // Limit maximum no. of concurrent requests on a single ether websocket to 200
    const queue = new PQueue({ concurrency: 100 });

    io.use(async (socket, next) => {
      const token = socket.handshake.headers["authorization"] || "";

      const authorized = await authorizeUser(token);

      if (!authorized) {
        console.log("unauthorized access");
        next(new Error("Unauthorized"));
        return;
      } else {
        // console.log("authorized", authorized)
        user_data = authorized;
        next();
      }
    }).on("connection", (socket: Socket) => {
      console.log("connection successful");
      //   console.log("user_data", user_data);

      socket.on("disconnect", () => {
        console.log("client disconnected successfully");
      });

      socket.on("disconnect", () => {
        console.log("disconnected");
      });

      // Block chain connection
      const handleNewBlock = async (blockNumber: string) => {
        try {
          const block = await provider.getBlock(blockNumber);

          const transactions = block?.transactions || [];

          transactions.forEach(async (transhash) => {
            // Limiting maximum number of concurrent requests on a single ether websocket
            queue.add(async () => {
              try {
                const trans = await provider.getTransaction(transhash);

                // convert wei to ether
                const eth_val = ethers.formatEther(trans?.value || 0);

                //   convert ether to US dollar equivalent
                const usd_value = parseFloat(eth_val) * 5000;

                // Retrieve transaction details
                let transactionDetails = {
                  blockNumber: trans?.blockNumber,
                  blockHash: trans?.blockHash,
                  sender: trans?.from,
                  receiver: trans?.to,
                  transactionHash: trans?.hash,
                  gasPrice: trans?.gasPrice?.toString(),
                  value: trans?.value?.toString(),
                };

                // All users event
                io.emit("allevents", transactionDetails);

                // only events where address is either the sender or receiver
                if (
                  user_data.address == trans?.from ||
                  user_data.address == trans?.to
                ) {
                  socket.emit("from_to_events", transactionDetails);
                }

                // only events where address is sender
                if (user_data.address == trans?.from) {
                  socket.emit("from_events", transactionDetails);
                }

                // only events where address is receiver
                if (user_data.address == trans?.to) {
                  socket.emit("to_events", transactionDetails);
                }

                // only events where worth is between $0 - $100
                if (usd_value >= 0 && usd_value <= 100) {
                  socket.emit("events_0_100", transactionDetails);
                }

                // only events where $100 <= worth <= $500
                if (usd_value >= 100 && usd_value <= 500) {
                  socket.emit("events_100_500", transactionDetails);
                }

                // only events where $500 <= worth <= $2000
                if (usd_value >= 500 && usd_value <= 2000) {
                  socket.emit("events_500_2000", transactionDetails);
                }

                // only events where $2000 <= worth <= $5000
                if (usd_value >= 2000 && usd_value <= 5000) {
                  socket.emit("events_2000_5000", transactionDetails);
                }

                // only events where worth > $5000
                if (usd_value > 5000) {
                  socket.emit("events_gr_5000", transactionDetails);
                }
              } catch (error: any) {
                if (error?.error?.code == 429) {
                  //   App has exceeded its compute units per second capacity using alchemy provider
                } else if (error?.error?.code == -32005) {
                  //   App has exceeded its compute units per second capacity using infura provider
                } else {
                  console.log("error fetching transaction:", error?.error);
                }
              }
            });
          });
        } catch (error) {
          switchProvider();
          provider.off("block", handleNewBlock);
          provider.on("block", handleNewBlock);
        }
      };

      provider.on("block", handleNewBlock);
    });
  };
}
