const Contrato = artifacts.require("Contrato");
const Escrow = artifacts.require("Escrow");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(Escrow);
  await Escrow.deployed();
};
