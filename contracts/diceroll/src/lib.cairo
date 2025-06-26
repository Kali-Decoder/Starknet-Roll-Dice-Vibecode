// SPDX-License-Identifier: MIT
// DiceRoll Cairo Contract

#[derive(Copy, Drop, Serde, starknet::Store, PartialEq)]
#[allow(starknet::store_no_default_variant)]
enum GameOutcome {
    InProgress,
    PlayerWon,
    PlayerLost,
}

#[starknet::interface]
pub trait IDiceRoll<TContractState> {
    fn play(ref self: TContractState, guess: u8, bet: u256);
    fn get_game(self: @TContractState, id: u32) -> GameState;
}

#[derive(Copy, Drop, Serde, starknet::Store)]
struct GameState {
    player: starknet::ContractAddress,
    guess: u8,
    rolled: u8,
    bet: u256,
    outcome: GameOutcome,
}

#[starknet::contract]
mod DiceRoll {
    use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
    use starknet::storage::{Map, StoragePathEntry, StoragePointerReadAccess, StoragePointerWriteAccess};
    use starknet::{ContractAddress, get_block_timestamp, get_caller_address, get_contract_address};
    use super::{GameState, GameOutcome};
 

    #[storage]
    struct Storage {
        balance: u256,
        games_len: u32,
        player: Map<u32, ContractAddress>,
        guess: Map<u32, u8>,
        rolled: Map<u32, u8>,
        bet: Map<u32, u256>,
        outcome: Map<u32, GameOutcome>,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        GamePlayed: GamePlayed,
    }

    #[derive(Drop, starknet::Event)]
    struct GamePlayed {
        game_id: u32,
        player: ContractAddress,
        guess: u8,
        rolled: u8,
        bet: u256,
        outcome: GameOutcome,
    }

    #[abi(embed_v0)]
    impl DiceRollImpl of super::IDiceRoll<ContractState> {
        fn play(ref self: ContractState, guess: u8, bet: u256) {
            assert(guess >= 1 && guess <= 6, 'Guess must be 1-6');
            assert(bet != 0, 'Bet cannot be 0');
            let caller = get_caller_address();
            let game_id = self.games_len.read();
            self.games_len.write(game_id + 1);

            // Transfer STRK tokens from player to contract
            self._take_bet(bet, game_id);

            // Generate pseudo-random number (1-6)
            let timestamp = get_block_timestamp();
            let rolled = ((timestamp % 6) + 1).try_into().unwrap();

            // Determine outcome
            let outcome = if guess == rolled {
                GameOutcome::PlayerWon
            } else {
                GameOutcome::PlayerLost
            };

            // Store game state
            self.player.entry(game_id).write(caller);
            self.guess.entry(game_id).write(guess);
            self.rolled.entry(game_id).write(rolled);
            self.bet.entry(game_id).write(bet);
            self.outcome.entry(game_id).write(outcome);

            // Payout if player won
            if outcome == GameOutcome::PlayerWon {
                self._payout(caller, bet);
            }

            // Emit event
            self.emit(GamePlayed {
                game_id,
                player: caller,
                guess,
                rolled,
                bet,
                outcome,
            });
        }

        fn get_game(self: @ContractState, id: u32) -> GameState {
            let player = self.player.entry(id).read();
            let guess = self.guess.entry(id).read();
            let rolled = self.rolled.entry(id).read();
            let bet = self.bet.entry(id).read();
            let outcome = self.outcome.entry(id).read();
            GameState { player, guess, rolled, bet, outcome }
        }
    }

    #[generate_trait]
    impl InternalFunctions of InternalFunctionsTrait {
        fn _take_bet(ref self: ContractState, amount: u256, id: u32) {
            let strk_addr: ContractAddress =
                0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d.try_into().unwrap();
            let strk_dispatcher = IERC20Dispatcher { contract_address: strk_addr };
            let caller = get_caller_address();
            let contract_address = get_contract_address();
            let allowance = strk_dispatcher.allowance(caller, contract_address);
            assert(allowance >= amount, 'Not enough allowance');
            strk_dispatcher.transfer_from(caller, contract_address, amount);
            self.balance.write(self.balance.read() + amount);
        }

        fn _payout(ref self: ContractState, to: ContractAddress, bet: u256) {
            // 5x payout
            let payout = bet * 2;
            let strk_addr: ContractAddress =
                0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d.try_into().unwrap();
            let strk_dispatcher = IERC20Dispatcher { contract_address: strk_addr };
            strk_dispatcher.transfer(to, payout);
            self.balance.write(self.balance.read() - payout);
        }
    }
}
