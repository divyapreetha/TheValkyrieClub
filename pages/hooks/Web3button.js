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
                        Pay Winner
                      </Web3Button>
