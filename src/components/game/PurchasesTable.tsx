import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface SpacePurchase {
  wallet: string;
  percentage: number;
  amount: number;
}

interface PurchasesTableProps {
  purchases: SpacePurchase[];
  remainingSpace: number;
}

export const PurchasesTable = ({ purchases, remainingSpace }: PurchasesTableProps) => {
  return (
    <div className="w-full max-w-4xl mt-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Current Game Purchases</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Wallet</TableHead>
              <TableHead>Space Percentage</TableHead>
              <TableHead>Amount (SOL)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchases.map((purchase, index) => (
              <TableRow key={index}>
                <TableCell className="font-mono">{purchase.wallet}</TableCell>
                <TableCell>{purchase.percentage}%</TableCell>
                <TableCell>{purchase.amount} SOL</TableCell>
              </TableRow>
            ))}
            {purchases.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-gray-500">
                  No purchases yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="mt-4 text-right text-sm text-gray-600">
          Remaining Space: {remainingSpace}%
        </div>
      </div>
    </div>
  );
};