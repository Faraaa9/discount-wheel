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
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-purple-900 mb-4">Game Progress</h2>
        <div className="space-y-4">
          <Progress value={totalPurchased} className="h-3 bg-purple-100" />
          <div className="flex justify-between text-sm">
            <span className="font-medium text-purple-700">{totalPurchased}% Purchased</span>
            <span className="font-medium text-purple-500">{remainingSpace}% Available</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-purple-900 mb-4">Current Purchases</h3>
        <div className="bg-purple-50/50 rounded-2xl p-6">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-purple-200">
                <TableHead className="text-purple-900 font-semibold">Wallet</TableHead>
                <TableHead className="text-purple-900 font-semibold text-right">Space</TableHead>
                <TableHead className="text-purple-900 font-semibold text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchases.map((purchase, index) => (
                <TableRow key={index} className="hover:bg-purple-100/30 border-purple-200">
                  <TableCell className="font-mono text-purple-800">
                    {purchase.wallet}
                  </TableCell>
                  <TableCell className="text-right text-purple-800">
                    {purchase.percentage}%
                  </TableCell>
                  <TableCell className="text-right text-purple-800">
                    {purchase.amount} SOL
                  </TableCell>
                </TableRow>
              ))}
              {purchases.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-purple-600 py-12">
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