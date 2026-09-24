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
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col h-full">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white tracking-wide">Recent Inventory Activity</h3>
          <p className="text-xs text-slate-400 mt-0.5">Real-time log of bay receipts, sales, and transfers</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
          <Clock className="w-3.5 h-3.5 text-orange-400" />
          <span>Live Feed</span>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto mt-3">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-slate-400 border-b border-slate-800 font-mono text-[11px] uppercase tracking-wider">
              <th className="pb-3 font-medium">Activity</th>
              <th className="pb-3 font-medium hidden md:table-cell">Reference</th>
              <th className="pb-3 font-medium">Details</th>
              <th className="pb-3 font-medium text-right">Value / Units</th>
              <th className="pb-3 font-medium text-right hidden sm:table-cell">Operator</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {activityLogs.map((log) => {
              let actionBadge = (
                <span className="p-2 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  <Plus className="w-3.5 h-3.5" />
                </span>
              );

              if (log.action === 'sale') {
                actionBadge = (
                  <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                );
              } else if (log.action === 'receive') {
                actionBadge = (
                  <span className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    <ArrowDownLeft className="w-3.5 h-3.5" />
                  </span>
                );
              } else if (log.action === 'reserve') {
                actionBadge = (
                  <span className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Bookmark className="w-3.5 h-3.5" />
                  </span>
                );
              } else if (log.action === 'adjustment') {
                actionBadge = (
                  <span className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <RotateCcw className="w-3.5 h-3.5" />
                  </span>
                );
              }

              let typeIcon = <Bike className="w-3.5 h-3.5 text-slate-400" />;
              if (log.itemType === 'helmet') typeIcon = <HardHat className="w-3.5 h-3.5 text-slate-400" />;
              if (log.itemType === 'part') typeIcon = <Wrench className="w-3.5 h-3.5 text-slate-400" />;

              return (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 pr-3">
                    <div className="flex items-center gap-3">
                      {actionBadge}
                      <div>
                        <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                          {log.title}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          {typeIcon}
                          <span>{log.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3 font-mono text-slate-300 text-[11px] hidden md:table-cell">
                    <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                      {log.referenceId}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-slate-300 max-w-xs truncate">
                    {log.description}
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    {log.amount !== undefined ? (
                      <span className="font-mono font-semibold text-emerald-400">
                        ${log.amount.toLocaleString()}
                      </span>
                    ) : log.quantityChange !== undefined ? (
                      <span className="font-mono font-semibold text-sky-400">
                        {log.quantityChange > 0 ? `+${log.quantityChange}` : log.quantityChange} units
                      </span>
                    ) : (
                      <span className="text-slate-500 font-mono">—</span>
                    )}
                  </td>

                  <td className="py-3.5 pl-3 text-right hidden sm:table-cell">
                    <div className="inline-flex items-center gap-1.5 text-slate-300">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400" />
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
