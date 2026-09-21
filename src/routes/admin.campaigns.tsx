import { createFileRoute } from "@tanstack/react-router";
import { PromotionsAdmin } from "../components/admin-promotions";

export const Route = createFileRoute("/admin/campaigns")({
  component: () => <PromotionsAdmin kind="campaigns" />,
});
