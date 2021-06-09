const networks = {
  1: "Ethereum Mainnet",
  3: "Ethereum Ropsten",
  4: "Ethereum Rinkeby",
  5: "Ethereum Goerli",
  42: "Ethereum Kovan",
  56: "Binance Smart Chain",
  137: "Matic Mainnet",
  "0x63564c40": "Harmony Mainnet",
};

function setElementContent(id, html) {
  document.getElementById(id).innerHTML = html;
}

function content() {
  return  `
          <h1>
            <span id="networkName">Unknown Network</span>
          </h1>
        `;
}

function getNetworkName() {
  const chainId = window.ethereum.networkVersion;
  return networks[chainId] || chainId;
}

function displayContent() {
  try {
    setElementContent("content", content());
    setElementContent("networkName", getNetworkName());
  } catch (error) {
    console.log("Unexpected error: ", error);
  }
}

window.addEventListener('load', async () => {
  // Doesn't work via `file://...` URLs - must use a web server
  if (window.ethereum) { // modern dapp browsers
    window.ethereum.autoRefreshOnNetworkChange = false; // Silence a warning from Metamask

    await window.ethereum.enable().catch(err => {
      console.log("User rejected connection request");
      setElementContent("content", `<h2>Please connect wallet to use this app.</h2>`);
    }); // Prompts user to connect (only once) and gives us read access to connected wallet accounts

    // Force page refreshes on network changes
    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    });

    displayContent();
  } else { // No `window.ethereum` => no wallet detected
    setElementContent("content", `<h2>This application requires a web3 wallet such as <a href="https://metamask.io">Metamask</a></h2>`);
  }
});
