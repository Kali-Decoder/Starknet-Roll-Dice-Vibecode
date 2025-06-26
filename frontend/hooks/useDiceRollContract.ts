"use client";
import { useCallback, useState } from "react";
import { CallData, cairo, BigNumberish } from "starknet";
import { provider } from "../constants";
import { toast } from "react-hot-toast";

const DICEROLL_CONTRACT_ADDRESS = "0x714e664e072eac2c5d65694d532a272333423eb3040342fd37532ee75ed6cdc";
const STRK_TOKEN_ADDRESS = "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";

export interface DiceRollResult {
  gameId: number;
  player: string;
  guess: number;
  rolled: number;
  bet: BigNumberish;
  outcome: number; // 1 = win, 2 = lose
}

export const useDiceRollContract = (connected: boolean, account: any) => {
  const [lastResult, setLastResult] = useState<DiceRollResult | null>(null);

  const playDiceRoll = useCallback(
    async (guess: number, bet: BigNumberish) => {
      console.log(connected, account);
      console.log(guess, bet);
      if (!connected || !account) {
        toast.error("Please connect your wallet first");
        return null;
      }
      if (!guess || guess < 1 || guess > 6) {
        toast.error("Guess must be between 1 and 6");
        return null;
      }
      if (!bet) {
        toast.error("Bet amount must be greater than zero");
        return null;
      }
      const id = toast.loading("Rolling the dice...");
      try {
        const betInWei = BigInt(bet);
        // Multicall: approve + play
        const multiCall = await account.execute([
          {
            contractAddress: STRK_TOKEN_ADDRESS,
            entrypoint: "approve",
            calldata: CallData.compile({
              spender: DICEROLL_CONTRACT_ADDRESS,
              amount: cairo.uint256(betInWei),
            }),
          },
          {
            contractAddress: DICEROLL_CONTRACT_ADDRESS,
            entrypoint: "play",
            calldata: CallData.compile({
              guess,
              bet: cairo.uint256(betInWei),
            }),
          },
        ]);
        const txHash = multiCall?.transaction_hash;
        if (!txHash) throw new Error("Transaction hash missing");
        const receipt = await provider.waitForTransaction(txHash);
        // Find the GamePlayed event
        const event = receipt?.events?.find(
          (e: any) => e.from_address === DICEROLL_CONTRACT_ADDRESS
        );
        if (event && event.data && event.data.length >= 6) {
          console.log(event);
          const [gameId, player, guess, rolled, bet, extra,outcome] = event.data;
          console.log(gameId, player, guess, rolled, bet, extra,outcome);
          const result: DiceRollResult = {
            gameId: parseInt(gameId, 16),
            player,
            guess: parseInt(guess, 16),
            rolled: parseInt(rolled, 16),
            bet,
            outcome: parseInt(outcome, 16),
          };
          console.log(result);
          setLastResult(result);
          toast.success(
            result.outcome === 1 ? "You won!" : "You lost!",
            { id }
          );
          return result;
        }
        toast.success("Dice rolled!", { id });
        return null;
      } catch (err) {
        console.error("Failed to roll dice:", err);
        toast.error("Error rolling dice", { id });
        return null;
      }
    },
    [connected, account]
  );

  return { playDiceRoll, lastResult };
}; 