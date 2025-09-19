import React from "react";
import type {
  IngredientStatus,
  IngredientType,
  StockLevel,
} from "../../model/types";
import { badgeStyles } from "../../styles";

interface BadgeProps {
  variant: "status" | "type" | "stockLevel";
  value: IngredientStatus | IngredientType | StockLevel;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant,
  value,
  className = "",
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case "status":
        return badgeStyles.status[value as IngredientStatus];
      case "type":
        return badgeStyles.type[value as IngredientType];
      case "stockLevel":
        return badgeStyles.stockLevel[value as StockLevel];
      default:
        return "";
    }
  };

  return (
    <span className={`${badgeStyles.base} ${getVariantStyle()} ${className}`}>
      {value}
    </span>
  );
};

interface StatusBadgeProps {
  status: IngredientStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className,
}) => <Badge variant="status" value={status} className={className} />;

interface TypeBadgeProps {
  type: IngredientType;
  className?: string;
}

export const TypeBadge: React.FC<TypeBadgeProps> = ({ type, className }) => (
  <Badge variant="type" value={type} className={className} />
);

interface StockBadgeProps {
  stock: number;
  className?: string;
}

export const StockBadge: React.FC<StockBadgeProps> = ({ stock, className }) => {
  const getStockLevel = (stockAmount: number): StockLevel => {
    if (stockAmount === 0) return "OutOfStock";
    if (stockAmount < 50) return "Low";
    if (stockAmount < 150) return "Medium";
    return "High";
  };

  const stockLevel = getStockLevel(stock);

  return (
    <div className="flex items-center gap-2">
      <Badge variant="stockLevel" value={stockLevel} className={className} />
      <span className="text-sm text-gray-600">{stock} kg</span>
    </div>
  );
};
