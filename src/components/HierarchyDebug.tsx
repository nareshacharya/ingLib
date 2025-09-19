import React from "react";
import { AdvancedTableController } from "../features/ingredient-library/controller/advancedTableController";
import { INGREDIENTS_SEED } from "../features/ingredient-library/data/ingredients.sample";

export const HierarchyDebug: React.FC = () => {
  // Find ingredients with parentId in the sample data
  const childIngredients = INGREDIENTS_SEED.filter((item) => item.parentId);
  const parentIngredients = INGREDIENTS_SEED.filter((item) => !item.parentId);

  console.log("Child ingredients:", childIngredients.slice(0, 5));
  console.log("Parent ingredients:", parentIngredients.slice(0, 5));

  const hierarchicalData =
    AdvancedTableController.buildHierarchicalData(INGREDIENTS_SEED);
  console.log(
    "Hierarchical data (first 3 items):",
    hierarchicalData.slice(0, 3)
  );

  // Find some parent items that should have children
  const parentsWithChildren = hierarchicalData.filter(
    (item) => item.subRows && item.subRows.length > 0
  );
  console.log("Parents with children:", parentsWithChildren.slice(0, 3));

  return (
    <div className="p-4 border-b">
      <h2 className="text-xl font-bold mb-4">Hierarchy Debug</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div>
            <strong>Total ingredients:</strong> {INGREDIENTS_SEED.length}
          </div>
          <div>
            <strong>Parent ingredients:</strong> {parentIngredients.length}
          </div>
          <div>
            <strong>Child ingredients:</strong> {childIngredients.length}
          </div>
        </div>
        <div>
          <div>
            <strong>Hierarchical data items:</strong> {hierarchicalData.length}
          </div>
          <div>
            <strong>Items with subRows:</strong> {parentsWithChildren.length}
          </div>
        </div>
      </div>

      {childIngredients.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold">Sample child ingredient:</h3>
          <div className="bg-gray-100 p-2 text-sm">
            ID: {childIngredients[0].id}, Name: {childIngredients[0].name},
            ParentID: {childIngredients[0].parentId}
          </div>
        </div>
      )}

      {parentsWithChildren.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold">Sample parent with children:</h3>
          <div className="bg-gray-100 p-2 text-sm">
            <div>
              <strong>Parent:</strong> {parentsWithChildren[0].name} (ID:{" "}
              {parentsWithChildren[0].id})
            </div>
            <div>
              <strong>Children:</strong>{" "}
              {parentsWithChildren[0].subRows?.length} items
            </div>
            {parentsWithChildren[0].subRows &&
              parentsWithChildren[0].subRows.length > 0 && (
                <div>
                  <strong>First child:</strong>{" "}
                  {parentsWithChildren[0].subRows[0].name}
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
};
