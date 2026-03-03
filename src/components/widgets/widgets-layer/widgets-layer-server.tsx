import { getWidgetPositions } from "@/actions/widget-positions-get";
import { WidgetsLayerClient } from "./widgets-layer-client";

export default async function WidgetsLayerServer() {
  const positions = await getWidgetPositions();
  return <WidgetsLayerClient positions={positions} />;
}
