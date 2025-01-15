import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

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
  const totalPurchased = 100 - remainingSpace;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-purple-900 mb-2">Game Progress</h2>
        <div className="space-y-2">
          <Progress value={totalPurchased} className="h-2" />
          <div className="flex justify-between text-sm text-gray-600">
            <span>{totalPurchased}% Purchased</span>
            <span>{remainingSpace}% Available</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-purple-900 mb-4">Current Purchases</h3>
        <div className="bg-purple-50 rounded-xl p-4">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-purple-900">Wallet</TableHead>
                <TableHead className="text-purple-900 text-right">Space</TableHead>
                <TableHead className="text-purple-900 text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchases.map((purchase, index) => (
                <TableRow key={index} className="hover:bg-purple-100/50">
                  <TableCell className="font-mono text-purple-700">
                    {purchase.wallet}
                  </TableCell>
                  <TableCell className="text-right text-purple-700">
                    {purchase.percentage}%
                  </TableCell>
                  <TableCell className="text-right text-purple-700">
                    {purchase.amount} SOL
                  </TableCell>
                </TableRow>
              ))}
              {purchases.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-gray-500 py-8">
                    No purchases yet. Be the first to join!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};