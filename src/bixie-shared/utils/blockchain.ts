export const toWei = (value: number, decimals: number = 18): bigint => {
  return BigInt(Math.floor(value * (10 ** decimals)));
}

export const fromWei = (value: bigint, decimals: number = 18): number => {
  return Number(value) / (10 ** decimals);
}