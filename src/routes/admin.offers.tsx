import { createFileRoute } from "@tanstack/react-router";
import { PromotionsAdmin } from "../components/admin-promotions";

export const Route = createFileRoute("/admin/offers")({
  component: () => <PromotionsAdmin kind="offers" />,
});
