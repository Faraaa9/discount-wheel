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
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900">Current Game Purchases</h2>
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">Wallet</TableHead>
            <TableHead className="font-semibold">Space Percentage</TableHead>
            <TableHead className="font-semibold">Amount (SOL)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchases.map((purchase, index) => (
            <TableRow key={index} className="hover:bg-gray-50 transition-colors">
              <TableCell className="font-mono text-purple-600">{purchase.wallet}</TableCell>
              <TableCell>{purchase.percentage}%</TableCell>
              <TableCell>{purchase.amount} SOL</TableCell>
            </TableRow>
          ))}
          {purchases.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-gray-500 py-8">
                No purchases yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="mt-4 text-right text-sm font-medium text-gray-600">
        Remaining Space: <span className="text-purple-600">{remainingSpace}%</span>
      </div>
    </div>
  );
};