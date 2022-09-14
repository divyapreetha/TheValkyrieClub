// SPDX-License-Identifier: MIT

pragma solidity ^0.8.16;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol"; 
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

//Define our contract
contract TheValkyrieClub is ERC721URIStorage, VRFConsumerBase, Ownable {

    using SafeMath for uint;
    using SafeMath for uint8;

    using Counters for Counters.Counter;
    Counters.Counter private totalSupply;
    // The URI which can be used by OpenSea to determine where the NFTs are stored on IPFS
    string internal baseTokenURI;
      

    //State variables for Sports-betting
    uint public _start;
    uint public _end;
    uint public teamAPool;
    uint public teamBPool;
    uint8 public lotteryId;
    uint8 public totalBidsPerSlot;
    uint8 public maxBidsPerSlot;
     //State Variables for NFT
    uint256 public maxSupply;
    bool public isMintEnabled;
    bool public eligibleForNFT;
    bool public eligibleForBetting;
    
    //To withdraw the money that goes into the smart contract 
    address payable public withdrawWallet;
    address payable[] public players;
    address payable[] public teamABetters;
    address payable[] public teamBBetters;
    address payable[] public winnersEligibleForNFT;
     //Keep track of the number of mints each wallet has done
    mapping(address => uint8) public mintedWallets;
    mapping (uint => string) public lotteryHistory;
    mapping (address => uint) public playerBidOnTeamA;
    mapping (address => uint) public playerBidOnTeamB;

    //State variables for Chainlink VRF
    bytes32 internal keyHash; // identifies which Chainlink oracle to use
    uint internal fee;        // fee to get random number
    uint public randomResult;

    //List of Events
    event RandomNumberIsGenerated(uint randomResult);
    event GameHasStarted(uint startTime);
    event NewPlayerEntered(address newPlayer);
    event BettingSlotIsFull(string message);
    event BettingOnTeamA(address better, uint bettingValue);
    event BettingOnTeamB(address better, uint bettingValue);
    event WinningTeamSelected(uint winningTeamId);
    event WinningPrizePool(uint prizeAmount);
    event PrizeGivenToTeamA(uint playerReward);
    event PrizeGivenToTeamB(uint playerReward);
    event ResetAfterGame(uint8 lotteryId, address payable[] players, address payable[] teamABetters, address payable[] teamBBetters, uint teamAPool, uint teamBPool, uint _start, uint _end);
    event ClaimedNFTSuccessful(address playerAddress, uint tokenId);
    

    //Define our constructor
    //ERC721 constructor argument accepts a string memory argument named 'uri_' - The URI to our NFT metadata
    //URI- We need to provide where our metadata will be hosted 
    constructor() payable ERC721('The Valkyrie Club', 'TVC')
        VRFConsumerBase(
            0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B, // VRF coordinator
            0x01BE23585060835E02B77ef475b0Cc51aA1e0709  // LINK token address
        ) {
            //For Chainlink VRF
            keyHash = 0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311;
            fee = 0.1 * 10 ** 18;    // 0.1 LINK
            lotteryId = 1;

            //For NFT Minting
            maxSupply = 10;
            maxBidsPerSlot = 4;
            // Set which address can withdraw all the funds from smart contract - obviously the owner
            withdrawWallet = payable(msg.sender);
            baseTokenURI = "ipfs://bafybeibeg5ry3rs3xrqfqlew5ddto36qxbgnmje24fy2zfqd7zqxhonw7a/";
        }

         
    function getRandomNumber() public returns (bytes32 requestId) {
       
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK in contract");
        return requestRandomness(keyHash, fee);
    }

    function fulfillRandomness(bytes32 requestId, uint randomness) internal override {
        
        randomResult = randomness;
        emit RandomNumberIsGenerated(randomResult);
        payWinner();
    
    }

    // function getWinnerByLottery(uint8 lottery) external view returns (string memory) {
    //     return lotteryHistory[lottery];
    // }

    function getContractBalance() external view returns (uint) {
        return address(this).balance;
    }

    // function getPlayers() external view returns (address payable[] memory) {
    //     require(block.timestamp > (_start + 2 minutes), "Players are still joining. Wait for a while!");
    //     return players;
       
    // }

    function startTheGame() external onlyOwner {
        _start = block.timestamp;
        _end = _start + 5 minutes;
        toggleIsMintEnabled();
        emit GameHasStarted(_start);
    }

    function resetTheGame() public onlyOwner {
         // reset the state of the contract
        for (uint8 i=0; i<teamABetters.length; i++) {
            playerBidOnTeamA[teamABetters[i]] = 0;
        }
        for (uint8 j=0; j<teamBBetters.length; j++) {
            playerBidOnTeamB[teamBBetters[j]] = 0;
        }
        players = new address payable[](0);
        teamABetters = new address payable[](0);
        teamBBetters = new address payable[](0);
        teamAPool = 0;
        teamBPool = 0;
        _start = 0;
        _end = 0;
        maxBidsPerSlot = 0;
        totalBidsPerSlot = 0;
        toggleIsMintEnabled();
        winnersEligibleForNFT = new address payable[](0);
        
        emit ResetAfterGame(lotteryId, players, teamABetters, teamBBetters, teamAPool, teamBPool, _start, _end);
    
    }

    
    function enterTheGame() external payable {
        require(msg.value == .00001 ether);
        require(block.timestamp > _start, "The game hasn't begun yet");
        require(block.timestamp < (_start + 2 minutes), "Betting time is over");
        require(totalBidsPerSlot <= maxBidsPerSlot, "Maximum Bets Per Slot is Exceeded");
        totalBidsPerSlot++;

        // address of player entering betting
        players.push(payable(msg.sender));
        emit NewPlayerEntered(msg.sender);

        //Notify if the slot is full
        if(totalBidsPerSlot > maxBidsPerSlot ) {
            emit BettingSlotIsFull("The Betting Slot is Full");
        }
    }

    function betOnTeamA() external payable {
        require(msg.value > .00005 ether);
        require(block.timestamp > _start, "The game hasn't begun yet");
        require(block.timestamp < (_start + 2 minutes), "Betting time is over");
        
        for(uint i=0; i< players.length; i++){
            if(msg.sender == players[i]) {
                eligibleForBetting = true;
                continue;                
            }
        }
        require(eligibleForBetting, "You aren't eligible to bet! Pay ENTRY FEE");   
        eligibleForBetting = false;

        teamABetters.push(payable(msg.sender));
        playerBidOnTeamA[msg.sender] = msg.value;
        teamAPool = teamAPool.add(msg.value);
        emit BettingOnTeamA(msg.sender, msg.value);
    }

    function betOnTeamB() external payable {
        require(msg.value > .00005 ether);
        require(block.timestamp > _start, "The game hasn't begun yet");
        require(block.timestamp < (_start + 2 minutes), "Betting time is over");

        for(uint i=0; i< players.length; i++){
            if(msg.sender == players[i]) {
                eligibleForBetting = true;
                continue;                
            }
        }
        require(eligibleForBetting, "You aren't eligible to bet! Pay ENTRY FEE");   
        eligibleForBetting = false; 

        teamBBetters.push(payable(msg.sender));
        playerBidOnTeamB[msg.sender] = msg.value;
        teamBPool = teamBPool.add(msg.value);
        emit BettingOnTeamB(msg.sender, msg.value);
    }

    function pickWinner() external onlyOwner {
        require(block.timestamp > _end, "The game is still in progress");
        getRandomNumber();
    }

    function payWinner() public onlyOwner {
        
        uint _teamAPool = teamAPool;
        uint _teamBPool = teamBPool;
        
        uint winningTeamId = randomResult.mod(2).add(1);
        emit WinningTeamSelected(winningTeamId);

        uint prizePool = _teamAPool.add(_teamBPool);
        

        uint ownerCharges = prizePool.div(20); //5% charges
        emit WinningPrizePool(prizePool-ownerCharges);

        if(winningTeamId == 1) {
            uint playerRewardPool = prizePool.sub(ownerCharges).div(_teamAPool);
            address payable[] memory _teamABetters = teamABetters;
            for (uint8 i=0; i< _teamABetters.length; i++) {
                uint eachPlayerReward = playerBidOnTeamA[_teamABetters[i]].mul(playerRewardPool);
                _teamABetters[i].transfer(eachPlayerReward);
                winnersEligibleForNFT.push(_teamABetters[i]);
            }
            emit PrizeGivenToTeamA(playerRewardPool);
            lotteryHistory[lotteryId] = "Team A";
        }
        else{
            uint playerRewardPool = prizePool.sub(ownerCharges).div(_teamBPool);
            address payable[] memory _teamBBetters = teamBBetters;
            for (uint8 i=0; i< _teamBBetters.length; i++) {
                uint eachPlayerReward = playerBidOnTeamB[_teamBBetters[i]].mul(playerRewardPool);
                _teamBBetters[i].transfer(eachPlayerReward);
                winnersEligibleForNFT.push(_teamBBetters[i]);
            }
            emit PrizeGivenToTeamB(playerRewardPool);
            lotteryHistory[lotteryId] = "Team B";
        }
        
        lotteryId++;
        resetTheGame();
        
       }

    //NFT specific functions
    function setMaxSupply(uint256 _maxSupply) external onlyOwner {
        maxSupply = _maxSupply;
        
    }

    function toggleIsMintEnabled() public onlyOwner {
        isMintEnabled = !isMintEnabled;
    }

    // The URI where the actual images are stored
    function _baseURI() internal view override returns (string memory) {
        return "ipfs://bafybeibeg5ry3rs3xrqfqlew5ddto36qxbgnmje24fy2zfqd7zqxhonw7a/";
    }

    //This is the function that is opened by OpenSea to grab the images
    function tokenURI(uint256 _tokenId) public view override returns (string memory) {
        require(_exists(_tokenId), 'Token does not exist');
        //Take the baseTokenURI for each image + add its token ID + json extension = complete tokenURI
        //This allows OpenSea to grab every single URL of the images
        return string(abi.encodePacked(baseTokenURI, Strings.toString(_tokenId), ".json"));
    }

    function withdraw() external onlyOwner {
        (bool success, ) = withdrawWallet.call{value: address(this).balance}('');
        require(success, "Withdrawal Failed");
    }

    //We are going to create a mint() function that will allow the user to mint their NFT
    function claimNFT() external  {
        require(isMintEnabled, "Minting isn't enabled yet");
        require(mintedWallets[msg.sender] < 1, "Only one NFT per wallet");
        //Tweak it based on the amount the player has betted
        // require(totalSupply < maxSupply, "Sold Out");
        for(uint i=0; i<= winnersEligibleForNFT.length; i++){
            if(msg.sender == winnersEligibleForNFT[i]) {
                eligibleForNFT = true;
                continue;                
            }
        }
        require(eligibleForNFT, "You aren't eligible to claim an NFT");

        mintedWallets[msg.sender]++; //Keeps track of the number of mints per wallet
        totalSupply.increment(); 
        uint256 newTokenId = totalSupply.current();
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, baseTokenURI);
        eligibleForNFT = false;
        emit ClaimedNFTSuccessful(msg.sender, newTokenId);
    }

    // function checkBalanceOf(address account) external view returns (uint256) {
    //     return balanceOf(account);
    // }

    //  //Only the contract owner should have the privilege to burn the token
    // function burn(uint256 id) external onlyOwner{
    //     _burn(id);
    // }

    // //Check the account balance
    

    //Transfer NFTs between accounts - Only the admin can transfer NFTs
    // function transferNFT(
    //     address from,
    //     address to,
    //     uint256 id
    // ) external onlyOwner{
    //     _transfer(from, to, id);
    // }

        // opensea supported metadata
//   function uri(uint256 tokenId) override public view returns (string memory) {
//        return(
//            string(abi.encodePacked(
//                "https://bafybeigsfkis362b7jnnnwx4pkngayza3b3xgjiv62kcood4yhsgco3dva.ipfs.nftstorage.link/",
//                Strings.toString(tokenId),
//                "json"
//            )
//        ),
//    }

    // data on IPFS: 
    //CID 
    // bafybeidij3koy27n4ynnenknszmevkzhia6brkiijyihsa6gc62t7lks6y
    // bafybeib5ycsd4mp4s3qdfvm7fjqtdnnc3ubmikl6ssll7qhguq52ahkiz4
    // bafybeiaxyrhavpqcmke3ccsutauxlngip47hscdkqm2s6ej6j3jm4k2dxq
    // bafybeibkglaakijksrmf5v4ytzhdjtx2t5bqirc5gmxdnbtun36yewbaki
    // bafybeibmit2b4aq226gnw3t4fjdw45sp5ipuoevnnrylvf472ipcgjgnae
    // bafybeicorgs4kfz5bhtapzjekagg5lmsrsp6dnkyeeyanu5vpyiycj4m7i
    // bafybeib6kwoqpoirr5xis44q2uwdiogkl7inrxan2galw5pj7ccyoxsrku
    // bafybeiciblxeyhu7larxn7qbqa4dmagvhaqalirj35hhmspzuiswb2nkjy
    // bafybeifzleylyuphvwxppdf7smixhi2642fofjsuvhwsrjdshmnsqghkhm
    // bafybeieo2k3uctdjfbejslzsrxhfh5mrvv5oo2mnhvapaxg6vlffc7nyum
    
     

}