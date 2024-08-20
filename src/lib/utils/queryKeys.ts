import { Network } from "../types/overtime";

const QUERY_KEYS = {
    Rates: {
        ExchangeRates: (networkId: Network) => ['rates', 'exchangeRates', networkId],
    },
}

export default QUERY_KEYS