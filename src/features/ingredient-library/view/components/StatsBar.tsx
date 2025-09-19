import React from "react";
import type { StatsData } from "../../model/types";
import { statsStyles } from "../../styles";

interface StatsBarProps {
  stats: StatsData;
  isLoading?: boolean;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  stats,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className={statsStyles.container}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={statsStyles.stat}>
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-12 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-16 mx-auto"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={statsStyles.container}>
      <div className={statsStyles.stat}>
        <span className={statsStyles.statValue}>{stats.total}</span>
        <span className={statsStyles.statLabel}>Total</span>
      </div>

      <div className={statsStyles.stat}>
        <span className={statsStyles.statValue}>{stats.active}</span>
        <span className={statsStyles.statLabel}>Active</span>
      </div>

      <div className={statsStyles.stat}>
        <span
          className={`${statsStyles.statValue} ${
            stats.lowStock > 0 ? "text-orange-600" : ""
          }`}
        >
          {stats.lowStock}
        </span>
        <span className={statsStyles.statLabel}>Low Stock</span>
      </div>

      <div className={statsStyles.stat}>
        <span
          className={`${statsStyles.statValue} ${
            stats.favorites > 0 ? "text-yellow-600" : ""
          }`}
        >
          {stats.favorites}
        </span>
        <span className={statsStyles.statLabel}>Favorites</span>
      </div>
    </div>
  );
};
