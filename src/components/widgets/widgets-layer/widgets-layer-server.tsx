import { getWidgetPositions } from "@/actions/widget-positions-get";
import { WidgetsLayerClient } from "./widgets-layer-client";

import { Suspense } from "react";

async function WidgetsLayerData() {
  const positions = await getWidgetPositions();
  return <WidgetsLayerClient positions={positions} />;
}

export default function WidgetsLayerServer() {
  return (
    <Suspense fallback={null}>
      <WidgetsLayerData />
    </Suspense>
  );
}
