import React from 'react';
import { useInventory } from '../../context/InventoryContext';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  RotateCcw, 
  Bookmark, 
  Bike, 
  HardHat, 
  Wrench, 
  Clock, 
  UserCheck 
} from 'lucide-react';

export const RecentActivityTable: React.FC = () => {
  const { activityLogs } = useInventory();

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex flex-col h-full">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Recent Activity Ledger</h3>
          <p className="text-xs text-gray-500 mt-0.5">Real-time log of showroom sales, receipts, and status adjustments</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200">
          <Clock className="w-3.5 h-3.5 text-orange-600" />
          <span>Live Feed</span>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto mt-3">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-gray-400 border-b border-gray-100 font-mono text-[10px] uppercase tracking-wider">
              <th className="pb-2.5 font-bold">Activity</th>
              <th className="pb-2.5 font-bold hidden md:table-cell">Reference</th>
              <th className="pb-2.5 font-bold">Details</th>
              <th className="pb-2.5 font-bold text-right">Value / Units</th>
              <th className="pb-2.5 font-bold text-right hidden sm:table-cell">User</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {activityLogs.map((log) => {
              let actionBadge = (
                <span className="p-1.5 rounded-md bg-orange-50 text-orange-600 border border-orange-200">
                  <Plus className="w-3.5 h-3.5" />
                </span>
              );

              if (log.action === 'sale') {
                actionBadge = (
                  <span className="p-1.5 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-200">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                );
              } else if (log.action === 'receive') {
                actionBadge = (
                  <span className="p-1.5 rounded-md bg-blue-50 text-blue-600 border border-blue-200">
                    <ArrowDownLeft className="w-3.5 h-3.5" />
                  </span>
                );
              } else if (log.action === 'reserve') {
                actionBadge = (
                  <span className="p-1.5 rounded-md bg-amber-50 text-amber-600 border border-amber-200">
                    <Bookmark className="w-3.5 h-3.5" />
                  </span>
                );
              } else if (log.action === 'adjustment') {
                actionBadge = (
                  <span className="p-1.5 rounded-md bg-purple-50 text-purple-600 border border-purple-200">
                    <RotateCcw className="w-3.5 h-3.5" />
                  </span>
                );
              }

              let typeIcon = <Bike className="w-3.5 h-3.5 text-gray-400" />;
              if (log.itemType === 'helmet') typeIcon = <HardHat className="w-3.5 h-3.5 text-gray-400" />;
              if (log.itemType === 'part') typeIcon = <Wrench className="w-3.5 h-3.5 text-gray-400" />;

              return (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 pr-3">
                    <div className="flex items-center gap-2.5">
                      {actionBadge}
                      <div>
                        <div className="font-bold text-gray-900 text-xs">
                          {log.title}
                        </div>
                        <div className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5 font-mono">
                          {typeIcon}
                          <span>{log.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3 font-mono text-gray-600 text-[11px] hidden md:table-cell">
                    <span className="px-1.5 py-0.5 rounded bg-gray-100 border border-gray-200">
                      {log.referenceId}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-gray-600 max-w-xs truncate text-[11px]">
                    {log.description}
                  </td>

                  <td className="py-3 px-3 text-right">
                    {log.amount !== undefined ? (
                      <span className="font-mono font-bold text-gray-900">
                        ${log.amount.toLocaleString()}
                      </span>
                    ) : log.quantityChange !== undefined ? (
                      <span className="font-mono font-bold text-orange-600">
                        {log.quantityChange > 0 ? `+${log.quantityChange}` : log.quantityChange} units
                      </span>
                    ) : (
                      <span className="text-gray-400 font-mono">—</span>
                    )}
                  </td>

                  <td className="py-3 pl-3 text-right hidden sm:table-cell">
                    <div className="inline-flex items-center gap-1 text-gray-600 text-[11px]">
                      <UserCheck className="w-3 h-3 text-gray-400" />
                      <span>{log.user}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
