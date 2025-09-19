import React from "react";
import { useIngredientTableController } from "../controller/tableController";
import { LocalDataSource } from "../services/localDataSource";

const dataSource = new LocalDataSource();

export const SimpleTest: React.FC = () => {
  const controller = useIngredientTableController({
    dataSource,
    initialPageSize: 25,
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Ingredient Library Test</h1>
      <p>Loading: {controller.isLoading ? "Yes" : "No"}</p>
      <p>Error: {controller.error || "None"}</p>
      <p>Data count: {controller.data.length}</p>
    </div>
  );
};
