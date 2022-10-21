interface IRankingResponse {
  [keyof: string]: {
    [keyof: string]: number;
  };
}

export { IRankingResponse };
