import { Client, Provider, ProviderRegistry } from '@blockstack/clarity';
import { getBestScore, getScoreOf, getBestPlayer, execMethod } from './helpers';

import { expect } from 'chai';
import { AssertionError } from 'assert';

describe.only('high score contract', () => {
  const deployer = 'SP1DQW1980HVS71XPSW91A8K2W2R3ZAJ75M5M0K5W';
  const playerA = 'SP1BPQQ4TTQQYVZ0T52NADN5QX2K3HX6JQ490E3C7';
  const playerB = 'SP3ABBPX4YJCPHRP0WDVJS9CV8VPMMRWWNGW35A3M';

  let provider: Provider;
  let client: Client;

  before(async () => {
    provider = await ProviderRegistry.createProvider();
    client = new Client(`${deployer}.highscore`, 'highscore', provider);
  });

  it('make sure contract has valid syntax', async () => {
    await client.checkContract();
    await client.deployContract();
  });

  describe('high score contract functionality', () => {
    describe('initialize state', () => {
      it('best score must be zero', async () => {
        let bestScore = await getBestScore(client);
        expect(bestScore).to.equal(0);
      });

      it('best player must be default account', async () => {
        let bestPlayer = await getBestPlayer(client);
        expect(bestPlayer).to.equal(
          'SP30MF7YC9QANV45Q7JWTRZY6KPCZGN2JF3X9FVM3'
        );
      });
    });

    describe('player A submit score', () => {
      before(async () => {
        await execMethod(client, playerA, 'submit-score', ['100']);
      });

      it('player A score must be 100', async () => {
        let playerAScore = await getScoreOf(client, playerA);
        expect(playerAScore).to.equal(100);
      });

      it('player A now become the best player', async () => {
        let bestPlayer = await getBestPlayer(client);
        expect(bestPlayer).to.equal(playerA);
      });
    });

    describe('player B submit score', () => {
      before(async () => {
        await execMethod(client, playerB, 'submit-score', ['200']);
      });

      it('player B score must be 100', async () => {
        let playerBScore = await getScoreOf(client, playerB);
        expect(playerBScore).to.equal(200);
      });

      it('player B now become the best player', async () => {
        let bestPlayer = await getBestPlayer(client);
        expect(bestPlayer).to.equal(playerB);
      });
    });
  });

  after(async () => {
    await provider.close();
  });
});
