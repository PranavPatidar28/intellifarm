import type { NextApiRequest, NextApiResponse } from "next";

interface MandiRecord {
  Market: string;
  Commodity: string;
  Variety: string;
  ArrivalsDate: string;
  MinPrice: string;
  MaxPrice: string;
  ModalPrice: string;
}

type Data = { records: MandiRecord[] } | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { commodity, state, district, market, fromDate, toDate } = req.query;

  if (!commodity || !state || !district || !market || !fromDate || !toDate) {
    res.status(400).json({ error: "Missing required query parameters" });
    return;
  }

  try {
    const response = await fetch(
      "https://agmarknet.gov.in/PriceAndArrivals/DatewiseCommodityReport.aspx/GetPriceData",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          commodity,
          state,
          district,
          market,
          fromDate,
          toDate,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();
    res.status(200).json({ records: data.d });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
