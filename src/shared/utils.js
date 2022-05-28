function shortenWallet(wallet) {
  if (wallet) return wallet.substr(0, 6) + "...." + wallet.substr(-4, 4);
  else return wallet;
}

export default shortenWallet;
