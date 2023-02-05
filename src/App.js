import { useEffect, useState } from "react";
// import Navbar from "./Frontend/Navbar";
import { ethers } from "ethers";
import {contractAdress} from "./utils/constants"
import {contractABI} from './utils/constants'
import Home from "./Frontend/Home" 
import Shukla from './Frontend/Shukla'
import MyListedItems from './Frontend/MyListedItems'
import MyPurchases from './Frontend/MyPurchases'

import {BrowserRouter,Routes,Route} from'react-router-dom'


  

const App=()=>{

  const [loading, setLoading] = useState(true)
  const [account, setAccount] = useState(null)
  const [nft, setNFT] = useState({})
  const [marketplace, setMarketplace]=useState({})

  const web3Handler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0])

    const provider = new ethers.providers.Web3Provider(window.ethereum)

    const signer = provider.getSigner()

    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    })

    window.ethereum.on('accountsChanged', async function (accounts) {
      setAccount(accounts[0])
      await web3Handler()
    })
    loadContracts(signer)
  }
  const loadContracts = async (signer) => {
    // Get deployed copies of contracts
    const marketplace = new ethers.Contract(contractAdress, contractABI, signer)
    setMarketplace(marketplace)
    const nft = new ethers.Contract(contractAdress, contractABI, signer)
    setNFT(nft)
    setLoading(false)
  }

  useEffect(()=>{
    web3Handler()
  },[])

  return(
    <>
        <BrowserRouter>
      <div className="App">
        <>
          <Navigation web3Handler={web3Handler} account={account} />
        </>
        <div>
         
            <Routes>
              <Route path="/" element={
                <Home marketplace={marketplace} nft={nft} />
              } />
              <Route path="/create" element={
                <Shukla marketplace={marketplace} nft={nft} />
              } />
              <Route path="/my-listed-items" element={
                <MyListedItems marketplace={marketplace} nft={nft} account={account} />
              } />
              <Route path="/my-purchases" element={
                <MyPurchases marketplace={marketplace} nft={nft} account={account} />
              } />
            </Routes>
          
        </div>
      </div>
    </BrowserRouter>
    </>    
  )
  

}

export default App;