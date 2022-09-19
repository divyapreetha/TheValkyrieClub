import { ConnectWallet } from "@thirdweb-dev/react";
import { Web3Button } from "@thirdweb-dev/react";
import { useContract, useContractCall } from "@thirdweb-dev/react";
import { useState } from "react";
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import 'bulma/css/bulma.css' 
import CountdownTimer from "./components/CountdownTimer";
// import { Alert } from 'react-alert'
var web3 = require('web3');

export default function Home() {
  const { contract } = useContract("0x46d167DD45C6fEA0ed247Ffa46C6Ca125506Ce37");
  const [input, setInput] = useState('0.00005');
  const [entry, setEntry] = useState('0.00001');
  const someValue = web3.utils.toWei(input, 'ether');
  const entryValue = web3.utils.toWei(entry, 'ether');
  
  
  const CountdownTimer = ({ targetDate }) => {
    const [days, hours, minutes, seconds] = useCountdown(targetDate);
  
    if (days + hours + minutes + seconds <= 0) {
      return <ExpiredNotice />;
    } else {
      return (
        <ShowCounter
          days={days}
          hours={hours}
          minutes={minutes}
          seconds={seconds}
        />
      );
    }
  };

  return (
    <div className="styles.container">
      {/* The Tab Name */}
      <Head>
        <title>The Valkyrie Club</title>
        <meta name="description" content="Sports betting dApp - Created by - Curious Kitten" />
        <link rel="icon" href='../public/favicon.ico' />
      </Head>

      {/* Body of the Page */}
      <main className={styles.main}>

        {/* The Navbar  */}
      <nav className="mt-4 mb-4 ">
          <div className="container">
            <div className="navbar-brand">
              <div className={styles.myLogo}>
                <h1>The Valkyrie Club</h1>
                <p className={styles.tagLine}>Make money under one roof</p>
              </div>
            </div>
            <div className="navbar-end">
              <div className={styles.walletButton}>
                <ConnectWallet accentColor="#f213a4" colorMode="dark" />
                
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="container">
          <div className={styles.playArea}>
            <section className="mt-5">
              <div className="columns">
                {/* Admin Area */}
                <div className="column is-half">
                  <center className={styles.headings}>Admin Zone</center>

                  <div className="columns">
                    <section className="column is-half mt-5">
                    <Web3Button
                        // The contract address
                        contractAddress="0x46d167DD45C6fEA0ed247Ffa46C6Ca125506Ce37"
                        // Access the contract itself, perform any action you want on it:
                        action={(contract) =>
                          contract.call("startTheGame")
                        }
                        // Some customization of colors and styling
                        colorMode="dark"
                        accentColor="#f1c232"
                        // If the function is successful, we can do something here.
                        onSuccess={(result) => 
                          {
                            console.log(result)
                            const FIVE_MINUTES_IN_MS = 5 * 60 * 1000;
                            const NOW_IN_MS = new Date().getTime();

                            const dateTimeAfterFiveMinutes = NOW_IN_MS + FIVE_MINUTES_IN_MS;

                            return (
                              <div className="column is-half">
                                <p>Countdown Timer</p>
                                <CountdownTimer targetDate={dateTimeAfterFiveMinutes} />
                              </div>
                            );
                            }
                        }
                        // If the function fails, we can do something here.
                        onError={(error) => {
                          console.error(error)
                          alert("Error in starting the game")
                        }}
                      >
                        Start Game
                      </Web3Button>
                      
                      {/* <StartGame />
                      <button onclick={StartGame} className="button is-link is-large is-light mt-3">Start Game</button> */}
                    </section>

                    
                  </div>

                  <div className="columns mt-3">
                    <section className="column is-half">
                    <Web3Button
                        // The contract address
                        contractAddress="0x46d167DD45C6fEA0ed247Ffa46C6Ca125506Ce37"
                        // Access the contract itself, perform any action you want on it:
                        action={(contract) =>
                          contract.call("pickWinner")
                        }
                        // Some customization of colors and styling
                        colorMode="dark"
                        accentColor="#f1c232"
                        // If the function is successful, we can do something here.
                        onSuccess={(result) => 
                          {
                            console.log(result)
                            alert("Picked the Winner successfully")
                            }
                        }
                        // If the function fails, we can do something here.
                        onError={(error) => {
                          console.error(error)
                          alert("Error in picking the winner")
                        }}
                      >
                        Pick Winner
                      </Web3Button>
                      {/* <button className="button is-link is-large is-light mt-3">Pick Winner</button> */}
                    </section>

                    <section className="column is-half">
                    <Web3Button
                        // The contract address
                        contractAddress="0x46d167DD45C6fEA0ed247Ffa46C6Ca125506Ce37"
                        // Access the contract itself, perform any action you want on it:
                        action={(contract) =>
                          contract.call("payWinner")
                        }
                        // Some customization of colors and styling
                        colorMode="dark"
                        accentColor="#f1c232"
                        // If the function is successful, we can do something here.
                        onSuccess={(result) => 
                          {
                            console.log(result)
                            alert("All the winners are credited successfully")
                            }
                        }
                        // If the function fails, we can do something here.
                        onError={(error) => {
                          console.error(error)
                          alert("Error in crediting the game reward")
                        }}
                      >
                        Pay Winner
                      </Web3Button>
                      {/* <button className="button is-link is-large is-light mt-3">Pay Winner</button> */}
                    </section>
                  </div>

                  <div className="columns mt-3">
                  <section className="column is-half">
                  <Web3Button
                        // The contract address
                        contractAddress="0x46d167DD45C6fEA0ed247Ffa46C6Ca125506Ce37"
                        // Access the contract itself, perform any action you want on it:
                        action={(contract) =>
                          contract.call("toggleIsMintEnabled")
                        }
                        // Some customization of colors and styling
                        colorMode="dark"
                        accentColor="#f1c232"
                        // If the function is successful, we can do something here.
                        onSuccess={(result) => 
                          {
                            console.log(result)
                            alert("Minting is now enabled for winners")
                            }
                        }
                        // If the function fails, we can do something here.
                        onError={(error) => {
                          console.error(error)
                          alert("Error in enabling the mint")
                        }}
                      >
                        Grant Collectibles
                      </Web3Button>
                      {/* <button className="button is-link is-large is-light mt-3">Grant Collectibles</button> */}
                    </section>

                    <section className="column is-half">
                    <Web3Button
                        // The contract address
                        contractAddress="0x46d167DD45C6fEA0ed247Ffa46C6Ca125506Ce37"
                        // Access the contract itself, perform any action you want on it:
                        action={(contract) =>
                          contract.call("withdraw")
                        }
                        // Some customization of colors and styling
                        colorMode="dark"
                        accentColor="#f1c232"
                        // If the function is successful, we can do something here.
                        onSuccess={(result) => 
                          {
                            console.log(result)
                            alert("Withdrawal successful")
                            }
                        }
                        // If the function fails, we can do something here.
                        onError={(error) => {
                          console.error(error)
                          alert("Failure in withdrawal")
                        }}
                      >
                        Withdraw Funds
                      </Web3Button>
                      {/* <button className="button is-link is-large is-light mt-3">Withdraw Funds</button> */}
                    </section>
                  </div>
                  {/* <div className="columns mt-5"> */}
{/*                     
                    <section className="column is-half">
                    <Web3Button
                        // The contract address
                        contractAddress="0x46d167DD45C6fEA0ed247Ffa46C6Ca125506Ce37"
                        // Access the contract itself, perform any action you want on it:
                        action={(contract) =>
                          contract.call("getContractBalance")
                        }
                        // Some customization of colors and styling
                        colorMode="dark"
                        accentColor="#f1c232"
                        // If the function is successful, we can do something here.
                        onSuccess={(result) => 
                          {
                            console.log(result)
                            return (
                              <div className="column is-half">
                                <p>`${result}`</p>
                              </div>
                            );
                            }
                        }
                        // If the function fails, we can do something here.
                        onError={(error) => {
                          console.error(error)
                          return(<div className="column is-half">
                                <p>`${error}`</p>
                                
                          </div>);
                        }}
                      >
                        Check Funds
                      </Web3Button>
                      {/* <button className="button is-link is-large is-light mt-3">Check Funds</button> */}
                    {/* </section> */}
                     {/* */} */}

                    
                  {/* </div> */}

                  


                </div>

                {/* Player Area */}
                <div className="column is-half">
                  <center className={styles.headings}>Player Zone</center>

                  <section className="mt-5">
                    <p className={styles.instructions}>Pay Entry Fee: 0.00001 ETH</p>
                    <Web3Button
                        // The contract address
                        contractAddress="0x46d167DD45C6fEA0ed247Ffa46C6Ca125506Ce37"
                        // Access the contract itself, perform any action you want on it:
                        action={(contract) =>
                          {
                            contract.call("enterTheGame");
                            // contract.call.value(entryValue).gas(2300)("");
                                                      
                          }
                      }
                        // Some customization of colors and styling
                        colorMode="dark"
                        accentColor="#f1c232"
                        // If the function is successful, we can do something here.
                        onSuccess={(result) => 
                          {
                            console.log(result)
                            alert("You can now participate in betting")
                            }
                        }
                        // If the function fails, we can do something here.
                        onError={(error) => {
                          console.error(error)
                          alert("Error in paying the entry fee")
                        }}
                      >
                        Play Now
                      </Web3Button>
                    {/* <button className="button is-link is-large is-light mt-3">Play now</button> */}
                  </section>

                  <p className="mt-5">Minimum Bet Amount: 0.00005 ETH
                  <input type="number" placeholder="Enter your bet amount"  onInput={e => setInput(e.target.value)} value={input} required />
                  ETH</p>
                  
                                    
                  <div className="columns">
                    <section className="column is-half">
                    <Web3Button
                        // The contract address
                        contractAddress="0x46d167DD45C6fEA0ed247Ffa46C6Ca125506Ce37"
                        // Access the contract itself, perform any action you want on it:
                        action={(contract) =>
                          contract.call("betOnTeamA", {value: someValue, gas:2300 })
                        }
                        // Some customization of colors and styling
                        colorMode="dark"
                        accentColor="#f1c232"
                        // If the function is successful, we can do something here.
                        onSuccess={(result) => 
                          {
                            console.log(result)
                            alert("Betting on Team A - SUCCESS!")
                            }
                        }
                        // If the function fails, we can do something here.
                        onError={(error) => {
                          console.error(error)
                          alert("Betting on Team A - FAILURE!")
                        }}
                      >
                        Bet on Team A
                      </Web3Button>
                      {/* <button className="button is-link is-large is-light mt-3">Bet on Team A</button> */}
                    </section>

                    <section className="column is-half">
                    <Web3Button
                        // The contract address
                        contractAddress="0x46d167DD45C6fEA0ed247Ffa46C6Ca125506Ce37"
                        // Access the contract itself, perform any action you want on it:
                        
                        action={(contract) =>
                          contract.call("betOnTeamB", { value: someValue, gas:2300 })
                        }
                        // Some customization of colors and styling
                        colorMode="dark"
                        accentColor="#f1c232"
                        // If the function is successful, we can do something here.
                        onSuccess={(result) => 
                          {
                            console.log(result)
                            alert("Betting on Team B - SUCCESS!")
                            }
                        }
                        // If the function fails, we can do something here.
                        onError={(error) => {
                          console.error(error)
                          alert("Betting on Team B - FAILURE!")
                        }}
                      >
                        Bet on Team B
                      </Web3Button>
                      {/* <button className="button is-link is-large is-light mt-3">Bet on Team B</button> */}
                    </section>
                  </div>
                  
                  <section className="mt-5">
                    <p className={styles.instructions}>Results</p>
                    <Web3Button
                        // The contract address
                        contractAddress="0x46d167DD45C6fEA0ed247Ffa46C6Ca125506Ce37"
                        // Access the contract itself, perform any action you want on it:
                        action={(contract) =>
                          contract.call("claimNFT")
                        }
                        // Some customization of colors and styling
                        colorMode="dark"
                        accentColor="#f1c232"
                        // If the function is successful, we can do something here.
                        onSuccess={(result) => 
                          {
                            console.log(result)
                            alert("Congrats! You have claimed your NFT!")
                            }
                        }
                        // If the function fails, we can do something here.
                        onError={(error) => {
                          console.error(error)
                          alert("Error in minting your NFT!")
                        }}
                      >
                        Claim NFT
                      </Web3Button>
                    {/* <button className="button is-link is-large is-light mt-3"></button> */}
                  </section>

                </div>

                
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer Area */}
      <footer className={styles.footer}>
        <p className={styles.blink}>
          
              Give a chance to your destiny
          
        </p>
      </footer>
      
    </div>  
  );
}
