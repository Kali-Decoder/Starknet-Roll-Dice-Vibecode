"use client";
import React, { useEffect, useState } from "react";
import {
  argent,
  braavos,
  Connector,
  useInjectedConnectors,
  StarknetConfig,
  voyager,
  jsonRpcProvider,
} from "@starknet-react/core";
import { sepolia, mainnet } from "@starknet-react/chains";
import { constants } from "starknet";
import { ArgentMobileConnector } from "starknetkit/argentMobile";
import { WebWalletConnector } from "starknetkit/webwallet";

const STRK_TOKEN_ADDRESS = "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";
const DICE_CONTRACT_ADDRESS = "0x714e664e072eac2c5d65694d532a272333423eb3040342fd37532ee75ed6cdc";

const policies = {
  contracts: {
    [STRK_TOKEN_ADDRESS]: {
      name: "STRK Token",
      description: "Allows interaction with the STRK token contract",
      methods: [{ name: "Approve", entrypoint: "approve", session: true }],
    },
    [DICE_CONTRACT_ADDRESS]: {
      name: "Dice roll game",
      description: "Allows interaction with the Dice roll game contract",
      methods: [
        { name: "Play", entrypoint: "play", session: true },
      ],
    },
  },
};

const SEPOLIA_RPC_URL = "https://api.cartridge.gg/x/starknet/sepolia";
const MAINNET_RPC_URL = "https://api.cartridge.gg/x/starknet/mainnet";
const CURRENT_CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID || "SN_SEPOLIA";

const customProvider = jsonRpcProvider({
  rpc: (chain) => {
    switch (chain) {
      case mainnet:
        return { nodeUrl: MAINNET_RPC_URL };
      case sepolia:
      default:
        return { nodeUrl: SEPOLIA_RPC_URL };
    }
  },
});

const StarknetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const chains = [mainnet, sepolia];
  const { connectors: injected } = useInjectedConnectors({
    recommended: [argent(), braavos()],
    includeRecommended: "always",
  });
  const [controllerConnector, setControllerConnector] = useState<Connector | null>(null);

  useEffect(() => {
    const init = async () => {
      const { default: ControllerConnector } = await import(
        "@cartridge/connector/controller"
      );
      const controller = new ControllerConnector({
        chains: [{ rpcUrl: SEPOLIA_RPC_URL }, { rpcUrl: MAINNET_RPC_URL }],
        defaultChainId:
          CURRENT_CHAIN_ID === "SN_SEPOLIA"
            ? constants.StarknetChainId.SN_SEPOLIA
            : constants.StarknetChainId.SN_MAIN,
        policies,
      });
      setControllerConnector(controller);
    };
    init();
  }, []);

  const allConnectors: Connector[] = [
    ...injected,
    new WebWalletConnector({ url: "https://web.argent.xyz" }) as unknown as Connector,
    ArgentMobileConnector.init({
      options: {
        dappName: "Dice roll Starknet",
        url: "https://starknet-diceroll.vercel.app/",
      },
    }) as unknown as Connector,
    ...(controllerConnector ? [controllerConnector] : []),
  ];

  return (
    <StarknetConfig
      autoConnect={true}
      chains={chains}
      provider={customProvider}
      connectors={allConnectors}
      explorer={voyager}
    >
      {children}
    </StarknetConfig>
  );
};

export default StarknetProvider; 