const axios = require("axios");
const fs = require("fs");

const token1 = ""; // adresse du contrat du premier token
const token2 = ""; // adresse du contrat du deuxième token

const startBlock1 = ""; // Block de l'heure où on veut commencer l'analyse pour le 1er token (Trouvable sur l'explorer)
const endBlock1 = ""; // Block de l'heure où on veut terminer l'analyse pour le 1er token (Trouvable sur l'explorer)
const startBlock2 = ""; // Block de l'heure où on veut commencer l'analyse pour le 2eme token (Trouvable sur l'explorer)
const endBlock2 = ""; // Block de l'heure où on veut terminer l'analyse pour le 2eme token (Trouvable sur l'explorer)

const apiUrl = ""; // Explorer blockchain EVM
const apiKey = ""; // API KEY EXPLORER

const walletFile = "wallets.txt"; // Fichier où seront stockés les wallets

async function getTokenTransfers(contractAddress, startBlock, endBlock) {
  const url = `${apiUrl}?module=account&action=tokentx&contractaddress=${contractAddress}&startblock=${startBlock}&endblock=${endBlock}&sort=asc&apikey=${apiKey}`;
  const response = await axios.get(url);
  return response.data.result;
}

async function getWallets() {
  const transfers1 = await getTokenTransfers(token1, startBlock1, endBlock1);
  const transfers2 = await getTokenTransfers(token2, startBlock2, endBlock2);
  const wallets1 = transfers1.map((t) => t.from);
  const wallets2 = transfers2.map((t) => t.from);
  const wallets = wallets1.filter((w) => wallets2.includes(w));
  if (wallets.length > 0) {
    const walletString = wallets.join("\n");
    fs.writeFileSync(walletFile, walletString);
    console.log(
      `${wallets.length} Wallet(s) trouvés et sauvegardés dans ${walletFile}.`
    );
  } else {
    console.log("Pas de wallets trouvés.");
  }
}

getWallets();
