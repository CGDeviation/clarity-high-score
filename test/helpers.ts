import { Client, Result, Receipt } from '@blockstack/clarity';

async function getScoreOf(client: Client, signature: string): Promise<number> {
  const query = client.createQuery({
    method: {
      name: 'get-score-of',
      args: [`'${signature}`],
    },
  });
  const receipt = await client.submitQuery(query);
  const score = Result.unwrapInt(receipt);
  return score;
}

async function getBestScore(client: Client): Promise<number> {
  const query = client.createQuery({
    method: {
      name: 'get-best-score',
      args: [],
    },
  });
  const receipt = await client.submitQuery(query);
  const bestScore = Result.unwrapInt(receipt);
  return bestScore;
}

async function getBestPlayer(client: Client): Promise<string> {
  const query = client.createQuery({
    method: {
      name: 'get-best-player',
      args: [],
    },
  });
  const receipt = await client.submitQuery(query);
  const result = Result.unwrap(receipt);
  const player = result.match(/^\(ok\s(\w+)\)$/)[1];
  return player;
}

async function execMethod(
  client: Client,
  signature: string,
  method: string,
  args: string[]
): Promise<Receipt> {
  const tx = client.createTransaction({
    method: {
      name: method,
      args: args,
    },
  });
  await tx.sign(signature);
  const receipt = await client.submitTransaction(tx);
  return receipt;
}

export { getBestScore, getScoreOf, execMethod, getBestPlayer };
